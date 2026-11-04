"use client";

import { useEffect, useImperativeHandle, useMemo, useRef, type RefObject } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import * as THREE from "three";
import { MAX_HP, type DroneDef, type DroneId, type FireResult, type GamePalette, type SceneApi, type Shared } from "./types";

/* ================================================================== */
/* Shaders                                                             */
/* ================================================================== */
const skyVert = /* glsl */ `
  varying vec3 vPos;
  void main() {
    vPos = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;
const skyFrag = /* glsl */ `
  uniform vec3 uTop;
  uniform vec3 uBottom;
  uniform vec3 uHorizon;
  uniform float uGlow;
  varying vec3 vPos;
  void main() {
    float h = normalize(vPos).y;
    vec3 c = mix(uBottom, uTop, smoothstep(-0.05, 0.55, h));
    c += uHorizon * exp(-abs(h) * 14.0) * uGlow;
    gl_FragColor = vec4(c, 1.0);
  }
`;

const gridVert = /* glsl */ `
  varying vec3 vW;
  void main() {
    vec4 w = modelMatrix * vec4(position, 1.0);
    vW = w.xyz;
    gl_Position = projectionMatrix * viewMatrix * w;
  }
`;
const gridFrag = /* glsl */ `
  uniform vec3 uColor;
  uniform float uTime;
  uniform float uOpacity;
  varying vec3 vW;
  float grid(vec2 p, float s) {
    vec2 q = p / s;
    vec2 g = abs(fract(q - 0.5) - 0.5) / fwidth(q);
    return 1.0 - min(min(g.x, g.y), 1.0);
  }
  void main() {
    vec2 p = vW.xz;
    float d = length(p);
    float lines = grid(p, 1.0) * 0.3 * smoothstep(14.0, 3.0, d) + grid(p, 5.0) * 0.75;
    float ring = smoothstep(0.035, 0.0, 0.5 - abs(fract(d * 0.12 - uTime * 0.12) - 0.5));
    float fade = smoothstep(30.0, 4.0, d);
    float a = (lines + ring * 0.8) * fade * uOpacity;
    gl_FragColor = vec4(uColor, a);
  }
