"use client";

import { useEffect, useMemo, useRef, useState, type ComponentRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, MeshDistortMaterial, PerformanceMonitor } from "@react-three/drei";
import * as THREE from "three";

type Palette = {
  a: string;
  b: string;
  c: string;
  star: string;
  core: string;
  additive: boolean;
};

const PALETTES: Record<"light" | "dark", Palette> = {
  dark: { a: "#00f5d4", b: "#b388ff", c: "#ff3d81", star: "#cfe9ff", core: "#05060a", additive: true },
  light: { a: "#00a28c", b: "#7c3aed", c: "#e11d74", star: "#334155", core: "#eefcf9", additive: false },
};

/* Shared, frame-rate independent input state (no React re-renders). */
const input = { mx: 0, my: 0, scroll: 0, screens: 0, velocity: 0 };

function useGlobalInput() {
  useEffect(() => {
    let last = window.scrollY;
    const onMove = (e: PointerEvent) => {
      input.mx = (e.clientX / window.innerWidth) * 2 - 1;
      input.my = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    const onScroll = () => {
      const y = window.scrollY;
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      input.scroll = y / max;
      input.screens = y / window.innerHeight;
      input.velocity += (y - last) * 0.002;
      last = y;
    };
    onScroll();
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);
}

/* ---------- Starfield: points spread over a deep shell for real parallax ---------- */
function buildStarGeometry(count: number, palette: Palette) {
  {
    const g = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const tints = [new THREE.Color(palette.star), new THREE.Color(palette.a), new THREE.Color(palette.b)];
    for (let i = 0; i < count; i++) {
      const r = 18 + Math.random() * 60;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi) - 20;
      const c = tints[Math.random() < 0.8 ? 0 : Math.random() < 0.5 ? 1 : 2];
      col.set([c.r, c.g, c.b], i * 3);
    }
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    g.setAttribute("color", new THREE.BufferAttribute(col, 3));
    return g;
  }
}

function Starfield({ palette, count }: { palette: Palette; count: number }) {
  const ref = useRef<THREE.Points>(null);
  const geometry = useMemo(() => buildStarGeometry(count, palette), [count, palette]);

  useFrame((_, dt) => {
    if (!ref.current) return;
    ref.current.rotation.y += dt * 0.015;
    ref.current.rotation.x = THREE.MathUtils.lerp(ref.current.rotation.x, input.my * 0.08 + input.scroll * 0.6, 0.04);
  });

  return (
    <points ref={ref} geometry={geometry}>
      <pointsMaterial
        size={palette.additive ? 0.12 : 0.09}
        sizeAttenuation
        vertexColors
        transparent
        opacity={palette.additive ? 0.9 : 0.45}
        depthWrite={false}
        blending={palette.additive ? THREE.AdditiveBlending : THREE.NormalBlending}
      />
    </points>
  );
}

/* ---------- Particle wave system (GPU animated) ---------- */
const waveVertex = /* glsl */ `
  uniform float uTime;
  uniform float uScroll;
  uniform vec2 uMouse;
  varying float vH;
  void main() {
    vec3 p = position;
    float d = distance(p.xz, uMouse * vec2(14.0, 6.0));
    float h = sin(p.x * 0.35 + uTime * 0.9) * 0.6
            + cos(p.z * 0.45 + uTime * 0.7) * 0.5
            + sin((p.x + p.z) * 0.18 + uTime * 0.4) * 0.8;
    h += exp(-d * 0.35) * 1.6 * sin(uTime * 3.0 - d);
    h *= 1.0 + uScroll * 1.5;
    p.y += h;
    vH = h;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_PointSize = (2.2 + h * 0.6) * (22.0 / -mv.z);
    gl_Position = projectionMatrix * mv;
  }
`;

const waveFragment = /* glsl */ `
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform float uAlpha;
  varying float vH;
  void main() {
    float r = length(gl_PointCoord - 0.5);
    if (r > 0.5) discard;
    float glow = smoothstep(0.5, 0.0, r);
    vec3 c = mix(uColorA, uColorB, clamp(vH * 0.35 + 0.5, 0.0, 1.0));
    gl_FragColor = vec4(c, glow * uAlpha);
  }
`;

function Wave({ palette, density }: { palette: Palette; density: number }) {
  const ref = useRef<THREE.Points>(null);
  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const cols = density;
    const rows = Math.round(density * 0.5);
    const pos = new Float32Array(cols * rows * 3);
    let i = 0;
    for (let x = 0; x < cols; x++) {
      for (let z = 0; z < rows; z++) {
        pos[i++] = (x / cols - 0.5) * 60;
        pos[i++] = 0;
        pos[i++] = (z / rows - 0.5) * 26;
      }
    }
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    return g;
  }, [density]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uScroll: { value: 0 },
      uMouse: { value: new THREE.Vector2() },
      uColorA: { value: new THREE.Color(palette.a) },
      uColorB: { value: new THREE.Color(palette.b) },
      uAlpha: { value: palette.additive ? 0.85 : 0.55 },
    }),
    [palette],
  );

  const mat = useRef<THREE.ShaderMaterial>(null);
  const mouseTarget = useMemo(() => new THREE.Vector2(), []);

  useFrame((state) => {
    const u = mat.current?.uniforms;
    if (!u) return;
    u.uTime.value = state.clock.elapsedTime;
    u.uScroll.value = THREE.MathUtils.lerp(u.uScroll.value, input.scroll, 0.05);
    (u.uMouse.value as THREE.Vector2).lerp(mouseTarget.set(input.mx, -input.my), 0.05);
  });

  return (
    <points ref={ref} geometry={geometry} position={[0, -6, -8]} rotation={[0.18, 0, 0]}>
      <shaderMaterial
        ref={mat}
        vertexShader={waveVertex}
        fragmentShader={waveFragment}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={palette.additive ? THREE.AdditiveBlending : THREE.NormalBlending}
      />
    </points>
  );
}

