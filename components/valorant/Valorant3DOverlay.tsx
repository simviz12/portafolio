"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { TacticalAudio } from "./TacticalAudio";
import { X, RotateCcw } from "lucide-react";

interface Valorant3DOverlayProps {
  onClose: () => void;
}

export default function Valorant3DOverlay({ onClose }: Valorant3DOverlayProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioRef = useRef<TacticalAudio | null>(null);

  const [ammo, setAmmo] = useState(25);
  const [scoreHits, setScoreHits] = useState(0);
  const [killBanner, setKillBanner] = useState<string | null>(null);
  const [activeModal, setActiveModal] = useState<"about" | "skills" | "projects" | null>(null);

  // Targets HUD projection state
  const [hudPositions, setHudPositions] = useState<{
    about: { x: number; y: number; alive: boolean; hovered: boolean };
    skills: { x: number; y: number; alive: boolean; hovered: boolean };
    projects: { x: number; y: number; alive: boolean; hovered: boolean };
  }>({
    about: { x: 0, y: 0, alive: true, hovered: false },
    skills: { x: 0, y: 0, alive: true, hovered: false },
    projects: { x: 0, y: 0, alive: true, hovered: false },
  });

  const [crosshairPos, setCrosshairPos] = useState({ x: -100, y: -100 });
  const [isCrosshairLocked, setIsCrosshairLocked] = useState(false);
  const [isShootingAnim, setIsShootingAnim] = useState(false);
  const [isHitmarker, setIsHitmarker] = useState(false);

  useEffect(() => {
    audioRef.current = new TacticalAudio();
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Three.js Scene Setup
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: "high-performance" });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x090e14);
    scene.fog = new THREE.FogExp2(0x090e14, 0.032);

    const camera = new THREE.PerspectiveCamera(62, window.innerWidth / window.innerHeight, 0.05, 120);
    camera.position.set(0, 1.65, 5);
    scene.add(camera);

    // Dramatic Valorant Lighting
    scene.add(new THREE.AmbientLight(0xdbe8ff, 0.75));
    const dirLight = new THREE.DirectionalLight(0xffffff, 1.6);
    dirLight.position.set(5, 10, 7);
    scene.add(dirLight);

    const rimLightRed = new THREE.PointLight(0xff4655, 2.5, 18);
    rimLightRed.position.set(-4, 3, 2);
    scene.add(rimLightRed);

    const rimLightCyan = new THREE.PointLight(0x00f5d4, 2.2, 18);
    rimLightCyan.position.set(4, 2, 3);
    scene.add(rimLightCyan);

    // Floor Grid
    const gridHelper = new THREE.GridHelper(90, 60, 0xff4655, 0x1a2736);
    gridHelper.position.y = -1.2;
    scene.add(gridHelper);

    // Pillars
    const pillarGeo = new THREE.BoxGeometry(1.4, 9, 1.4);
    const pillarMat = new THREE.MeshStandardMaterial({ color: 0x121c26, roughness: 0.6, metalness: 0.4 });
    const pillarPositions = [
      [-9, 3, -10],
      [9, 3, -10],
      [-14, 3, -4],
      [14, 3, -4],
    ];
    pillarPositions.forEach(([px, py, pz]) => {
      const p = new THREE.Mesh(pillarGeo, pillarMat);
      p.position.set(px, py, pz);
      scene.add(p);

      const strip = new THREE.Mesh(
        new THREE.BoxGeometry(0.08, 8.5, 0.08),
        new THREE.MeshBasicMaterial({ color: 0xff4655 })
      );
      strip.position.set(px + (px < 0 ? 0.72 : -0.72), py, pz + 0.72);
      scene.add(strip);
    });

    // Weapon Pivot & Group
    const weaponPivot = new THREE.Group();
    weaponPivot.position.set(0.46, -0.34, -0.82);
    camera.add(weaponPivot);

    const gunMeshGroup = new THREE.Group();
    weaponPivot.add(gunMeshGroup);

    // High quality materials
    const matDarkMetal = new THREE.MeshStandardMaterial({ color: 0x18222d, metalness: 0.85, roughness: 0.28 });
    const matGunmetal = new THREE.MeshStandardMaterial({ color: 0x2c3b4d, metalness: 0.9, roughness: 0.22 });
    const matChrome = new THREE.MeshStandardMaterial({ color: 0xaab8c8, metalness: 0.95, roughness: 0.15 });
    const matPolymer = new THREE.MeshStandardMaterial({ color: 0x0e1318, metalness: 0.2, roughness: 0.8 });
    const matNeonRed = new THREE.MeshBasicMaterial({ color: 0xff4655 });
    const matNeonCyan = new THREE.MeshBasicMaterial({ color: 0x00f5d4 });

    // Gun body
    const receiverMain = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.15, 0.68), matDarkMetal);
    gunMeshGroup.add(receiverMain);

    const upperShroud = new THREE.Mesh(new THREE.BoxGeometry(0.095, 0.06, 0.64), matGunmetal);
    upperShroud.position.set(0, 0.11, -0.02);
    gunMeshGroup.add(upperShroud);

    const sidePlateL = new THREE.Mesh(new THREE.BoxGeometry(0.015, 0.08, 0.52), matGunmetal);
    sidePlateL.position.set(-0.06, 0.03, -0.04);
    gunMeshGroup.add(sidePlateL);
    const sidePlateR = sidePlateL.clone();
    sidePlateR.position.x = 0.06;
    gunMeshGroup.add(sidePlateR);

    // Barrel
    const barrelGeo = new THREE.CylinderGeometry(0.022, 0.022, 0.55, 16);
    barrelGeo.rotateX(Math.PI / 2);
    const barrel = new THREE.Mesh(barrelGeo, matChrome);
    barrel.position.set(0, 0.045, -0.82);
    gunMeshGroup.add(barrel);

    const muzzleBrake = new THREE.Mesh(new THREE.BoxGeometry(0.058, 0.065, 0.14), matGunmetal);
    muzzleBrake.position.set(0, 0.045, -1.1);
    gunMeshGroup.add(muzzleBrake);

    const barrelTipNode = new THREE.Object3D();
    barrelTipNode.position.set(0, 0.045, -1.2);
    gunMeshGroup.add(barrelTipNode);

    // Neon & Core
    const energyCore = new THREE.Mesh(
      new THREE.CylinderGeometry(0.026, 0.026, 0.34, 12).rotateX(Math.PI / 2),
      matNeonCyan
    );
    energyCore.position.set(0, 0.04, -0.45);
    gunMeshGroup.add(energyCore);

    const neonStripL = new THREE.Mesh(new THREE.BoxGeometry(0.006, 0.014, 0.78), matNeonRed);
    neonStripL.position.set(-0.07, 0.055, -0.25);
    gunMeshGroup.add(neonStripL);
    const neonStripR = neonStripL.clone();
    neonStripR.position.x = 0.07;
    gunMeshGroup.add(neonStripR);

    // Magazine
    const magazineGroup = new THREE.Group();
    magazineGroup.position.set(0, -0.06, -0.16);
    gunMeshGroup.add(magazineGroup);

    const magUpper = new THREE.Mesh(new THREE.BoxGeometry(0.068, 0.22, 0.11), matPolymer);
    magUpper.position.set(0, -0.08, 0);
    magUpper.rotation.x = 0.24;
    magazineGroup.add(magUpper);

    const boltCarrier = new THREE.Mesh(new THREE.BoxGeometry(0.025, 0.045, 0.16), matChrome);
    boltCarrier.position.set(-0.058, 0.065, -0.05);
    gunMeshGroup.add(boltCarrier);

    // Muzzle Flash
    const muzzleLight = new THREE.PointLight(0x00f5d4, 0, 8);
    barrelTipNode.add(muzzleLight);
    const flashGroup = new THREE.Group();
    flashGroup.visible = false;
    barrelTipNode.add(flashGroup);

    const flashMat = new THREE.MeshBasicMaterial({
      color: 0x00f5d4,
      transparent: true,
      opacity: 0.9,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
    });
    for (let i = 0; i < 3; i++) {
      const p = new THREE.Mesh(new THREE.PlaneGeometry(0.32, 0.12), flashMat);
      p.rotation.z = (i * Math.PI) / 3;
      flashGroup.add(p);
    }

    // Targets (Drones)
    interface TargetRef {
      id: "about" | "skills" | "projects";
      pos: THREE.Vector3;
      group: THREE.Group;
      coreMesh: THREE.Mesh;
      ringMesh: THREE.Mesh;
      hitboxMesh: THREE.Mesh;
      alive: boolean;
      phase: number;
    }

    const targetDefs: { id: "about" | "skills" | "projects"; pos: THREE.Vector3 }[] = [
      { id: "about", pos: new THREE.Vector3(-3.4, 2.2, -3.5) },
      { id: "skills", pos: new THREE.Vector3(0.2, 1.3, -4.2) },
      { id: "projects", pos: new THREE.Vector3(3.6, 2.5, -3.5) },
    ];

    const targets: TargetRef[] = [];
    const hitboxes: THREE.Mesh[] = [];

    targetDefs.forEach((def, idx) => {
      const g = new THREE.Group();
      g.position.copy(def.pos);
      scene.add(g);

      const coreMesh = new THREE.Mesh(
        new THREE.OctahedronGeometry(0.42, 0),
        new THREE.MeshStandardMaterial({
          color: 0xff4655,
          emissive: 0xff4655,
          emissiveIntensity: 0.75,
          roughness: 0.2,
          metalness: 0.8,
        })
      );
      g.add(coreMesh);

      const ringMesh = new THREE.Mesh(
        new THREE.TorusGeometry(0.62, 0.025, 12, 36),
        new THREE.MeshBasicMaterial({ color: 0x00f5d4, wireframe: true })
      );
      g.add(ringMesh);

      const hitboxMesh = new THREE.Mesh(
        new THREE.SphereGeometry(0.82, 12, 12),
        new THREE.MeshBasicMaterial({ visible: false })
      );
      g.add(hitboxMesh);

      const tObj: TargetRef = {
        id: def.id,
        pos: def.pos,
        group: g,
        coreMesh,
        ringMesh,
        hitboxMesh,
        alive: true,
        phase: idx * 2.1,
      };

      hitboxMesh.userData.targetRef = tObj;
      targets.push(tObj);
      hitboxes.push(hitboxMesh);
    });

    // Particle, Tracer and Casing Arrays
    interface Tracer {
      mesh: THREE.Mesh;
      alpha: number;
    }
    interface Casing {
      mesh: THREE.Mesh;
      vel: THREE.Vector3;
      rotVel: THREE.Vector3;
      life: number;
    }
    interface Spark {
      mesh: THREE.Mesh;
      vel: THREE.Vector3;
      life: number;
    }

    const tracers: Tracer[] = [];
    const casings: Casing[] = [];
    const sparks: Spark[] = [];

    function spawn3DTracer(start: THREE.Vector3, end: THREE.Vector3, isHit: boolean) {
      const dist = start.distanceTo(end);
      const cylGeo = new THREE.CylinderGeometry(0.012, 0.012, dist, 6);
      cylGeo.translate(0, dist / 2, 0);
      cylGeo.rotateX(Math.PI / 2);

      const beam = new THREE.Mesh(
        cylGeo,
        new THREE.MeshBasicMaterial({
          color: isHit ? 0xff4655 : 0x00f5d4,
          transparent: true,
          opacity: 0.95,
          blending: THREE.AdditiveBlending,
        })
      );
      beam.position.copy(start);
      beam.lookAt(end);
      scene.add(beam);
      tracers.push({ mesh: beam, alpha: 1.0 });
    }

    function spawn3DExplosion(pos: THREE.Vector3, count = 24, colorHex = 0x00f5d4) {
      const sparkGeo = new THREE.OctahedronGeometry(0.06, 0);
      for (let i = 0; i < count; i++) {
        const spark = new THREE.Mesh(
          sparkGeo,
          new THREE.MeshBasicMaterial({
            color: i % 2 === 0 ? colorHex : 0xff4655,
            transparent: true,
            opacity: 1,
          })
        );
        spark.position.copy(pos);
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI;
        const speed = 0.06 + Math.random() * 0.16;

        scene.add(spark);
        sparks.push({
          mesh: spark,
          vel: new THREE.Vector3(
            Math.sin(phi) * Math.cos(theta) * speed,
            Math.cos(phi) * speed,
            Math.sin(phi) * Math.sin(theta) * speed
          ),
          life: 1.0,
        });
      }
    }

    function ejectCasing() {
      const cMesh = new THREE.Mesh(
        new THREE.CylinderGeometry(0.009, 0.009, 0.045, 8),
        new THREE.MeshStandardMaterial({ color: 0xffd166, metalness: 0.95, roughness: 0.15 })
      );
      const p = new THREE.Vector3();
      boltCarrier.getWorldPosition(p);
      cMesh.position.copy(p);
      scene.add(cMesh);

      casings.push({
        mesh: cMesh,
        vel: new THREE.Vector3(0.04 + Math.random() * 0.03, 0.05 + Math.random() * 0.03, 0.02 + (Math.random() - 0.5) * 0.03),
        rotVel: new THREE.Vector3(Math.random() * 0.4, Math.random() * 0.4, Math.random() * 0.4),
        life: 1.0,
      });
    }

    // Input & Interaction States
    const mouseNDC = new THREE.Vector2(0, 0);
    const raycaster = new THREE.Raycaster();
    let recoilKickZ = 0;
    let recoilKickPitch = 0;
    let currentAmmo = 25;

    const handleMouseMove = (e: MouseEvent) => {
      setCrosshairPos({ x: e.clientX, y: e.clientY });
      mouseNDC.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseNDC.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    const handleMouseDown = (e: MouseEvent) => {
      if (e.button !== 0) return;
      if ((e.target as HTMLElement).closest(".modal-card") || (e.target as HTMLElement).closest("button")) return;

      if (currentAmmo <= 0) {
        audioRef.current?.playMechanical();
        currentAmmo = 25;
        setAmmo(25);
        return;
      }

      currentAmmo--;
      setAmmo(currentAmmo);
      audioRef.current?.playGunshot();

      // Recoil
      recoilKickZ = 0.16;
      recoilKickPitch = 0.14;
      boltCarrier.position.z = 0.08;

      setIsShootingAnim(true);
      setTimeout(() => setIsShootingAnim(false), 90);

      flashGroup.visible = true;
      muzzleLight.intensity = 6.5;
      setTimeout(() => {
        flashGroup.visible = false;
        muzzleLight.intensity = 0;
      }, 55);

      ejectCasing();

      raycaster.setFromCamera(mouseNDC, camera);
      const activeTargets = targets.filter((t) => t.alive).map((t) => t.hitboxMesh);
      const intersects = raycaster.intersectObjects(activeTargets, false);

      const gunTipWorld = new THREE.Vector3();
      barrelTipNode.getWorldPosition(gunTipWorld);

      if (intersects.length > 0) {
        const hit = intersects[0];
        const targetObj = hit.object.userData.targetRef as TargetRef;

        spawn3DTracer(gunTipWorld, hit.point, true);
        spawn3DExplosion(targetObj.group.position, 32, 0x00f5d4);

        setIsHitmarker(true);
        setTimeout(() => setIsHitmarker(false), 160);
        audioRef.current?.playKillSound();

        // Destroy target & open modal
        targetObj.alive = false;
        targetObj.group.visible = false;

        setScoreHits((prev) => Math.min(3, prev + 1));
        setKillBanner(`DESENCRIPTADO // ${targetObj.id.toUpperCase()}`);
        setTimeout(() => setKillBanner(null), 1800);
        setActiveModal(targetObj.id);
      } else {
        const missPoint = new THREE.Vector3();
        raycaster.ray.at(18, missPoint);
        spawn3DTracer(gunTipWorld, missPoint, false);
        spawn3DExplosion(missPoint, 8, 0xff4655);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "r") {
        audioRef.current?.playMechanical();
        currentAmmo = 25;
        setAmmo(25);
      } else if (e.key.toLowerCase() === "f") {
        audioRef.current?.playMechanical();
      } else if (e.key === "Escape") {
        setActiveModal(null);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("keydown", handleKeyDown);

    // Animation Loop
    let animId: number;
    const clock = new THREE.Clock();
    const aimWorldPoint = new THREE.Vector3();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Weapon Sway & Aiming
      raycaster.setFromCamera(mouseNDC, camera);
      raycaster.ray.at(14, aimWorldPoint);

      const targetYaw = -mouseNDC.x * 0.38;
      const targetPitch = mouseNDC.y * 0.32;

      weaponPivot.rotation.y += (targetYaw - weaponPivot.rotation.y) * 0.16;
      weaponPivot.rotation.x += (targetPitch + recoilKickPitch - weaponPivot.rotation.x) * 0.18;

      recoilKickZ *= 0.78;
      recoilKickPitch *= 0.78;
      boltCarrier.position.z += (-0.05 - boltCarrier.position.z) * 0.25;

      gunMeshGroup.position.z = recoilKickZ;
      gunMeshGroup.position.y = Math.sin(elapsed * 2.6) * 0.008;
      gunMeshGroup.position.x = Math.cos(elapsed * 1.3) * 0.005;

      const pulse = 1 + Math.sin(elapsed * 6) * 0.08;
      energyCore.scale.set(pulse, 1, pulse);

      // Raycast hover check
      const aliveHitboxes = targets.filter((t) => t.alive).map((t) => t.hitboxMesh);
      const hoverHits = raycaster.intersectObjects(aliveHitboxes, false);
      const isLocked = hoverHits.length > 0;
      setIsCrosshairLocked(isLocked);

      let hoveredId: "about" | "skills" | "projects" | null = null;
      if (isLocked) {
        hoveredId = (hoverHits[0].object.userData.targetRef as TargetRef).id;
      }

      // Update Targets and project coordinates to 2D
      const newHud: Record<string, { x: number; y: number; alive: boolean; hovered: boolean }> = {};

      targets.forEach((t) => {
        if (!t.alive) {
          newHud[t.id] = { x: 0, y: 0, alive: false, hovered: false };
          return;
        }

        t.group.position.y = t.pos.y + Math.sin(elapsed * 2.2 + t.phase) * 0.16;
        t.coreMesh.rotation.y += 0.025;
        t.coreMesh.rotation.x += 0.015;
        t.ringMesh.rotation.z -= 0.02;

        const proj = t.group.position.clone().project(camera);
        const sx = (proj.x * 0.5 + 0.5) * window.innerWidth;
        const sy = (-proj.y * 0.5 + 0.5) * window.innerHeight;

        newHud[t.id] = {
          x: sx,
          y: sy,
          alive: true,
          hovered: hoveredId === t.id,
        };
      });

      setHudPositions({
        about: newHud["about"] || { x: 0, y: 0, alive: false, hovered: false },
        skills: newHud["skills"] || { x: 0, y: 0, alive: false, hovered: false },
        projects: newHud["projects"] || { x: 0, y: 0, alive: false, hovered: false },
      });

      // Update Tracers
      for (let i = tracers.length - 1; i >= 0; i--) {
        const tr = tracers[i];
        tr.alpha -= 0.12;
        (tr.mesh.material as THREE.MeshBasicMaterial).opacity = Math.max(0, tr.alpha);
        if (tr.alpha <= 0) {
          scene.remove(tr.mesh);
          tracers.splice(i, 1);
        }
      }

      // Update Casings
      for (let i = casings.length - 1; i >= 0; i--) {
        const c = casings[i];
        c.mesh.position.add(c.vel);
        c.vel.y -= 0.0038;
        c.life -= 0.025;
        if (c.life <= 0) {
          scene.remove(c.mesh);
          casings.splice(i, 1);
        }
      }

      // Update Sparks
      for (let i = sparks.length - 1; i >= 0; i--) {
        const sp = sparks[i];
        sp.mesh.position.add(sp.vel);
        sp.vel.multiplyScalar(0.94);
        sp.life -= 0.035;
        (sp.mesh.material as THREE.MeshBasicMaterial).opacity = Math.max(0, sp.life);
        if (sp.life <= 0) {
          scene.remove(sp.mesh);
          sparks.splice(i, 1);
        }
      }

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
    };
  }, []);

  const handleResetTargets = () => {
    audioRef.current?.playMechanical();
    setScoreHits(0);
    setActiveModal(null);
    window.location.reload(); // Simple instant 3D reload
  };

  return (
    <div className="fixed inset-0 z-[100] bg-[#090e14] text-[#ece8e1] overflow-hidden select-none cursor-none font-valorant-hud">
      {/* Three.js Fullscreen Canvas */}
      <canvas ref={canvasRef} className="fixed inset-0 w-full h-full z-1" />

      {/* Screen Overlay with Tactical Scanlines & Vignette */}
      <div
        className="fixed inset-0 pointer-events-none z-5"
        style={{
          background:
            "radial-gradient(circle at center, transparent 55%, rgba(9, 14, 20, 0.75) 100%), repeating-linear-gradient(0deg, rgba(255,255,255,0.015) 0px, rgba(255,255,255,0.015) 1px, transparent 1px, transparent 3px)",
        }}
      />

      {/* Custom Crosshair & Hitmarker */}
      <div
        className={`fixed pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 ${
          isCrosshairLocked ? "text-[#ff4655]" : "text-[#00f5d4]"
        }`}
        style={{ left: crosshairPos.x, top: crosshairPos.y }}
      >
        <div
          className={`w-1 h-1 rounded-full ${
            isCrosshairLocked ? "bg-[#ff4655] shadow-[0_0_8px_#ff4655]" : "bg-[#00f5d4] shadow-[0_0_6px_#00f5d4]"
          }`}
        />
        {/* Reticle Lines */}
        <div
          className={`absolute w-0.5 bg-current transition-all ${
            isShootingAnim ? "-top-5 h-2.5" : "-top-3 h-2"
          } left-0`}
        />
        <div
          className={`absolute w-0.5 bg-current transition-all ${
            isShootingAnim ? "top-5 h-2.5" : "top-2 h-2"
          } left-0`}
        />
        <div
          className={`absolute h-0.5 bg-current transition-all ${
            isShootingAnim ? "-left-5 w-2.5" : "-left-3 w-2"
          } top-0`}
        />
        <div
          className={`absolute h-0.5 bg-current transition-all ${
            isShootingAnim ? "left-5 w-2.5" : "left-2 w-2"
          } top-0`}
        />

        {/* Hitmarker */}
        {isHitmarker && (
          <div className="absolute -translate-x-1/2 -translate-y-1/2 w-7 h-7 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 w-2.5 h-0.5 bg-white shadow-[0_0_8px_#ff4655] -translate-x-full -translate-y-full rotate-45" />
            <div className="absolute top-1/2 left-1/2 w-2.5 h-0.5 bg-white shadow-[0_0_8px_#ff4655] translate-x-0 -translate-y-full -rotate-45" />
            <div className="absolute top-1/2 left-1/2 w-2.5 h-0.5 bg-white shadow-[0_0_8px_#ff4655] -translate-x-full translate-y-0 -rotate-45" />
            <div className="absolute top-1/2 left-1/2 w-2.5 h-0.5 bg-white shadow-[0_0_8px_#ff4655] translate-x-0 translate-y-0 rotate-45" />
          </div>
        )}
      </div>

      {/* Top HUD */}
      <header className="fixed top-5 left-8 right-8 flex justify-between items-start z-20 pointer-events-none">
        <div className="border-l-4 border-[#ff4655] pl-3.5 bg-gradient-to-r from-[#ff4655]/15 to-transparent py-1">
          <div className="font-valorant-mono text-xs text-[#ff4655] tracking-[3px]">
            AGENTE // DEV-01 · ANA GÓMEZ
          </div>
          <div className="font-valorant-title text-3xl tracking-wider text-[#ece8e1] leading-none uppercase">
            CAMPO DE PRÁCTICA 3D
          </div>
          <div className="text-xs text-[#8b9bb4] tracking-wider mt-0.5">
            Apunta y dispara a los drones tácticos para desencriptar el portafolio
          </div>
        </div>

        {/* Match Header */}
        <div className="flex items-center gap-4 bg-[#0f1923]/90 border border-[#ece8e1]/15 px-6 py-2 clip-badge">
          <span className="font-valorant-title text-2xl text-[#00f5d4]">{scoreHits}</span>
          <span className="font-valorant-mono text-sm text-[#ece8e1] px-3 py-0.5 bg-[#ff4655]/20 border border-[#ff4655]">
            RONDA // ACTIVA
          </span>
          <span className="font-valorant-title text-2xl text-[#ff4655]">3</span>
        </div>

        {/* Controls Hint & Exit Button */}
        <div className="text-right font-valorant-mono text-xs text-[#8b9bb4] bg-[#0f1923]/80 p-3 border-r-3 border-[#00f5d4] space-y-1">
          <div><span className="bg-[#ece8e1]/15 px-1 py-0.5 text-[#ece8e1] font-bold">CLICK IZQ</span> DISPARAR VANDAL</div>
          <div><span className="bg-[#ece8e1]/15 px-1 py-0.5 text-[#ece8e1] font-bold">R</span> RECARGAR</div>
          <div className="flex gap-2 justify-end pt-1 pointer-events-auto">
            <button
              onClick={handleResetTargets}
              className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 border border-[#00f5d4] text-[#00f5d4] hover:bg-[#00f5d4] hover:text-[#090e14] transition-all cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>REINICIAR [X]</span>
            </button>
            <button
              onClick={onClose}
              className="inline-flex items-center gap-1 text-[11px] px-2.5 py-0.5 bg-[#ff4655] text-white hover:bg-[#ff2035] transition-all font-bold cursor-pointer"
            >
              <X className="w-3 h-3" />
              <span>SALIR MODO 3D</span>
            </button>
          </div>
        </div>
      </header>

      {/* Floating Target Reticles projected on screen */}
      <div className="fixed inset-0 pointer-events-none z-15">
        {/* Target 1: Sobre mí */}
        {hudPositions.about.alive && (
          <div
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: hudPositions.about.x, top: hudPositions.about.y }}
          >
            <div className="relative w-18 h-18 flex items-center justify-center">
              <div
                className={`absolute inset-0 border border-dashed rounded-full animate-spin-slow ${
                  hudPositions.about.hovered ? "border-[#00f5d4]" : "border-[#ff4655]/65"
                }`}
              />
              <div
                className={`w-7 h-7 border-2 rotate-45 transition-all ${
                  hudPositions.about.hovered
                    ? "border-[#00f5d4] shadow-[0_0_15px_rgba(0,245,212,0.5)] rotate-135"
                    : "border-[#ece8e1]/35"
                }`}
              />
              <div className="absolute left-20 bg-[#0f1923]/95 border-l-3 border-[#ff4655] px-3.5 py-1.5 whitespace-nowrap shadow-xl">
                <div className="font-valorant-mono text-[10px] text-[#ff4655] tracking-widest">OBJETIVO // 01</div>
                <div className="text-sm font-bold text-[#ece8e1] tracking-wider uppercase">SOBRE MÍ</div>
                <div className="w-full h-1 bg-white/20 mt-1">
                  <div className={`h-full ${hudPositions.about.hovered ? "bg-[#00f5d4]" : "bg-[#ff4655]"}`} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Target 2: Habilidades */}
        {hudPositions.skills.alive && (
          <div
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: hudPositions.skills.x, top: hudPositions.skills.y }}
          >
            <div className="relative w-18 h-18 flex items-center justify-center">
              <div
                className={`absolute inset-0 border border-dashed rounded-full animate-spin-slow ${
                  hudPositions.skills.hovered ? "border-[#00f5d4]" : "border-[#ff4655]/65"
                }`}
              />
              <div
                className={`w-7 h-7 border-2 rotate-45 transition-all ${
                  hudPositions.skills.hovered
                    ? "border-[#00f5d4] shadow-[0_0_15px_rgba(0,245,212,0.5)] rotate-135"
                    : "border-[#ece8e1]/35"
                }`}
              />
              <div className="absolute left-20 bg-[#0f1923]/95 border-l-3 border-[#ff4655] px-3.5 py-1.5 whitespace-nowrap shadow-xl">
                <div className="font-valorant-mono text-[10px] text-[#ff4655] tracking-widest">OBJETIVO // 02</div>
                <div className="text-sm font-bold text-[#ece8e1] tracking-wider uppercase">HABILIDADES</div>
                <div className="w-full h-1 bg-white/20 mt-1">
                  <div className={`h-full ${hudPositions.skills.hovered ? "bg-[#00f5d4]" : "bg-[#ff4655]"}`} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Target 3: Proyectos */}
        {hudPositions.projects.alive && (
          <div
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: hudPositions.projects.x, top: hudPositions.projects.y }}
          >
            <div className="relative w-18 h-18 flex items-center justify-center">
              <div
                className={`absolute inset-0 border border-dashed rounded-full animate-spin-slow ${
                  hudPositions.projects.hovered ? "border-[#00f5d4]" : "border-[#ff4655]/65"
                }`}
              />
              <div
                className={`w-7 h-7 border-2 rotate-45 transition-all ${
                  hudPositions.projects.hovered
                    ? "border-[#00f5d4] shadow-[0_0_15px_rgba(0,245,212,0.5)] rotate-135"
                    : "border-[#ece8e1]/35"
                }`}
              />
              <div className="absolute left-20 bg-[#0f1923]/95 border-l-3 border-[#ff4655] px-3.5 py-1.5 whitespace-nowrap shadow-xl">
                <div className="font-valorant-mono text-[10px] text-[#ff4655] tracking-widest">OBJETIVO // 03</div>
                <div className="text-sm font-bold text-[#ece8e1] tracking-wider uppercase">PROYECTOS</div>
                <div className="w-full h-1 bg-white/20 mt-1">
                  <div className={`h-full ${hudPositions.projects.hovered ? "bg-[#00f5d4]" : "bg-[#ff4655]"}`} />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Kill Banner */}
      {killBanner && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none z-30 animate-in zoom-in-75">
          <div className="w-14 h-14 bg-[#ff4655]/20 border-2 border-[#ff4655] rotate-45 flex items-center justify-center shadow-[0_0_25px_#ff4655]">
            <span className="-rotate-45 font-valorant-title text-2xl text-[#ece8e1]">☠</span>
          </div>
          <div className="mt-3 font-valorant-mono text-xs tracking-[3px] text-[#00f5d4] bg-[#090e14]/90 px-3 py-1 border border-[#00f5d4]">
            {killBanner}
          </div>
        </div>
      )}

      {/* Bottom HUD */}
      <footer className="fixed bottom-6 left-9 right-9 flex justify-between items-end z-20 pointer-events-none">
        <div className="flex items-baseline gap-5 bg-gradient-to-r from-[#0f1923]/90 to-[#0f1923]/40 px-7 py-3 border-b-3 border-[#00f5d4] clip-tactical">
          <div className="flex items-baseline gap-2">
            <span className="font-valorant-mono text-xs text-[#8b9bb4]">ESCUDO</span>
            <span className="font-valorant-title text-2xl text-[#00f5d4]">50</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-valorant-mono text-xs text-[#8b9bb4]">SALUD</span>
            <span className="font-valorant-title text-4xl text-[#ece8e1] leading-none">100</span>
          </div>
        </div>

        <div className="flex items-center gap-6 bg-gradient-to-l from-[#0f1923]/92 to-[#0f1923]/40 px-7 py-3 border-b-3 border-[#ff4655] clip-tactical">
          <div className="flex items-baseline gap-1.5">
            <span className="font-valorant-title text-4xl text-[#ece8e1] leading-none">{ammo}</span>
            <span className="text-xl font-bold text-[#8b9bb4]">/ 75</span>
          </div>
          <div className="text-right border-l border-white/15 pl-4">
            <div className="font-valorant-title text-lg tracking-wider text-[#ece8e1]">VANDAL 3D</div>
            <div className="font-valorant-mono text-[11px] text-[#ff4655] tracking-widest">PROTOCOL // 781-A</div>
          </div>
        </div>
      </footer>

      {/* ================= MODALES TÁCTICOS ================= */}
      {activeModal === "about" && (
        <div className="modal-card fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(620px,92vw)] bg-gradient-to-br from-[#101a24]/98 to-[#090e14]/99 border border-[#ff4655]/60 border-l-4 border-l-[#ff4655] p-8 z-[200] clip-tactical shadow-[0_25px_60px_rgba(0,0,0,0.85)]">
          <div className="flex justify-between items-start border-b border-[#ece8e1]/15 pb-4 mb-5">
            <div>
              <div className="font-valorant-mono text-xs text-[#00f5d4] tracking-[3px]">EXPEDIENTE DE AGENTE // 01</div>
              <div className="font-valorant-title text-3xl tracking-wider text-[#ece8e1] uppercase">SOBRE MÍ · ANA GÓMEZ</div>
            </div>
            <button
              onClick={() => setActiveModal(null)}
              className="bg-[#ff4655] hover:bg-[#00f5d4] hover:text-[#090e14] text-[#ece8e1] px-4 py-2 font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
            >
              CERRAR [ESC]
            </button>
          </div>
          <div className="space-y-4 text-sm text-[#c2ccd6] leading-relaxed">
            <p>
              Desarrolladora Frontend &amp; Arquitecta UI especializada en experiencias interactivas, Next.js 15 y sistemas de diseño con Three.js / WebGL. Combino ingeniería de software sólida con la adrenalina visual de los videojuegos competitivos AAA.
            </p>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="bg-white/5 border border-white/10 p-3">
                <div className="flex justify-between font-bold text-xs text-[#ece8e1] mb-1.5">
                  <span>ARQUITECTURA FRONTEND</span>
                  <span className="text-[#00f5d4]">98%</span>
                </div>
                <div className="w-full h-1.5 bg-white/10">
                  <div className="h-full bg-gradient-to-r from-[#ff4655] to-[#00f5d4] w-[98%]" />
                </div>
              </div>
              <div className="bg-white/5 border border-white/10 p-3">
                <div className="flex justify-between font-bold text-xs text-[#ece8e1] mb-1.5">
                  <span>PERFORMANCE &amp; WEBGL</span>
                  <span className="text-[#00f5d4]">95%</span>
                </div>
                <div className="w-full h-1.5 bg-white/10">
                  <div className="h-full bg-gradient-to-r from-[#ff4655] to-[#00f5d4] w-[95%]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeModal === "skills" && (
        <div className="modal-card fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(620px,92vw)] bg-gradient-to-br from-[#101a24]/98 to-[#090e14]/99 border border-[#ff4655]/60 border-l-4 border-l-[#ff4655] p-8 z-[200] clip-tactical shadow-[0_25px_60px_rgba(0,0,0,0.85)]">
          <div className="flex justify-between items-start border-b border-[#ece8e1]/15 pb-4 mb-5">
            <div>
              <div className="font-valorant-mono text-xs text-[#00f5d4] tracking-[3px]">ARSENAL TÉCNICO // 02</div>
              <div className="font-valorant-title text-3xl tracking-wider text-[#ece8e1] uppercase">HABILIDADES &amp; STACK</div>
            </div>
            <button
              onClick={() => setActiveModal(null)}
              className="bg-[#ff4655] hover:bg-[#00f5d4] hover:text-[#090e14] text-[#ece8e1] px-4 py-2 font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
            >
              CERRAR [ESC]
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-white/5 border border-white/10 p-3">
              <div className="flex justify-between font-bold text-[#ece8e1] mb-1.5">
                <span>Next.js 15 / React 19</span>
                <span className="text-[#00f5d4]">96%</span>
              </div>
              <div className="w-full h-1.5 bg-white/10">
                <div className="h-full bg-gradient-to-r from-[#ff4655] to-[#00f5d4] w-[96%]" />
              </div>
            </div>
            <div className="bg-white/5 border border-white/10 p-3">
              <div className="flex justify-between font-bold text-[#ece8e1] mb-1.5">
                <span>TypeScript (Strict Mode)</span>
                <span className="text-[#00f5d4]">92%</span>
              </div>
              <div className="w-full h-1.5 bg-white/10">
                <div className="h-full bg-gradient-to-r from-[#ff4655] to-[#00f5d4] w-[92%]" />
              </div>
            </div>
            <div className="bg-white/5 border border-white/10 p-3">
              <div className="flex justify-between font-bold text-[#ece8e1] mb-1.5">
                <span>Tailwind CSS &amp; Design Systems</span>
                <span className="text-[#00f5d4]">95%</span>
              </div>
              <div className="w-full h-1.5 bg-white/10">
                <div className="h-full bg-gradient-to-r from-[#ff4655] to-[#00f5d4] w-[95%]" />
              </div>
            </div>
            <div className="bg-white/5 border border-white/10 p-3">
              <div className="flex justify-between font-bold text-[#ece8e1] mb-1.5">
                <span>Three.js / 3D WebGL</span>
                <span className="text-[#00f5d4]">90%</span>
              </div>
              <div className="w-full h-1.5 bg-white/10">
                <div className="h-full bg-gradient-to-r from-[#ff4655] to-[#00f5d4] w-[90%]" />
              </div>
            </div>
          </div>
        </div>
      )}

      {activeModal === "projects" && (
        <div className="modal-card fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(620px,92vw)] bg-gradient-to-br from-[#101a24]/98 to-[#090e14]/99 border border-[#ff4655]/60 border-l-4 border-l-[#ff4655] p-8 z-[200] clip-tactical shadow-[0_25px_60px_rgba(0,0,0,0.85)]">
          <div className="flex justify-between items-start border-b border-[#ece8e1]/15 pb-4 mb-5">
            <div>
              <div className="font-valorant-mono text-xs text-[#00f5d4] tracking-[3px]">OPERACIONES COMPLETADAS // 03</div>
              <div className="font-valorant-title text-3xl tracking-wider text-[#ece8e1] uppercase">PROYECTOS DESTACADOS</div>
            </div>
            <button
              onClick={() => setActiveModal(null)}
              className="bg-[#ff4655] hover:bg-[#00f5d4] hover:text-[#090e14] text-[#ece8e1] px-4 py-2 font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
            >
              CERRAR [ESC]
            </button>
          </div>
          <div className="space-y-3">
            <div className="bg-white/5 border-l-3 border-l-[#00f5d4] p-3 flex justify-between items-center">
              <div>
                <h4 className="font-bold text-sm text-[#ece8e1]">SAAS ANALYTICS &amp; BILLING PLATFORM</h4>
                <p className="text-xs text-[#8b9bb4]">Métricas financieras en tiempo real y pasarelas de pago recurrentes.</p>
              </div>
              <span className="font-valorant-mono text-xs text-[#00f5d4]">NEXT.JS + TS</span>
            </div>
            <div className="bg-white/5 border-l-3 border-l-[#00f5d4] p-3 flex justify-between items-center">
              <div>
                <h4 className="font-bold text-sm text-[#ece8e1]">AI PROMPT STUDIO &amp; WORKFLOW CANVAS</h4>
                <p className="text-xs text-[#8b9bb4]">Lienzo interactivo drag-and-drop con streaming de modelos LLM.</p>
              </div>
              <span className="font-valorant-mono text-xs text-[#00f5d4]">REACT + WEBSOCKET</span>
            </div>
            <div className="bg-white/5 border-l-3 border-l-[#00f5d4] p-3 flex justify-between items-center">
              <div>
                <h4 className="font-bold text-sm text-[#ece8e1]">DEVPULSE DESIGN SYSTEM &amp; UI KIT</h4>
                <p className="text-xs text-[#8b9bb4]">40+ componentes de alta fidelidad accesibles con WCAG 2.1 AAA.</p>
              </div>
              <span className="font-valorant-mono text-xs text-[#00f5d4]">TAILWIND + RADIX</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