`;

/* ================================================================== */
/* Static layout                                                       */
/* ================================================================== */
const DRONE_BASE: Record<DroneId, { pos: [number, number, number]; phase: number; amp: number }> = {
  about: { pos: [-3.4, 2.3, -5.2], phase: 0, amp: 1.3 },
  skills: { pos: [0, 1.7, -7.6], phase: 2.1, amp: 1.8 },
  projects: { pos: [3.4, 2.7, -5.2], phase: 4.2, amp: 1.3 },
};

const MONOLITHS = Array.from({ length: 12 }, (_, i) => {
  const a = (i / 12) * Math.PI * 2 + 0.26;
  const h = 3 + ((i * 37) % 5);
  return { x: Math.sin(a) * 15, z: Math.cos(a) * 15 - 3, h, rot: -a };
});

type DroneRT = {
  hp: number;
  alive: boolean;
  flash: number;
  punch: number;
  group: THREE.Group | null;
  core: THREE.Mesh | null;
  shell: THREE.Mesh | null;
  hitbox: THREE.Mesh | null;
  ringA: THREE.Mesh | null;
  ringB: THREE.Mesh | null;
};

const makeRT = (): DroneRT => ({
  hp: MAX_HP,
  alive: true,
  flash: 0,
  punch: 0,
  group: null,
  core: null,
  shell: null,
  hitbox: null,
  ringA: null,
  ringB: null,
});

type Tracer = { mesh: THREE.Mesh; life: number };
type Burst = { points: THREE.Points; vel: Float32Array; life: number; decay: number };
type Wave = { mesh: THREE.Mesh; life: number };

const UP = new THREE.Vector3(0, 1, 0);
const tracerGeo = new THREE.CylinderGeometry(0.01, 0.01, 1, 6, 1, true);
const waveGeo = new THREE.RingGeometry(0.55, 0.62, 64);

function makeBurstGeometry(origin: THREE.Vector3, count: number, speed: number) {
  const pos = new Float32Array(count * 3);
  const vel = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    pos.set([origin.x, origin.y, origin.z], i * 3);
    const th = Math.random() * Math.PI * 2;
    const ph = Math.acos(2 * Math.random() - 1);
    const s = speed * (0.35 + Math.random() * 0.65);
    vel.set([Math.sin(ph) * Math.cos(th) * s, Math.cos(ph) * s + speed * 0.3, Math.sin(ph) * Math.sin(th) * s], i * 3);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  return { geometry: g, vel };
}

/* ================================================================== */
/* Scene                                                               */
/* ================================================================== */
export default function RangeScene({
  palette,
  shared,
  apiRef,
  drones,
  onHover,
}: {
  palette: GamePalette;
  shared: RefObject<Shared>;
  apiRef: RefObject<SceneApi | null>;
  drones: DroneDef[];
  onHover: (id: DroneId | null) => void;
}) {
  const { camera } = useThree();
  const rt = useRef<Record<DroneId, DroneRT>>({ about: makeRT(), skills: makeRT(), projects: makeRT() });
  const env = useRef<THREE.Object3D[]>([]);
  const fxRoot = useRef<THREE.Group>(null);
  const weapon = useRef<THREE.Group>(null);
  const muzzle = useRef<THREE.Object3D>(null);
  const flash = useRef<THREE.Mesh>(null);
  const flashLight = useRef<THREE.PointLight>(null);
  const gridMat = useRef<THREE.ShaderMaterial>(null);
  const fx = useRef({ tracers: [] as Tracer[], bursts: [] as Burst[], waves: [] as Wave[] });
  const player = useRef({ x: 0, z: 4.2, yaw: 0, bob: 0, moving: 0 });
  const gun = useRef({ recoil: 0, pitch: 0, flash: 0 });
  const lastHover = useRef<DroneId | null>(null);

  const tmp = useMemo(
    () => ({
      raycaster: new THREE.Raycaster(),
      ndc: new THREE.Vector2(),
      v1: new THREE.Vector3(),
      v2: new THREE.Vector3(),
      q: new THREE.Quaternion(),
    }),
    [],
  );

  const skyUniforms = useMemo(
    () => ({
      uTop: { value: new THREE.Color(palette.skyTop) },
      uBottom: { value: new THREE.Color(palette.skyBottom) },
      uHorizon: { value: new THREE.Color(palette.horizon) },
      uGlow: { value: palette.dark ? 0.35 : 0.6 },
    }),
    [palette],
  );
  const gridUniforms = useMemo(
    () => ({
      uColor: { value: new THREE.Color(palette.grid) },
      uTime: { value: 0 },
      uOpacity: { value: palette.dark ? 0.75 : 0.5 },
    }),
    [palette],
  );

  const blending = palette.dark ? THREE.AdditiveBlending : THREE.NormalBlending;

  /* ---------- FX spawners ---------- */
  const spawnTracer = (from: THREE.Vector3, to: THREE.Vector3, color: string) => {
    const dir = tmp.v1.copy(to).sub(from);
    const len = dir.length();
    const mesh = new THREE.Mesh(
      tracerGeo,
      new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 1, blending, depthWrite: false, toneMapped: false }),
    );
    mesh.position.copy(from).addScaledVector(dir, 0.5);
    mesh.quaternion.setFromUnitVectors(UP, dir.normalize());
    mesh.scale.set(palette.dark ? 1.6 : 1.2, len, palette.dark ? 1.6 : 1.2);
    fxRoot.current?.add(mesh);
    fx.current.tracers.push({ mesh, life: 1 });
  };

  const spawnBurst = (at: THREE.Vector3, color: string, count: number, speed: number, size: number) => {
    const { geometry, vel } = makeBurstGeometry(at, count, speed);
    const points = new THREE.Points(
      geometry,
      new THREE.PointsMaterial({ color, size, transparent: true, opacity: 1, blending, depthWrite: false, toneMapped: false }),
    );
    fxRoot.current?.add(points);
    fx.current.bursts.push({ points, vel, life: 1, decay: 1.4 });
  };

  const spawnWave = (at: THREE.Vector3, color: string) => {
    const mesh = new THREE.Mesh(
      waveGeo,
      new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 1, side: THREE.DoubleSide, blending, depthWrite: false, toneMapped: false }),
    );
    mesh.position.copy(at);
    mesh.lookAt(camera.position);
    fxRoot.current?.add(mesh);
    fx.current.waves.push({ mesh, life: 1 });
  };

  /* ---------- Firing ---------- */
  useImperativeHandle(
    apiRef,
    () => ({
      fire: (): FireResult => {
        const s = shared.current;
        // Sync the look-offset to the latest aim before casting (taps can jump the aim between frames).
        camera.rotation.set(s.aimY * 0.09 - gun.current.pitch * 0.025, player.current.yaw - s.aimX * 0.14, 0, "YXZ");
        camera.updateMatrixWorld();
        tmp.ndc.set(s.aimX, s.aimY);
        tmp.raycaster.setFromCamera(tmp.ndc, camera);
        gun.current.recoil = 1;
        gun.current.pitch = 1;
        gun.current.flash = 1;

        const from = new THREE.Vector3();
        muzzle.current?.getWorldPosition(from);

        const targets: THREE.Object3D[] = [];
        (Object.keys(rt.current) as DroneId[]).forEach((id) => {
          const d = rt.current[id];
          if (d.alive && d.hitbox && d.core) targets.push(d.hitbox, d.core);
        });
        const hits = tmp.raycaster.intersectObjects(targets, false);

        if (hits.length > 0) {
          const id = hits[0].object.userData.id as DroneId;
          const d = rt.current[id];
          const color = palette.drones[id];
          const crit = hits.some((h) => h.object.userData.id === id && h.object.userData.part === "core");
          d.hp = Math.max(0, d.hp - (crit ? 2 : 1));
          d.flash = 1;
          d.punch = 1;
          spawnTracer(from, hits[0].point, color);
          spawnBurst(hits[0].point, color, crit ? 40 : 22, crit ? 4 : 2.6, palette.dark ? 0.07 : 0.06);

          const killed = d.hp <= 0;
          if (killed && d.group) {
            d.alive = false;
            const at = d.group.position.clone();
            d.group.visible = false;
            spawnBurst(at, color, 160, 6.5, palette.dark ? 0.11 : 0.09);
            spawnBurst(at, palette.tracer, 60, 3.2, 0.05);
            spawnWave(at, color);
          }
          return { id, crit, killed, hp: d.hp };
        }

        const envHits = tmp.raycaster.intersectObjects(env.current, false);
        const end = envHits[0]?.point ?? tmp.raycaster.ray.at(40, new THREE.Vector3());
        spawnTracer(from, end, palette.tracer);
        if (envHits[0] && envHits[0].object.userData.kind !== "sky") {
          spawnBurst(end, palette.grid, 14, 1.8, 0.05);
        }
        return null;
      },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [palette, camera],
  );

  /* ---------- Cleanup FX on unmount ---------- */
  useEffect(() => {
    const store = fx.current;
    return () => {
      store.tracers.forEach((t) => (t.mesh.material as THREE.Material).dispose());
      store.bursts.forEach((b) => {
        b.points.geometry.dispose();
        (b.points.material as THREE.Material).dispose();
      });
      store.waves.forEach((w) => (w.mesh.material as THREE.Material).dispose());
    };
  }, []);

  /* ---------- Main loop ---------- */
  useFrame((state, rawDt) => {
    const dt = Math.min(rawDt, 0.05);
    const t = state.clock.elapsedTime;
    const s = shared.current;
    const p = player.current;

    if (gridMat.current) gridMat.current.uniforms.uTime.value = t;

    // --- Player movement (WASD relative to facing, Q/E/arrows/touch to turn)
    if (!s.paused) {
      const k = s.keys;
      const turn = (k.KeyQ || k.ArrowLeft ? 1 : 0) - (k.KeyE || k.ArrowRight ? 1 : 0) + s.turn;
      p.yaw += turn * dt * 1.9;
      const f = (k.KeyW || k.ArrowUp ? 1 : 0) - (k.KeyS || k.ArrowDown ? 1 : 0);
      const r = (k.KeyD ? 1 : 0) - (k.KeyA ? 1 : 0);
      const sin = Math.sin(p.yaw);
      const cos = Math.cos(p.yaw);
      const speed = 3.4 * dt;
      p.x += (-sin * f + cos * r) * speed;
      p.z += (-cos * f - sin * r) * speed;
      const rad = Math.hypot(p.x, p.z + 1);
      if (rad > 7.5) {
        p.x *= 7.5 / rad;
        p.z = (p.z + 1) * (7.5 / rad) - 1;
      }
      p.moving = THREE.MathUtils.lerp(p.moving, f !== 0 || r !== 0 ? 1 : 0, 0.15);
    }
    p.bob += dt * (6 + p.moving * 4);

    // --- Camera: position + yaw, with look offset toward the aim point
    camera.position.set(p.x, 1.62 + Math.sin(p.bob * 2) * 0.025 * p.moving, p.z);
    camera.rotation.set(s.aimY * 0.09 - gun.current.pitch * 0.025, p.yaw - s.aimX * 0.14, 0, "YXZ");

    // --- Weapon follows the camera with sway, bob, recoil and reload dip
    const g = gun.current;
    g.recoil = THREE.MathUtils.lerp(g.recoil, 0, 0.22);
    g.pitch = THREE.MathUtils.lerp(g.pitch, 0, 0.18);
    g.flash = Math.max(0, g.flash - dt * 22);
    const reload = s.reloading > 0 ? Math.sin(s.reloading * Math.PI) : 0;
    if (weapon.current) {
      const w = weapon.current;
      w.position.copy(camera.position);
      w.quaternion.copy(camera.quaternion);
      w.translateX(0.26 + Math.cos(p.bob) * 0.012 * p.moving + s.aimX * 0.03);
      w.translateY(-0.24 + Math.abs(Math.sin(p.bob)) * 0.014 * p.moving - reload * 0.18 + s.aimY * 0.02);
      w.translateZ(-0.52 + g.recoil * 0.07);
      w.rotateY(-s.aimX * 0.12);
      w.rotateX(s.aimY * 0.1 + g.pitch * 0.12 - reload * 0.6);
      w.rotateZ(reload * 0.5);
    }
    if (flash.current) {
      flash.current.visible = g.flash > 0.01;
      flash.current.scale.setScalar(0.6 + g.flash * 0.8);
      flash.current.rotation.z = t * 40;
    }
    if (flashLight.current) flashLight.current.intensity = g.flash * (palette.dark ? 14 : 6);

    // --- Drones
    const speedMul = 1 + s.kills * 0.45;
    (Object.keys(rt.current) as DroneId[]).forEach((id) => {
      const d = rt.current[id];
      if (!d.group || !d.alive) return;
      const b = DRONE_BASE[id];
      const tt = t * speedMul;
      d.group.position.set(
        b.pos[0] + Math.sin(tt * 0.55 + b.phase) * b.amp,
        b.pos[1] + Math.sin(tt * 1.3 + b.phase) * 0.35,
        b.pos[2] + Math.cos(tt * 0.4 + b.phase) * 0.9,
      );
      d.flash = Math.max(0, d.flash - dt * 5);
      d.punch = Math.max(0, d.punch - dt * 6);
      const sc = 1 + d.punch * 0.18;
      d.group.scale.setScalar(sc);
      if (d.core) {
        d.core.rotation.x += dt * 0.8;
        d.core.rotation.y += dt * 1.1;
        const m = d.core.material as THREE.MeshStandardMaterial;
        m.emissiveIntensity = (palette.dark ? 1.6 : 0.6) + d.flash * 4;
      }
      if (d.shell) {
        d.shell.rotation.y -= dt * 0.4;
        const m = d.shell.material as THREE.MeshBasicMaterial;
        m.opacity = (palette.dark ? 0.35 : 0.45) + d.flash * 0.6;
      }
      if (d.ringA) d.ringA.rotation.set(t * 1.2, t * 0.7, 0);
      if (d.ringB) d.ringB.rotation.set(-t * 0.6, 0, t * 1.4);
    });

    // --- Project DOM labels above each drone
    (Object.keys(rt.current) as DroneId[]).forEach((id) => {
      const el = s.labels[id];
      const d = rt.current[id];
      if (!el) return;
      if (!d.group || !d.alive) {
        el.style.opacity = "0";
        return;
      }
      const v = tmp.v2.copy(d.group.position);
      v.y += 1.3;
      const dist = v.distanceTo(camera.position);
      v.project(camera);
      const behind = v.z > 1;
      const x = (v.x * 0.5 + 0.5) * state.size.width;
      const y = (-v.y * 0.5 + 0.5) * state.size.height;
      const sc = THREE.MathUtils.clamp(7 / dist, 0.55, 1.15);
      el.style.opacity = behind ? "0" : "1";
      el.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -100%) scale(${sc})`;
    });

    // --- Hover detection (for crosshair lock-on)
    tmp.ndc.set(s.aimX, s.aimY);
    tmp.raycaster.setFromCamera(tmp.ndc, camera);
    const hb: THREE.Object3D[] = [];
    (Object.keys(rt.current) as DroneId[]).forEach((id) => {
      const d = rt.current[id];
      if (d.alive && d.hitbox) hb.push(d.hitbox);
    });
    const hov = (tmp.raycaster.intersectObjects(hb, false)[0]?.object.userData.id as DroneId | undefined) ?? null;
    if (hov !== lastHover.current) {
      lastHover.current = hov;
      onHover(hov);
    }

    // --- FX update
    const store = fx.current;
    store.tracers = store.tracers.filter((tr) => {
      tr.life -= dt * 9;
      const m = tr.mesh.material as THREE.MeshBasicMaterial;
      m.opacity = Math.max(0, tr.life);
      if (tr.life <= 0) {
        fxRoot.current?.remove(tr.mesh);
        m.dispose();
        return false;
      }
      return true;
    });
    store.bursts = store.bursts.filter((bu) => {
      bu.life -= dt * bu.decay;
      const attr = bu.points.geometry.getAttribute("position") as THREE.BufferAttribute;
      const arr = attr.array as Float32Array;
      for (let i = 0; i < arr.length; i += 3) {
        bu.vel[i + 1] -= 6 * dt;
        bu.vel[i] *= 0.97;
        bu.vel[i + 2] *= 0.97;
        arr[i] += bu.vel[i] * dt;
        arr[i + 1] = Math.max(0.02, arr[i + 1] + bu.vel[i + 1] * dt);
        arr[i + 2] += bu.vel[i + 2] * dt;
      }
      attr.needsUpdate = true;
      (bu.points.material as THREE.PointsMaterial).opacity = Math.max(0, bu.life);
      if (bu.life <= 0) {
        fxRoot.current?.remove(bu.points);
        bu.points.geometry.dispose();
        (bu.points.material as THREE.Material).dispose();
        return false;
      }
      return true;
    });
    store.waves = store.waves.filter((wv) => {
      wv.life -= dt * 1.6;
      wv.mesh.scale.setScalar(1 + (1 - wv.life) * 7);
      (wv.mesh.material as THREE.MeshBasicMaterial).opacity = Math.max(0, wv.life);
      if (wv.life <= 0) {
        fxRoot.current?.remove(wv.mesh);
        (wv.mesh.material as THREE.Material).dispose();
        return false;
      }
      return true;
    });
  });

  const addEnv = (o: THREE.Object3D | null) => {
    if (o && !env.current.includes(o)) env.current.push(o);
  };

  return (
    <>
      <color attach="background" args={[palette.skyBottom]} />
      <fog attach="fog" args={[palette.fog, 12, 55]} />

      {/* Lighting */}
      <hemisphereLight args={[palette.skyTop, palette.floor, palette.dark ? 0.35 : 1.1]} />
      <directionalLight
        position={[6, 12, 6]}
        intensity={palette.dark ? 0.6 : 2.2}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-14}
        shadow-camera-right={14}
        shadow-camera-top={14}
        shadow-camera-bottom={-14}
      />
      <pointLight position={[0, 6, -6]} color={palette.strip} intensity={palette.dark ? 8 : 8} distance={18} />

      {/* Sky dome */}
      <mesh ref={addEnv} userData={{ kind: "sky" }} scale={80}>
        <sphereGeometry args={[1, 32, 16]} />
        <shaderMaterial vertexShader={skyVert} fragmentShader={skyFrag} uniforms={skyUniforms} side={THREE.BackSide} depthWrite={false} fog={false} />
      </mesh>
      {palette.dark && <Stars radius={60} depth={20} count={2500} factor={3} saturation={0} fade speed={0.6} />}

      {/* Floor + animated grid */}
      <mesh ref={addEnv} userData={{ kind: "floor" }} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[45, 64]} />
        <meshStandardMaterial color={palette.floor} roughness={palette.dark ? 0.55 : 0.9} metalness={palette.dark ? 0.35 : 0} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0]}>
        <planeGeometry args={[90, 90]} />
        <shaderMaterial
          ref={gridMat}
          vertexShader={gridVert}
          fragmentShader={gridFrag}
          uniforms={gridUniforms}
          transparent
          depthWrite={false}
          blending={blending}
        />
      </mesh>

      {/* Firing line */}
      <mesh position={[0, 0.012, 2.6]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[9, 0.06]} />
        <meshBasicMaterial color={palette.strip} toneMapped={false} />
      </mesh>

      {/* Monolith ring */}
      {MONOLITHS.map((m, i) => (
        <group key={i} position={[m.x, 0, m.z]} rotation={[0, m.rot, 0]}>
          <mesh ref={addEnv} userData={{ kind: "wall" }} position={[0, m.h / 2, 0]} castShadow receiveShadow>
            <boxGeometry args={[1.6, m.h, 0.6]} />
            <meshStandardMaterial color={palette.monolith} roughness={palette.dark ? 0.4 : 0.6} metalness={palette.dark ? 0.7 : 0.05} />
          </mesh>
          <mesh position={[0, m.h / 2, 0.31]}>
            <boxGeometry args={[0.05, m.h * 0.8, 0.01]} />
            <meshBasicMaterial color={palette.strip} toneMapped={false} />
          </mesh>
        </group>
      ))}

      {/* Orbit halo above the arena */}
      <mesh position={[0, 7, -6]} rotation={[Math.PI / 2.2, 0, 0]}>
        <torusGeometry args={[9, 0.025, 8, 160]} />
        <meshBasicMaterial color={palette.strip} toneMapped={false} transparent opacity={palette.dark ? 0.9 : 0.5} />
      </mesh>

      {/* Drones */}
      {drones.map((def) => {
        const color = palette.drones[def.id];
        const d = rt.current[def.id];
        return (
          <group
            key={def.id}
            ref={(g) => {
              d.group = g;
            }}
            position={DRONE_BASE[def.id].pos}
          >
            <mesh
              ref={(m) => {
                d.core = m;
                if (m) m.userData = { id: def.id, part: "core" };
              }}
              castShadow
            >
              <icosahedronGeometry args={[0.34, 0]} />
              <meshStandardMaterial
                color={color}
                emissive={color}
                emissiveIntensity={palette.dark ? 1.6 : 0.6}
                roughness={0.2}
                metalness={0.3}
                flatShading
                toneMapped={false}
              />
            </mesh>
            <mesh
              ref={(m) => {
                d.shell = m;
              }}
            >
              <icosahedronGeometry args={[0.62, 1]} />
              <meshBasicMaterial color={color} wireframe transparent opacity={0.4} toneMapped={false} />
            </mesh>
            <mesh
              ref={(m) => {
                d.ringA = m;
              }}
            >
              <torusGeometry args={[0.85, 0.018, 8, 64]} />
              <meshBasicMaterial color={color} toneMapped={false} />
            </mesh>
            <mesh
              ref={(m) => {
                d.ringB = m;
              }}
            >
              <torusGeometry args={[1.0, 0.01, 8, 64]} />
              <meshBasicMaterial color={palette.dark ? "#ffffff" : "#0f172a"} transparent opacity={0.5} />
            </mesh>
            <mesh
              ref={(m) => {
                d.hitbox = m;
                if (m) m.userData = { id: def.id, part: "shell" };
              }}
            >
              <sphereGeometry args={[0.8, 12, 12]} />
              <meshBasicMaterial visible={false} />
            </mesh>
            <pointLight color={color} intensity={palette.dark ? 6 : 2} distance={5} />

          </group>
        );
      })}

      {/* Weapon — original sci-fi blaster built from primitives */}
      <group ref={weapon}>
        <mesh castShadow>
          <boxGeometry args={[0.085, 0.1, 0.42]} />
          <meshStandardMaterial color={palette.weapon} metalness={0.75} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0.066, -0.02]}>
          <boxGeometry args={[0.045, 0.025, 0.3]} />
          <meshStandardMaterial color={palette.weaponTrim} metalness={0.6} roughness={0.35} />
        </mesh>
        <mesh position={[0, 0.098, -0.06]}>
          <torusGeometry args={[0.024, 0.005, 8, 24]} />
          <meshBasicMaterial color={palette.energy} toneMapped={false} />
        </mesh>
        <mesh position={[0, 0.01, -0.36]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.02, 0.022, 0.34, 16]} />
          <meshStandardMaterial color={palette.weaponTrim} metalness={0.9} roughness={0.2} />
        </mesh>
        <mesh position={[0, 0.01, -0.25]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.038, 0.038, 0.16, 20]} />
          <meshStandardMaterial color={palette.weapon} metalness={0.8} roughness={0.25} />
        </mesh>
        {[-0.2, -0.25, -0.3].map((z) => (
          <mesh key={z} position={[0, 0.01, z]}>
            <torusGeometry args={[0.04, 0.004, 6, 24]} />
            <meshBasicMaterial color={palette.energy} toneMapped={false} />
          </mesh>
        ))}
        <mesh position={[0.052, 0.0, 0.02]} rotation={[Math.PI / 2, 0, 0]}>
          <capsuleGeometry args={[0.018, 0.14, 6, 12]} />
          <meshStandardMaterial color={palette.energy} emissive={palette.energy} emissiveIntensity={palette.dark ? 2 : 0.8} toneMapped={false} />
        </mesh>
        <mesh position={[0, -0.1, 0.11]} rotation={[0.35, 0, 0]}>
          <boxGeometry args={[0.05, 0.14, 0.06]} />
          <meshStandardMaterial color={palette.weaponTrim} metalness={0.4} roughness={0.6} />
        </mesh>
        <mesh position={[0, -0.09, -0.08]} rotation={[-0.15, 0, 0]}>
          <boxGeometry args={[0.048, 0.12, 0.07]} />
          <meshStandardMaterial color={palette.weapon} metalness={0.6} roughness={0.35} />
        </mesh>
        <object3D ref={muzzle} position={[0, 0.01, -0.56]}>
          <mesh ref={flash} visible={false}>
            <planeGeometry args={[0.22, 0.22]} />
            <meshBasicMaterial color={palette.tracer} transparent opacity={0.9} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} side={THREE.DoubleSide} />
          </mesh>
          <pointLight ref={flashLight} color={palette.energy} intensity={0} distance={6} />
        </object3D>
      </group>

      <group ref={fxRoot} />

      <EffectComposer multisampling={0}>
        <Bloom
          mipmapBlur
          intensity={palette.dark ? 0.9 : 0.35}
          luminanceThreshold={palette.dark ? 0.5 : 0.85}
          luminanceSmoothing={0.2}
        />
        <Vignette eskil={false} offset={0.25} darkness={palette.dark ? 0.75 : 0.35} />
      </EffectComposer>
    </>
  );
}