/* ---------- Hero sculpture: distorted core + wire shell + orbiters ---------- */
function Sculpture({ palette, compact }: { palette: Palette; compact: boolean }) {
  const group = useRef<THREE.Group>(null);
  const shell = useRef<THREE.Mesh>(null);
  const knot = useRef<THREE.Mesh>(null);
  const matRef = useRef<ComponentRef<typeof MeshDistortMaterial>>(null);
  const { viewport } = useThree();

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime;
    input.velocity *= 0.92;
    if (group.current) {
      // Once the hero is gone the sculpture sits far above the frustum: skip drawing it entirely.
      group.current.visible = input.screens < 2.2;
      if (!group.current.visible) return;
      const baseX = compact ? viewport.width * 0.28 : viewport.width * 0.22;
      group.current.position.x = THREE.MathUtils.lerp(group.current.position.x, baseX + input.mx * 0.4, 0.05);
      group.current.position.y = THREE.MathUtils.lerp(
        group.current.position.y,
        (compact ? 1.8 : 0.2) + input.my * 0.3 + Math.min(input.screens, 3) * 5,
        0.08,
      );
      group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, input.mx * 0.6 + t * 0.1, 0.05);
      group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, -input.my * 0.4, 0.05);
    }
    if (shell.current) {
      shell.current.rotation.x += dt * 0.12;
      shell.current.rotation.z -= dt * 0.08;
    }
    if (knot.current) {
      knot.current.rotation.y -= dt * 0.25;
      knot.current.rotation.x += dt * 0.1;
    }
    if (matRef.current) {
      const target = 0.35 + Math.min(Math.abs(input.velocity), 1.2) * 0.5;
      matRef.current.distort = THREE.MathUtils.lerp(matRef.current.distort, target, 0.08);
    }
  });

  const scale = compact ? 0.55 : 1;

  return (
    <group ref={group} scale={scale}>
      <Float speed={1.6} rotationIntensity={0.6} floatIntensity={1.2}>
        <mesh>
          <icosahedronGeometry args={[1.55, compact ? 20 : 32]} />
          <MeshDistortMaterial
            ref={matRef}
            color={palette.core}
            emissive={palette.a}
            emissiveIntensity={palette.additive ? 0.12 : 0.04}
            roughness={0.12}
            metalness={palette.additive ? 0.85 : 0.25}
            clearcoat={1}
            clearcoatRoughness={0.1}
            iridescence={1}
            iridescenceIOR={1.4}
            iridescenceThicknessRange={[120, 680]}
            distort={0.35}
            speed={2.2}
          />
        </mesh>
        <mesh ref={shell} scale={1.45}>
          <icosahedronGeometry args={[1.55, 1]} />
          <meshBasicMaterial color={palette.a} wireframe transparent opacity={palette.additive ? 0.22 : 0.3} />
        </mesh>
      </Float>

      <Float speed={2.4} rotationIntensity={1.4} floatIntensity={2}>
        <mesh ref={knot} position={[-2.6, 1.6, -1.2]} scale={0.32}>
          <torusKnotGeometry args={[1, 0.32, 96, 16]} />
          <meshStandardMaterial color={palette.b} emissive={palette.b} emissiveIntensity={palette.additive ? 0.6 : 0.15} roughness={0.25} metalness={0.6} />
        </mesh>
      </Float>

      <Float speed={3} rotationIntensity={2} floatIntensity={2.5}>
        <mesh position={[2.3, -1.5, 0.6]} scale={0.38}>
          <octahedronGeometry args={[1, 0]} />
          <meshStandardMaterial color={palette.c} emissive={palette.c} emissiveIntensity={palette.additive ? 0.7 : 0.2} roughness={0.2} metalness={0.5} flatShading />
        </mesh>
      </Float>

      <Float speed={2} rotationIntensity={1} floatIntensity={1.8}>
        <mesh position={[-1.9, -1.9, 1]} rotation={[0.6, 0.2, 0]} scale={0.5}>
          <torusGeometry args={[1, 0.06, 8, 64]} />
          <meshStandardMaterial color={palette.a} emissive={palette.a} emissiveIntensity={palette.additive ? 1.2 : 0.3} />
        </mesh>
      </Float>

    </group>
  );
}

/* ---------- Lighting that follows the pointer ---------- */
function Rig({ palette }: { palette: Palette }) {
  const keyLight = useRef<THREE.PointLight>(null);
  const keyTarget = useMemo(() => new THREE.Vector3(), []);
  const rimLight = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (keyLight.current) {
      keyLight.current.position.lerp(keyTarget.set(input.mx * 6, input.my * 4, 4), 0.08);
    }
    if (rimLight.current) {
      rimLight.current.position.set(Math.cos(t * 0.4) * 6, Math.sin(t * 0.3) * 3, -3);
    }
    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, input.mx * 0.6, 0.03);
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, input.my * 0.4, 0.03);
    state.camera.rotation.z = THREE.MathUtils.lerp(state.camera.rotation.z, input.velocity * 0.02, 0.1);
    state.camera.lookAt(0, 0, 0);
  });

  return (
    <>
      <ambientLight intensity={palette.additive ? 0.25 : 0.9} />
      <directionalLight position={[4, 6, 5]} intensity={palette.additive ? 1.2 : 1.6} />
      <pointLight ref={keyLight} color={palette.a} intensity={palette.additive ? 40 : 18} distance={20} />
      <pointLight ref={rimLight} color={palette.b} intensity={palette.additive ? 50 : 20} distance={20} />
      <pointLight position={[0, -4, 3]} color={palette.c} intensity={palette.additive ? 18 : 8} distance={14} />
    </>
  );
}

export default function Scene3D({ theme }: { theme: "light" | "dark" }) {
  useGlobalInput();
  const palette = PALETTES[theme];
  // Client-only component (loaded with ssr: false), so media queries can seed the initial state.
  const [compact, setCompact] = useState(() => window.matchMedia("(max-width: 1023px)").matches);
  const [reduced, setReduced] = useState(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  const [paused, setPaused] = useState(false);
  const [dpr, setDpr] = useState(1.25);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 1023px)");
    const rm = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => {
      setCompact(mq.matches);
      setReduced(rm.matches);
    };
    mq.addEventListener("change", sync);
    rm.addEventListener("change", sync);
    return () => {
      mq.removeEventListener("change", sync);
      rm.removeEventListener("change", sync);
    };
  }, []);

  // Stop rendering while the tab is hidden or while the mini-game owns the GPU.
  useEffect(() => {
    let hidden = document.hidden;
    let game = false;
    const sync = () => setPaused(hidden || game);
    const onVis = () => {
      hidden = document.hidden;
      sync();
    };
    const onGame = (e: Event) => {
      game = Boolean((e as CustomEvent<boolean>).detail);
      sync();
    };
    document.addEventListener("visibilitychange", onVis);
    window.addEventListener("bg3d:pause", onGame);
    return () => {
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("bg3d:pause", onGame);
    };
  }, []);

  const maxDpr = compact ? 1.25 : 1.5;

  return (
    <div className="fixed inset-0 z-0 pointer-events-none" aria-hidden>
      <Canvas
        dpr={Math.min(dpr, maxDpr)}
        camera={{ position: [0, 0, 8], fov: 45 }}
        gl={{ antialias: !compact, alpha: true, powerPreference: "high-performance", stencil: false }}
        frameloop={paused ? "never" : reduced ? "demand" : "always"}
      >
        {/* Adaptive resolution: drop pixel ratio on slow GPUs, raise it on fast ones. */}
        <PerformanceMonitor
          onIncline={() => setDpr(maxDpr)}
          onDecline={() => setDpr(1)}
          flipflops={3}
          onFallback={() => setDpr(1)}
        />
        <fog attach="fog" args={[theme === "dark" ? "#030407" : "#f4f5f7", 14, 60]} />
        <Rig palette={palette} />
        <Starfield palette={palette} count={compact ? 1000 : 2400} />
        <Wave palette={palette} density={compact ? 80 : 130} />
        <Sculpture palette={palette} compact={compact} />
      </Canvas>
    </div>
  );
}
