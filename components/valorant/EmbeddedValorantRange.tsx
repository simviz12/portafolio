"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import { TacticalAudio } from "./TacticalAudio";
import { RotateCcw, X, ShieldCheck, Terminal, ExternalLink, Code2 } from "lucide-react";

export default function EmbeddedValorantRange() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioRef = useRef<TacticalAudio | null>(null);

  const [ammo, setAmmo] = useState(25);
  const [scoreHits, setScoreHits] = useState(0);
  const [killBanner, setKillBanner] = useState<string | null>(null);
  const [isCrosshairLocked, setIsCrosshairLocked] = useState(false);
  const [isShootingAnim, setIsShootingAnim] = useState(false);
  const [isHitmarker, setIsHitmarker] = useState(false);
  const [crosshairPos, setCrosshairPos] = useState({ x: -100, y: -100 });
  const [isHoveringCanvas, setIsHoveringCanvas] = useState(false);
  const [currentSkin, setCurrentSkin] = useState<"prime" | "vandal" | "reaver">("prime");
  const [killStreak, setKillStreak] = useState(0);
  const [showAceBanner, setShowAceBanner] = useState(false);
  const [hitFlash, setHitFlash] = useState(false);

  // Modal Card state when a drone is destroyed
  const [activeModalData, setActiveModalData] = useState<{
    id: "about" | "skills" | "projects";
    title: string;
    tag: string;
    content: React.ReactNode;
  } | null>(null);

  // Targets HUD 2D projections inside container
  const [hudPositions, setHudPositions] = useState<{
    about: { x: number; y: number; alive: boolean; hovered: boolean };
    skills: { x: number; y: number; alive: boolean; hovered: boolean };
    projects: { x: number; y: number; alive: boolean; hovered: boolean };
  }>({
    about: { x: 0, y: 0, alive: true, hovered: false },
    skills: { x: 0, y: 0, alive: true, hovered: false },
    projects: { x: 0, y: 0, alive: true, hovered: false },
  });

  useEffect(() => {
    audioRef.current = new TacticalAudio();
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const width = container.clientWidth;
    const height = container.clientHeight || 560;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: "high-performance" });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x3a82ee);
    scene.fog = new THREE.FogExp2(0x5ca0f2, 0.015);

    const camera = new THREE.PerspectiveCamera(58, width / height, 0.05, 140);
    camera.position.set(0, 1.6, 5);
    scene.add(camera);

    // ==========================================
    // CIELO AZUL VIBRANTE CON SOL Y NUBES BLANCAS
    // ==========================================
    const createSkyCanvas = () => {
      const c = document.createElement("canvas");
      c.width = 1024;
      c.height = 512;
      const ctx = c.getContext("2d");
      if (!ctx) return c;

      // Gradiente de cielo azul diurno brillante
      const grad = ctx.createLinearGradient(0, 0, 0, 512);
      grad.addColorStop(0, "#1d63d6"); // Azul cielo superior intenso
      grad.addColorStop(0.5, "#388af6"); // Azul medio brillante
      grad.addColorStop(0.85, "#70b3ff"); // Celeste luminoso
      grad.addColorStop(1, "#a8d4ff"); // Horizonte claro
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 1024, 512);

      // Sol radiante con halo cálido
      const sunX = 300;
      const sunY = 110;
      const sunGlow = ctx.createRadialGradient(sunX, sunY, 15, sunX, sunY, 110);
      sunGlow.addColorStop(0, "rgba(255, 255, 220, 1)");
      sunGlow.addColorStop(0.25, "rgba(255, 230, 140, 0.75)");
      sunGlow.addColorStop(0.7, "rgba(255, 200, 100, 0.2)");
      sunGlow.addColorStop(1, "rgba(255, 200, 100, 0)");
      ctx.fillStyle = sunGlow;
      ctx.beginPath();
      ctx.arc(sunX, sunY, 110, 0, Math.PI * 2);
      ctx.fill();

      // Disco solar
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(sunX, sunY, 24, 0, Math.PI * 2);
      ctx.fill();

      // Grandes nubes blancas esponjosas
      const drawCloud = (cx: number, cy: number, scale: number) => {
        ctx.fillStyle = "rgba(255, 255, 255, 0.88)";
        ctx.beginPath();
        ctx.arc(cx, cy, 32 * scale, 0, Math.PI * 2);
        ctx.arc(cx + 28 * scale, cy - 14 * scale, 38 * scale, 0, Math.PI * 2);
        ctx.arc(cx + 65 * scale, cy - 8 * scale, 34 * scale, 0, Math.PI * 2);
        ctx.arc(cx + 95 * scale, cy, 26 * scale, 0, Math.PI * 2);
        ctx.arc(cx + 45 * scale, cy + 12 * scale, 28 * scale, 0, Math.PI * 2);
        ctx.fill();
      };

      drawCloud(120, 210, 1.2);
      drawCloud(450, 170, 1.4);
      drawCloud(780, 230, 1.3);
      drawCloud(920, 160, 1.0);
      drawCloud(240, 280, 0.9);
      drawCloud(620, 290, 1.1);

      return c;
    };

    const skyTexture = new THREE.CanvasTexture(createSkyCanvas());
    skyTexture.wrapS = THREE.RepeatWrapping;
    skyTexture.wrapT = THREE.ClampToEdgeWrapping;

    const skyGeo = new THREE.SphereGeometry(85, 32, 24);
    const skyMat = new THREE.MeshBasicMaterial({
      map: skyTexture,
      side: THREE.BackSide,
    });
    const skyDome = new THREE.Mesh(skyGeo, skyMat);
    scene.add(skyDome);

    // ==========================================
    // SUELO COLOR TIERRA / CÉSPED NATURAL CON TEXTURA
    // ==========================================
    const createFloorCanvas = () => {
      const c = document.createElement("canvas");
      c.width = 512;
      c.height = 512;
      const ctx = c.getContext("2d");
      if (!ctx) return c;

      // Base rica en color tierra cálida y fértil
      ctx.fillStyle = "#6d4c33";
      ctx.fillRect(0, 0, 512, 512);

      // Variaciones y vetas orgánicas de tierra y roca
      for (let i = 0; i < 400; i++) {
        const x = Math.random() * 512;
        const y = Math.random() * 512;
        const r = 2 + Math.random() * 5;
        ctx.fillStyle = i % 2 === 0 ? "#5a3c26" : "#7d583b";
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      }

      // Parches de vegetación / césped verde natural
      for (let g = 0; g < 140; g++) {
        const gx = Math.random() * 512;
        const gy = Math.random() * 512;
        const gr = 4 + Math.random() * 10;
        ctx.fillStyle = "rgba(46, 125, 50, 0.4)";
        ctx.beginPath();
        ctx.arc(gx, gy, gr, 0, Math.PI * 2);
        ctx.fill();
      }

      // Rejilla táctica suave integrada en el terreno
      ctx.strokeStyle = "rgba(0, 245, 212, 0.25)";
      ctx.lineWidth = 2.5;
      const step = 64;
      for (let x = 0; x <= 512; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, 512);
        ctx.stroke();
      }
      for (let y = 0; y <= 512; y += step) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(512, y);
        ctx.stroke();
      }

      return c;
    };

    const floorTexture = new THREE.CanvasTexture(createFloorCanvas());
    floorTexture.wrapS = THREE.RepeatWrapping;
    floorTexture.wrapT = THREE.RepeatWrapping;
    floorTexture.repeat.set(12, 12);

    const groundGeo = new THREE.PlaneGeometry(140, 140);
    groundGeo.rotateX(-Math.PI / 2);
    const groundMat = new THREE.MeshStandardMaterial({
      map: floorTexture,
      roughness: 0.85,
      metalness: 0.1,
    });
    const groundMesh = new THREE.Mesh(groundGeo, groundMat);
    groundMesh.position.y = -1.11;
    scene.add(groundMesh);

    // Rejilla de coordenadas esmeralda sobre el suelo
    const grid = new THREE.GridHelper(100, 50, 0x00f5d4, 0x5a3c26);
    grid.position.y = -1.1;
    scene.add(grid);

    // Luces de día brillantes (Luz solar cálida)
    scene.add(new THREE.AmbientLight(0xffffff, 1.05));
    scene.add(new THREE.HemisphereLight(0x9fd4ff, 0x3d5a3a, 0.85));
    const sunLight = new THREE.DirectionalLight(0xfff7e6, 2.35);
    sunLight.position.set(6, 14, 8);
    scene.add(sunLight);
    const fillLight = new THREE.PointLight(0x00f5d4, 1.4, 28);
    fillLight.position.set(0, 4, 2);
    scene.add(fillLight);
    const rimLight = new THREE.PointLight(0xffd166, 0.9, 22);
    rimLight.position.set(-4, 3, -6);
    scene.add(rimLight);

    // ==========================================
    // CAMPO CON ÁRBOLES DIGITALES & PILARES TÁCTICOS
    // ==========================================
    const environmentGroup = new THREE.Group();
    scene.add(environmentGroup);

    // Cordillera de Montañas al fondo para cerrar el horizonte (elimina la sensación de vacío)
    for (let m = 0; m < 14; m++) {
      const mHeight = 12 + Math.random() * 10;
      const mRadius = 10 + Math.random() * 6;
      const mGeo = new THREE.ConeGeometry(mRadius, mHeight, 5);
      const mMat = new THREE.MeshStandardMaterial({
        color: m % 2 === 0 ? 0x24553f : 0x1a4030,
        roughness: 0.85,
        flatShading: true,
      });
      const mountain = new THREE.Mesh(mGeo, mMat);
      const angle = (m / 14) * Math.PI * 2;
      mountain.position.set(Math.cos(angle) * 44, -1.1 + mHeight / 2, Math.sin(angle) * 44);
      environmentGroup.add(mountain);
    }

    // Generador de Árboles Tácticos Low-Poly (Tronco cilíndrico + copas piramidales esmeralda)
    const createTacticalTree = (x: number, z: number, scale = 1) => {
      const tree = new THREE.Group();
      tree.position.set(x, -1.1, z);
      tree.scale.set(scale, scale, scale);

      // Tronco
      const trunkGeo = new THREE.CylinderGeometry(0.14, 0.22, 1.8, 6);
      const trunkMat = new THREE.MeshStandardMaterial({ color: 0x4a3222, roughness: 0.9 });
      const trunk = new THREE.Mesh(trunkGeo, trunkMat);
      trunk.position.y = 0.9;
      tree.add(trunk);

      // Copa del Árbol (Follaje geométrico verde vivo y denso)
      const foliageMat = new THREE.MeshStandardMaterial({
        color: 0x157347,
        roughness: 0.5,
        flatShading: true,
      });

      const cone1 = new THREE.Mesh(new THREE.ConeGeometry(1.3, 2.0, 6), foliageMat);
      cone1.position.y = 2.1;
      tree.add(cone1);

      const cone2 = new THREE.Mesh(new THREE.ConeGeometry(1.0, 1.5, 6), foliageMat);
      cone2.position.y = 3.0;
      tree.add(cone2);

      const cone3 = new THREE.Mesh(new THREE.ConeGeometry(0.65, 1.1, 6), foliageMat);
      cone3.position.y = 3.8;
      tree.add(cone3);

      return tree;
    };

    // Bosque denso en todo el perímetro para llenar el fondo por completo
    const treePositions = [
      [-7, -2], [-8, -6], [-6, -9], [-9, -12], [-4, -14], [-12, -8], [-14, -14],
      [7, -2], [8, -6], [6, -9], [9, -12], [4, -14], [12, -8], [14, -14],
      [-2, -15], [2, -15], [-5, 1], [5, 1], [-8, 4], [8, 4],
      [-10, 0], [10, 0], [-13, -4], [13, -4], [-1, -18], [3, -18], [-6, -18], [6, -18],
      [-11, 6], [11, 6], [-4, 7], [4, 7]
    ];
    treePositions.forEach(([tx, tz]) => {
      const t = createTacticalTree(tx, tz, 0.85 + Math.random() * 0.45);
      environmentGroup.add(t);
    });

    // Pilares / Cajas de cobertura táctica con texturas de camuflaje y bordes de neón
    const createCrateCanvas = () => {
      const c = document.createElement("canvas");
      c.width = 256;
      c.height = 256;
      const ctx = c.getContext("2d");
      if (!ctx) return c;

      // Base militar verde oliva / táctica
      ctx.fillStyle = "#2d4a3e";
      ctx.fillRect(0, 0, 256, 256);

      // Marco y paneles reforzados
      ctx.strokeStyle = "#00f5d4";
      ctx.lineWidth = 8;
      ctx.strokeRect(10, 10, 236, 236);

      // Rayas de advertencia / tecnología
      ctx.fillStyle = "rgba(0, 245, 212, 0.25)";
      ctx.fillRect(30, 30, 196, 40);
      ctx.fillRect(30, 186, 196, 40);

      // Símbolo central
      ctx.fillStyle = "#00f5d4";
      ctx.beginPath();
      ctx.arc(128, 128, 30, 0, Math.PI * 2);
      ctx.fill();

      return c;
    };

    const crateTexture = new THREE.CanvasTexture(createCrateCanvas());
    const crateMat = new THREE.MeshStandardMaterial({
      map: crateTexture,
      roughness: 0.4,
      metalness: 0.2,
    });

    const p1 = new THREE.Mesh(new THREE.BoxGeometry(1.4, 2.2, 1.4), crateMat);
    p1.position.set(-3.5, 0.0, -1);
    environmentGroup.add(p1);

    const p2 = new THREE.Mesh(new THREE.BoxGeometry(1.4, 2.2, 1.4), crateMat);
    p2.position.set(3.5, 0.0, -1);
    environmentGroup.add(p2);

    // Weapon Pivot
    const weaponPivot = new THREE.Group();
    weaponPivot.position.set(0.44, -0.32, -0.8);
    camera.add(weaponPivot);

    const gunMeshGroup = new THREE.Group();
    weaponPivot.add(gunMeshGroup);

    // Materials con acabado Prime Vandal (Blanco perla, Dorado y Esmeralda)
    const matPrimeWhite = new THREE.MeshStandardMaterial({ color: 0xf5f7fb, metalness: 0.25, roughness: 0.15 });
    const matPrimeGold = new THREE.MeshStandardMaterial({ color: 0xffd166, metalness: 0.9, roughness: 0.2 });
    const matGunmetal = new THREE.MeshStandardMaterial({ color: 0x334455, metalness: 0.7, roughness: 0.3 });
    const matChrome = new THREE.MeshStandardMaterial({ color: 0xe0e6ed, metalness: 0.95, roughness: 0.1 });
    const matNeonCyan = new THREE.MeshBasicMaterial({ color: 0x00f5d4 });
    const matNeonGold = new THREE.MeshBasicMaterial({ color: 0xffd166 });

    // Gun Assembly (Cuerpo blanco perla con detalles dorados y núcleo esmeralda)
    const receiver = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.14, 0.65), matPrimeWhite);
    gunMeshGroup.add(receiver);

    const upper = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.05, 0.6), matPrimeGold);
    upper.position.set(0, 0.1, -0.02);
    gunMeshGroup.add(upper);

    const barrelGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.52, 16);
    barrelGeo.rotateX(Math.PI / 2);
    const barrel = new THREE.Mesh(barrelGeo, matPrimeGold);
    barrel.position.set(0, 0.04, -0.78);
    gunMeshGroup.add(barrel);

    const muzzleTip = new THREE.Object3D();
    muzzleTip.position.set(0, 0.04, -1.15);
    gunMeshGroup.add(muzzleTip);

    const energyCore = new THREE.Mesh(
      new THREE.CylinderGeometry(0.024, 0.024, 0.32, 12).rotateX(Math.PI / 2),
      matNeonCyan
    );
    energyCore.position.set(0, 0.035, -0.42);
    gunMeshGroup.add(energyCore);

    const neonL = new THREE.Mesh(new THREE.BoxGeometry(0.006, 0.012, 0.72), matNeonCyan);
    neonL.position.set(-0.065, 0.05, -0.22);
    gunMeshGroup.add(neonL);
    const neonR = neonL.clone();
    neonR.position.x = 0.065;
    gunMeshGroup.add(neonR);

    const mag = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.2, 0.1), matGunmetal);
    mag.position.set(0, -0.12, -0.15);
    mag.rotation.x = 0.25;
    gunMeshGroup.add(mag);

    const boltCarrier = new THREE.Mesh(new THREE.BoxGeometry(0.022, 0.04, 0.14), matChrome);
    boltCarrier.position.set(-0.055, 0.06, -0.05);
    gunMeshGroup.add(boltCarrier);

    // Muzzle Flash
    const muzzleLight = new THREE.PointLight(0x00f5d4, 0, 7);
    muzzleTip.add(muzzleLight);
    const flashGroup = new THREE.Group();
    flashGroup.visible = false;
    muzzleTip.add(flashGroup);

    const flashPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(0.28, 0.1),
      new THREE.MeshBasicMaterial({ color: 0x00f5d4, transparent: true, opacity: 0.9, side: THREE.DoubleSide })
    );
    flashGroup.add(flashPlane);

    // Drone targets
    interface DroneTarget {
      id: "about" | "skills" | "projects";
      title: string;
      tag: string;
      pos: THREE.Vector3;
      group: THREE.Group;
      core: THREE.Mesh;
      ring: THREE.Mesh;
      hitbox: THREE.Mesh;
      alive: boolean;
      phase: number;
    }

    const droneDefs: { id: "about" | "skills" | "projects"; title: string; tag: string; pos: THREE.Vector3 }[] = [
      { id: "about", title: "CARLOS BENAVIDES // PERFIL", tag: "OBJETIVO // 01", pos: new THREE.Vector3(-2.8, 1.8, -3.2) },
      { id: "skills", title: "ARSENAL // STACK TÉCNICO", tag: "OBJETIVO // 02", pos: new THREE.Vector3(0, 1.2, -3.8) },
      { id: "projects", title: "OPERACIONES // PROYECTOS", tag: "OBJETIVO // 03", pos: new THREE.Vector3(2.8, 2.0, -3.2) },
    ];

    const drones: DroneTarget[] = [];
    const hitboxes: THREE.Mesh[] = [];

    droneDefs.forEach((d, idx) => {
      const g = new THREE.Group();
      g.position.copy(d.pos);
      scene.add(g);

      const core = new THREE.Mesh(
        new THREE.OctahedronGeometry(0.42, 0),
        new THREE.MeshStandardMaterial({ color: 0xff4655, emissive: 0xff2035, emissiveIntensity: 1.35, roughness: 0.15 })
      );
      g.add(core);

      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(0.62, 0.028, 10, 40),
        new THREE.MeshBasicMaterial({ color: 0x00f5d4, wireframe: true })
      );
      g.add(ring);

      const halo = new THREE.PointLight(0xff4655, 1.6, 5.5);
      g.add(halo);

      const hitbox = new THREE.Mesh(new THREE.SphereGeometry(0.75, 10, 10), new THREE.MeshBasicMaterial({ visible: false }));
      g.add(hitbox);

      const droneObj: DroneTarget = {
        ...d,
        group: g,
        core,
        ring,
        hitbox,
        alive: true,
        phase: idx * 2.1,
      };

      hitbox.userData.drone = droneObj;
      drones.push(droneObj);
      hitboxes.push(hitbox);
    });

    interface Laser {
      mesh: THREE.Mesh;
      alpha: number;
    }
    interface Spark {
      mesh: THREE.Mesh;
      vel: THREE.Vector3;
      life: number;
    }

    const lasers: Laser[] = [];
    const sparks: Spark[] = [];

    function spawnLaser(start: THREE.Vector3, end: THREE.Vector3, isHit: boolean) {
      const dist = start.distanceTo(end);
      const geo = new THREE.CylinderGeometry(0.012, 0.012, dist, 6);
      geo.translate(0, dist / 2, 0);
      geo.rotateX(Math.PI / 2);
      const m = new THREE.Mesh(
        geo,
        new THREE.MeshBasicMaterial({ color: isHit ? 0xff4655 : 0x00f5d4, transparent: true, opacity: 0.95 })
      );
      m.position.copy(start);
      m.lookAt(end);
      scene.add(m);
      lasers.push({ mesh: m, alpha: 1.0 });
    }

    function spawnExplosion(pos: THREE.Vector3) {
      const geo = new THREE.OctahedronGeometry(0.05, 0);
      for (let i = 0; i < 42; i++) {
        const s = new THREE.Mesh(
          geo,
          new THREE.MeshBasicMaterial({ color: i % 2 === 0 ? 0x00f5d4 : 0xff4655, transparent: true, opacity: 1 })
        );
        s.position.copy(pos);
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI;
        const speed = 0.06 + Math.random() * 0.12;

        scene.add(s);
        sparks.push({
          mesh: s,
          vel: new THREE.Vector3(Math.sin(phi) * Math.cos(theta) * speed, Math.cos(phi) * speed, Math.sin(phi) * Math.sin(theta) * speed),
          life: 1.0,
        });
      }
    }

    const mouseNDC = new THREE.Vector2(0, 0);
    const raycaster = new THREE.Raycaster();
    let recoilKickZ = 0;
    let recoilKickPitch = 0;
    let currentAmmo = 25;

    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      setCrosshairPos({ x, y });
      mouseNDC.x = (x / rect.width) * 2 - 1;
      mouseNDC.y = -(y / rect.height) * 2 + 1;
    };

    const onMouseDown = (e: MouseEvent) => {
      if (e.button !== 0) return;
      if ((e.target as HTMLElement).closest(".tactical-modal") || (e.target as HTMLElement).closest("button")) return;

      if (currentAmmo <= 0) {
        audioRef.current?.playMechanical();
        currentAmmo = 25;
        setAmmo(25);
        return;
      }

      currentAmmo--;
      setAmmo(currentAmmo);
      audioRef.current?.playGunshot();

      recoilKickZ = 0.15;
      recoilKickPitch = 0.12;
      boltCarrier.position.z = 0.08;

      setIsShootingAnim(true);
      setTimeout(() => setIsShootingAnim(false), 90);

      flashGroup.visible = true;
      muzzleLight.intensity = 6;
      setTimeout(() => {
        flashGroup.visible = false;
        muzzleLight.intensity = 0;
      }, 55);

      raycaster.setFromCamera(mouseNDC, camera);
      const activeTargets = drones.filter((d) => d.alive).map((d) => d.hitbox);
      const intersects = raycaster.intersectObjects(activeTargets, false);

      const tipWorld = new THREE.Vector3();
      muzzleTip.getWorldPosition(tipWorld);

      if (intersects.length > 0) {
        const hit = intersects[0];
        const drone = hit.object.userData.drone as DroneTarget;

        spawnLaser(tipWorld, hit.point, true);
        spawnExplosion(drone.group.position);

        setIsHitmarker(true);
        setHitFlash(true);
        setTimeout(() => setIsHitmarker(false), 160);
        setTimeout(() => setHitFlash(false), 220);
        
        const newStreak = drones.filter(d => !d.alive).length + 1;
        setKillStreak(newStreak);
        audioRef.current?.playHeadshot();
        setTimeout(() => audioRef.current?.playKillSound(newStreak), 60);

        drone.alive = false;
        drone.group.visible = false;

        const totalKills = drones.filter(d => !d.alive).length;
        setScoreHits(totalKills);
        
        if (totalKills >= 3) {
          setShowAceBanner(true);
          setKillBanner(`¡ACE! PROTOCOLO TOTALMENTE DESENCRIPTADO (3/3)`);
        } else {
          setKillBanner(`ELIMINACIÓN // ${drone.title.toUpperCase()} [DESENCRIPTADO]`);
        }
        setTimeout(() => setKillBanner(null), 2500);

        openModalForDrone(drone.id);
      } else {
        const miss = new THREE.Vector3();
        raycaster.ray.at(14, miss);
        spawnLaser(tipWorld, miss, false);
      }
    };

    const keysPressed: Record<string, boolean> = {
      KeyW: false,
      KeyA: false,
      KeyS: false,
      KeyD: false,
      ArrowLeft: false,
      ArrowRight: false,
      KeyQ: false,
      KeyE: false,
    };

    let isContainerActive = false;
    let playerYaw = 0; // Ángulo de rotación/giro en 360 grados

    const onKeyDown = (e: KeyboardEvent) => {
      // Solo capturamos movimiento cuando el usuario está interactuando con el juego
      if (!isContainerActive) return;

      if (["KeyW", "KeyA", "KeyS", "KeyD", "ArrowLeft", "ArrowRight", "KeyQ", "KeyE"].includes(e.code)) {
        // Evitamos que la tecla haga scroll en la página web
        e.preventDefault();
        keysPressed[e.code] = true;
      }
      if (e.code === "KeyR") {
        e.preventDefault();
        audioRef.current?.playMechanical();
        currentAmmo = 25;
        setAmmo(25);
      }
    };

    const onKeyUp = (e: KeyboardEvent) => {
      if (["KeyW", "KeyA", "KeyS", "KeyD", "ArrowLeft", "ArrowRight", "KeyQ", "KeyE"].includes(e.code)) {
        keysPressed[e.code] = false;
      }
    };

    // Si la ventana pierde el foco o se clickea afuera, reseteamos las teclas para evitar que el muñeco siga caminando solo
    const onWindowBlur = () => {
      keysPressed.KeyW = false;
      keysPressed.KeyA = false;
      keysPressed.KeyS = false;
      keysPressed.KeyD = false;
      keysPressed.ArrowLeft = false;
      keysPressed.ArrowRight = false;
      keysPressed.KeyQ = false;
      keysPressed.KeyE = false;
      isContainerActive = false;
    };

    window.addEventListener("blur", onWindowBlur);
    window.addEventListener("keydown", onKeyDown, { passive: false });
    window.addEventListener("keyup", onKeyUp);

    container.addEventListener("mousemove", onMouseMove);
    container.addEventListener("mousedown", (e) => {
      isContainerActive = true;
      onMouseDown(e);
    });
    container.addEventListener("mouseenter", () => {
      isContainerActive = true;
      setIsHoveringCanvas(true);
    });
    container.addEventListener("mouseleave", () => {
      isContainerActive = false;
      keysPressed.KeyW = false;
      keysPressed.KeyA = false;
      keysPressed.KeyS = false;
      keysPressed.KeyD = false;
      setIsHoveringCanvas(false);
      setIsCrosshairLocked(false);
    });

    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    composer.addPass(new UnrealBloomPass(new THREE.Vector2(width, height), 0.42, 0.55, 0.72));

    const dustGeo = new THREE.BufferGeometry();
    const dustCount = 180;
    const dustPos = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount; i++) {
      dustPos[i * 3] = (Math.random() - 0.5) * 30;
      dustPos[i * 3 + 1] = Math.random() * 8;
      dustPos[i * 3 + 2] = (Math.random() - 0.5) * 30;
    }
    dustGeo.setAttribute("position", new THREE.BufferAttribute(dustPos, 3));
    const dust = new THREE.Points(
      dustGeo,
      new THREE.PointsMaterial({ color: 0xdefffb, size: 0.045, transparent: true, opacity: 0.55 })
    );
    scene.add(dust);

    let animId: number;
    let lastTime = performance.now();

    const render = (time: number) => {
      animId = requestAnimationFrame(render);
      const delta = (time - lastTime) / 1000;
      lastTime = time;
      const elapsed = time / 1000;

      // Rotación / Giros de 360 grados con flechas izquierda/derecha o Q/E
      const turnSpeed = 2.4 * delta;
      if (keysPressed["ArrowLeft"] || keysPressed["KeyQ"]) {
        playerYaw += turnSpeed;
      }
      if (keysPressed["ArrowRight"] || keysPressed["KeyE"]) {
        playerYaw -= turnSpeed;
      }

      // Movimiento fluido del jugador orientado hacia donde mira
      const moveSpeed = 4.8 * delta;
      const sinYaw = Math.sin(playerYaw);
      const cosYaw = Math.cos(playerYaw);

      if (keysPressed["KeyW"]) {
        camera.position.x -= sinYaw * moveSpeed;
        camera.position.z -= cosYaw * moveSpeed;
      }
      if (keysPressed["KeyS"]) {
        camera.position.x += sinYaw * moveSpeed;
        camera.position.z += cosYaw * moveSpeed;
      }
      if (keysPressed["KeyA"]) {
        camera.position.x -= cosYaw * moveSpeed;
        camera.position.z += sinYaw * moveSpeed;
      }
      if (keysPressed["KeyD"]) {
        camera.position.x += cosYaw * moveSpeed;
        camera.position.z -= sinYaw * moveSpeed;
      }

      // Restricción de límites del mapa
      camera.position.x = Math.max(-12, Math.min(12, camera.position.x));
      camera.position.z = Math.max(-10, Math.min(10, camera.position.z));

      // Aplicar rotación de cámara base
      camera.rotation.y = playerYaw;

      // Head bobbing al moverse
      const isMoving = keysPressed["KeyW"] || keysPressed["KeyS"] || keysPressed["KeyA"] || keysPressed["KeyD"];
      if (isMoving) {
        camera.position.y = 1.6 + Math.sin(elapsed * 12) * 0.04;
      } else {
        camera.position.y += (1.6 - camera.position.y) * 0.1;
      }

      const targetYaw = -mouseNDC.x * 0.35;
      const targetPitch = mouseNDC.y * 0.28;

      weaponPivot.rotation.y += (targetYaw - weaponPivot.rotation.y) * 0.15;
      weaponPivot.rotation.x += (targetPitch + recoilKickPitch - weaponPivot.rotation.x) * 0.18;

      recoilKickZ *= 0.78;
      recoilKickPitch *= 0.78;
      boltCarrier.position.z += (-0.05 - boltCarrier.position.z) * 0.25;

      gunMeshGroup.position.z = recoilKickZ;
      gunMeshGroup.position.y = Math.sin(elapsed * 2.5) * 0.007;

      const pulse = 1 + Math.sin(elapsed * 5) * 0.07;
      energyCore.scale.set(pulse, 1, pulse);

      raycaster.setFromCamera(mouseNDC, camera);
      const aliveBoxes = drones.filter((d) => d.alive).map((d) => d.hitbox);
      const hover = raycaster.intersectObjects(aliveBoxes, false);
      const isLocked = hover.length > 0;
      setIsCrosshairLocked(isLocked);

      let hoveredId: "about" | "skills" | "projects" | null = null;
      if (isLocked) {
        hoveredId = (hover[0].object.userData.drone as DroneTarget).id;
      }

      const newHud: Record<string, { x: number; y: number; alive: boolean; hovered: boolean }> = {};

      drones.forEach((d) => {
        if (!d.alive) {
          newHud[d.id] = { x: 0, y: 0, alive: false, hovered: false };
          return;
        }

        d.group.position.y = d.pos.y + Math.sin(elapsed * 2.2 + d.phase) * 0.14;
        d.core.rotation.y += 0.02;
        d.ring.rotation.z -= 0.02;

        const p = d.group.position.clone().project(camera);
        const rect = container.getBoundingClientRect();
        const sx = (p.x * 0.5 + 0.5) * rect.width;
        const sy = (-p.y * 0.5 + 0.5) * rect.height;

        newHud[d.id] = {
          x: sx,
          y: sy,
          alive: true,
          hovered: hoveredId === d.id,
        };
      });

      setHudPositions({
        about: newHud["about"] || { x: 0, y: 0, alive: false, hovered: false },
        skills: newHud["skills"] || { x: 0, y: 0, alive: false, hovered: false },
        projects: newHud["projects"] || { x: 0, y: 0, alive: false, hovered: false },
      });

      for (let i = lasers.length - 1; i >= 0; i--) {
        const l = lasers[i];
        l.alpha -= 0.12;
        (l.mesh.material as THREE.MeshBasicMaterial).opacity = Math.max(0, l.alpha);
        if (l.alpha <= 0) {
          scene.remove(l.mesh);
          lasers.splice(i, 1);
        }
      }

      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.mesh.position.add(s.vel);
        s.vel.multiplyScalar(0.94);
        s.life -= 0.04;
        (s.mesh.material as THREE.MeshBasicMaterial).opacity = Math.max(0, s.life);
        if (s.life <= 0) {
          scene.remove(s.mesh);
          sparks.splice(i, 1);
        }
      }

      dust.rotation.y += 0.0008;
      composer.render();
    };

    render(performance.now());

    const onResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight || 560;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      composer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("blur", onWindowBlur);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      container.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
    };
  }, []);

  // Modal Card Builder with Real Data
  const openModalForDrone = (id: "about" | "skills" | "projects") => {
    if (id === "about") {
      setActiveModalData({
        id: "about",
        title: "CARLOS BENAVIDES • PERFIL PROFESIONAL",
        tag: "OBJETIVO 01 • DESENCRIPTADO",
        content: (
          <div className="space-y-4 font-valorant-hud text-sm text-[#ece8e1]">
            <p className="leading-relaxed bg-[#16222f]/80 p-3.5 rounded-xl border border-white/10">
              "Soy estudiante de 19 años de <strong className="text-[#00f5d4]">Ingeniería de Software (5° Semestre en UCC Sede Pasto)</strong>. Fui atleta de alto rendimiento y boxeador (<strong className="text-[#00f5d4]">Subcampeón Nacional de Boxeo</strong>), actualmente retirado. Mantengo la disciplina con el trote y el entrenamiento diario. Me apasiona la mente humana, la psicología y la búsqueda espiritual. Me considero una persona sumamente sociable, amigable y con alto valor por el compañerismo y el trabajo en equipo."
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-valorant-mono text-xs">
              <div className="p-3 rounded-xl bg-[#090e14] border border-[#00f5d4]/30">
                <div className="text-[10px] text-[#00f5d4] font-bold">EDUCACIÓN &bull; PREGRADO</div>
                <div className="font-bold text-sm text-[#ece8e1]">5° Semestre Ing. Software</div>
                <div className="text-[11px] text-[#8b9bb4]">UCC Sede Pasto &bull; 19 años</div>
              </div>
              <div className="p-3 rounded-xl bg-[#090e14] border border-emerald-400/30">
                <div className="text-[10px] text-emerald-400 font-bold">INVESTIGACIÓN APLICADA</div>
                <div className="font-bold text-sm text-[#ece8e1]">2.5 Años en Semillero</div>
                <div className="text-[11px] text-[#8b9bb4]">Machine Learning &bull; Hackathons</div>
              </div>
            </div>
          </div>
        ),
      });
    } else if (id === "skills") {
      setActiveModalData({
        id: "skills",
        title: "ARSENAL TÉCNICO • HABILIDADES CLAVE",
        tag: "OBJETIVO 02 • DESENCRIPTADO",
        content: (
          <div className="space-y-3 font-valorant-hud text-xs sm:text-sm text-[#ece8e1]">
            <div className="grid grid-cols-2 gap-2.5">
              <div className="p-3 rounded-xl bg-[#16222f] border-l-3 border-[#00f5d4]">
                <div className="font-bold text-xs text-[#ece8e1]">React &amp; Next.js</div>
                <div className="text-[11px] text-[#8b9bb4]">Arquitectura moderna, SSR, Server Components</div>
              </div>
              <div className="p-3 rounded-xl bg-[#16222f] border-l-3 border-emerald-400">
                <div className="font-bold text-xs text-[#ece8e1]">FastAPI, Flask &amp; Python</div>
                <div className="text-[11px] text-[#8b9bb4]">Machine Learning y semillero (2.5 años)</div>
              </div>
              <div className="p-3 rounded-xl bg-[#16222f] border-l-3 border-[#ffd166]">
                <div className="font-bold text-xs text-[#ece8e1]">Spring Boot &amp; Java</div>
                <div className="text-[11px] text-[#8b9bb4]">APIs REST empresariales y Clean Architecture</div>
              </div>
              <div className="p-3 rounded-xl bg-[#16222f] border-l-3 border-teal-300">
                <div className="font-bold text-xs text-[#ece8e1]">PostgreSQL &amp; MongoDB</div>
                <div className="text-[11px] text-[#8b9bb4]">Bases de datos relacionales y NoSQL</div>
              </div>
              <div className="p-3 rounded-xl bg-[#16222f] border-l-3 border-cyan-400">
                <div className="font-bold text-xs text-[#ece8e1]">Flutter &amp; Dart</div>
                <div className="text-[11px] text-[#8b9bb4]">Creación de apps móviles multiplataforma</div>
              </div>
              <div className="p-3 rounded-xl bg-[#16222f] border-l-3 border-purple-400">
                <div className="font-bold text-xs text-[#ece8e1]">Unity 3D &amp; LLMs</div>
                <div className="text-[11px] text-[#8b9bb4]">Entornos interactivos e inteligencia artificial</div>
              </div>
            </div>
          </div>
        ),
      });
    } else if (id === "projects") {
      setActiveModalData({
        id: "projects",
        title: "OPERACIONES • PROYECTOS DESTACADOS",
        tag: "OBJETIVO 03 • DESENCRIPTADO",
        content: (
          <div className="space-y-3 font-valorant-hud text-xs sm:text-sm text-[#ece8e1]">
            <div className="p-3.5 rounded-xl bg-[#16222f] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <div className="font-bold text-sm text-[#ece8e1]">ByRoot: The Guardian of Kaliche (Mobile)</div>
                <div className="text-xs text-[#8b9bb4]">Sistema antirrobo móvil con geolocalización GPS en tiempo real y alertas.</div>
              </div>
              <span className="font-valorant-mono text-[10px] px-2.5 py-1 rounded-full bg-[#00f5d4]/10 text-[#00f5d4] border border-[#00f5d4]/30 font-bold self-start sm:self-auto shrink-0">
                FLUTTER + NESTJS + FIREBASE
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-[#16222f] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <div className="font-bold text-sm text-[#ece8e1]">The Guardian of Kaliche (Desktop WSL)</div>
                <div className="text-xs text-[#8b9bb4]">Entorno integrado de Kali Linux dentro de Windows para ciberseguridad.</div>
              </div>
              <span className="font-valorant-mono text-[10px] px-2.5 py-1 rounded-full bg-emerald-400/10 text-emerald-400 border border-emerald-400/30 font-bold self-start sm:self-auto shrink-0">
                ELECTRON + WSL + PYTHON
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-[#16222f] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <div className="font-bold text-sm text-[#ece8e1]">VibeRoute &bull; Logística Inteligente IA</div>
                <div className="text-xs text-[#8b9bb4]">Sistema de distribución de paquetes y optimización de rutas con algoritmos de IA.</div>
              </div>
              <span className="font-valorant-mono text-[10px] px-2.5 py-1 rounded-full bg-[#ffd166]/10 text-[#ffd166] border border-[#ffd166]/30 font-bold self-start sm:self-auto shrink-0">
                SPRING BOOT + IA + POSTGRES
              </span>
            </div>
          </div>
        ),
      });
    }
  };

  const resetDrones = () => {
    audioRef.current?.playMechanical();
    setScoreHits(0);
    setAmmo(25);
    setActiveModalData(null);
    window.location.reload();
  };

  return (
    <div
      ref={containerRef}
      className="tactical-corners relative w-full h-[460px] sm:h-[520px] md:h-[580px] rounded-2xl sm:rounded-3xl bg-[#090e14] border-2 border-[#00f5d4]/35 shadow-[0_0_40px_rgba(0,245,212,0.16)] overflow-hidden select-none cursor-crosshair group mt-8 sm:mt-10"
    >
      {/* 3D Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full z-1" />
      {hitFlash && <div className="game-hitflash" />}

      {/* Tactical Vignette & Grid */}
      <div
        className="absolute inset-0 pointer-events-none z-5"
        style={{
          background:
            "radial-gradient(circle at center, transparent 45%, rgba(9, 14, 20, 0.8) 100%), repeating-linear-gradient(0deg, rgba(255,255,255,0.02) 0px, rgba(255,255,255,0.02) 1px, transparent 1px, transparent 4px)",
        }}
      />

      {/* Crosshair */}
      {isHoveringCanvas && !activeModalData && (
        <div
          className={`absolute pointer-events-none z-40 -translate-x-1/2 -translate-y-1/2 ${
            isCrosshairLocked ? "text-[#ff4655]" : "text-[#00f5d4]"
          }`}
          style={{ left: crosshairPos.x, top: crosshairPos.y }}
        >
          <div
            className={`w-1.5 h-1.5 rounded-full ${
              isCrosshairLocked ? "bg-[#ff4655] shadow-[0_0_8px_#ff4655]" : "bg-[#00f5d4] shadow-[0_0_6px_#00f5d4]"
            }`}
          />
          <div className={`absolute w-0.5 bg-current ${isShootingAnim ? "-top-4 h-2" : "-top-2.5 h-1.5"} left-0`} />
          <div className={`absolute w-0.5 bg-current ${isShootingAnim ? "top-4 h-2" : "top-2.5 h-1.5"} left-0`} />
          <div className={`absolute h-0.5 bg-current ${isShootingAnim ? "-left-4 w-2" : "-left-2.5 w-1.5"} top-0`} />
          <div className={`absolute h-0.5 bg-current ${isShootingAnim ? "left-4 w-2" : "left-2.5 w-1.5"} top-0`} />

          {isHitmarker && (
            <div className="absolute -translate-x-1/2 -translate-y-1/2 w-6 h-6 pointer-events-none">
              <div className="absolute top-1/2 left-1/2 w-2 h-0.5 bg-white shadow-[0_0_6px_#ff4655] -translate-x-full -translate-y-full rotate-45" />
              <div className="absolute top-1/2 left-1/2 w-2 h-0.5 bg-white shadow-[0_0_6px_#ff4655] translate-x-0 -translate-y-full -rotate-45" />
              <div className="absolute top-1/2 left-1/2 w-2 h-0.5 bg-white shadow-[0_0_6px_#ff4655] -translate-x-full translate-y-0 -rotate-45" />
              <div className="absolute top-1/2 left-1/2 w-2 h-0.5 bg-white shadow-[0_0_6px_#ff4655] translate-x-0 translate-y-0 rotate-45" />
            </div>
          )}
        </div>
      )}

      {/* Top Embedded HUD */}
      <div className="absolute top-4 left-4 sm:left-6 right-4 sm:right-6 flex flex-wrap items-center justify-between gap-3 z-20 pointer-events-none">
        <div className="border-l-3 border-[#ff4655] pl-3 bg-gradient-to-r from-[#ff4655]/20 to-transparent py-1">
          <div className="font-valorant-mono text-[10px] text-[#ff4655] tracking-widest uppercase flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#ff4655] animate-ping" />
            CAMPO DE TIRO VALORANT // PROTOCOLO VANDAL PRIME 3D
          </div>
          <div className="font-valorant-title text-base sm:text-xl text-[#ece8e1] tracking-wider leading-none">
            DISPARA A LOS DRONES PARA DESENCRIPTAR CADA CUADRO
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 pointer-events-auto">
          {/* Skin selector */}
          <div className="hidden md:flex items-center bg-[#090e14]/90 p-1 border border-white/10 text-[10px] font-valorant-mono">
            <button
              onClick={() => setCurrentSkin("prime")}
              className={`px-2 py-0.5 transition-all cursor-pointer ${currentSkin === "prime" ? "bg-[#00f5d4] text-[#090e14] font-bold" : "text-[#8b9bb4]"}`}
            >
              PRIME
            </button>
            <button
              onClick={() => setCurrentSkin("reaver")}
              className={`px-2 py-0.5 transition-all cursor-pointer ${currentSkin === "reaver" ? "bg-[#ff4655] text-white font-bold" : "text-[#8b9bb4]"}`}
            >
              REAVER
            </button>
          </div>

          <div className="flex items-center gap-2 bg-[#0f1923]/95 px-3 py-1 border border-[#00f5d4]/40 text-xs font-valorant-mono text-[#00f5d4] shadow-lg">
            <span>BAJAS:</span>
            <span className="font-valorant-title text-lg text-[#ece8e1]">{scoreHits} / 3</span>
          </div>

          <button
            onClick={resetDrones}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded bg-[#0f1923] hover:bg-[#ff4655] text-[#ece8e1] border border-white/20 transition-all cursor-pointer text-xs font-valorant-mono shadow-md"
            title="Reiniciar Drones"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">REINICIAR</span>
          </button>
        </div>
      </div>

      {/* Floating Target Labels Projected in 2D */}
      <div className="absolute inset-0 pointer-events-none z-15">
        {hudPositions.about.alive && (
          <div className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: hudPositions.about.x, top: hudPositions.about.y }}>
            <div className="relative flex items-center justify-center">
              <div className={`w-12 h-12 border border-dashed rounded-full animate-spin-slow ${hudPositions.about.hovered ? "border-[#00f5d4]" : "border-[#ff4655]/70"}`} />
              <div className="absolute left-14 bg-[#0f1923]/95 border-l-2 border-[#ff4655] px-2.5 py-1 whitespace-nowrap shadow-lg">
                <div className="font-valorant-mono text-[9px] text-[#ff4655]">OBJETIVO // 01</div>
                <div className="text-xs font-bold text-[#ece8e1]">CARLOS BENAVIDES</div>
              </div>
            </div>
          </div>
        )}

        {hudPositions.skills.alive && (
          <div className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: hudPositions.skills.x, top: hudPositions.skills.y }}>
            <div className="relative flex items-center justify-center">
              <div className={`w-12 h-12 border border-dashed rounded-full animate-spin-slow ${hudPositions.skills.hovered ? "border-[#00f5d4]" : "border-[#ff4655]/70"}`} />
              <div className="absolute left-14 bg-[#0f1923]/95 border-l-2 border-[#ff4655] px-2.5 py-1 whitespace-nowrap shadow-lg">
                <div className="font-valorant-mono text-[9px] text-[#ff4655]">OBJETIVO // 02</div>
                <div className="text-xs font-bold text-[#ece8e1]">ARSENAL STACK</div>
              </div>
            </div>
          </div>
        )}

        {hudPositions.projects.alive && (
          <div className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: hudPositions.projects.x, top: hudPositions.projects.y }}>
            <div className="relative flex items-center justify-center">
              <div className={`w-12 h-12 border border-dashed rounded-full animate-spin-slow ${hudPositions.projects.hovered ? "border-[#00f5d4]" : "border-[#ff4655]/70"}`} />
              <div className="absolute left-14 bg-[#0f1923]/95 border-l-2 border-[#ff4655] px-2.5 py-1 whitespace-nowrap shadow-lg">
                <div className="font-valorant-mono text-[9px] text-[#ff4655]">OBJETIVO // 03</div>
                <div className="text-xs font-bold text-[#ece8e1]">OPERACIONES</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Kill Banner */}
      {killBanner && (
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none z-30 animate-in zoom-in-75">
          <div className="font-valorant-mono text-xs tracking-[3px] text-[#00f5d4] bg-[#090e14]/95 px-4 py-1.5 border border-[#00f5d4] shadow-[0_0_15px_#00f5d4]">
            {killBanner}
          </div>
        </div>
      )}

      {/* Bottom HUD */}
      <div className="absolute bottom-4 left-4 right-4 sm:left-6 sm:right-6 flex items-end justify-between z-20 pointer-events-none gap-3">
        <div className="flex flex-col gap-1.5 bg-[#0f1923]/90 px-4 py-2 border-l-2 border-[#00f5d4] min-w-[140px]">
          <div className="flex items-center justify-between">
            <span className="font-valorant-mono text-[11px] text-[#8b9bb4]">HEALTH</span>
            <span className="font-valorant-title text-xl text-[#ece8e1]">100</span>
          </div>
          <div className="h-1.5 rounded-full bg-black/50 overflow-hidden">
            <div className="h-full w-full bg-gradient-to-r from-emerald-400 to-[#00f5d4] shadow-[0_0_8px_#00f5d4]" />
          </div>
          <span className="font-valorant-mono text-[10px] text-[#00f5d4]">SHIELD 50</span>
        </div>

        <div className="flex flex-col items-end gap-1.5 bg-[#0f1923]/90 px-4 py-2 border-r-2 border-[#ff4655] min-w-[130px]">
          <div className="flex items-baseline gap-2">
            <span className="font-valorant-title text-2xl text-[#ece8e1]">{ammo}</span>
            <span className="font-valorant-mono text-xs text-[#8b9bb4]">/ 75</span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-black/50 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#ff4655] to-[#00f5d4] transition-all"
              style={{ width: `${(ammo / 25) * 100}%` }}
            />
          </div>
          <span className="font-valorant-mono text-[10px] text-[#ff4655]">VANDAL 3D</span>
        </div>
      </div>

      {/* ============================================================ */}
      {/* CUADRITO TÁCTICO FLOTANTE CENTRADO Y BIEN REDACTADO           */}
      {/* ============================================================ */}
      {activeModalData && (
        <div className="tactical-modal absolute inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-[#090e14]/85 backdrop-blur-md animate-in fade-in zoom-in-95 duration-200">
          <div className="w-full max-w-xl max-h-[90%] flex flex-col bg-[#0f1923] border-2 border-[#ff4655] clip-card shadow-[0_0_50px_rgba(255,70,85,0.45)] relative pointer-events-auto">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-white/10 p-4 sm:p-5 pb-3 shrink-0">
              <div>
                <div className="font-valorant-mono text-[10px] text-[#00f5d4] tracking-widest uppercase flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#00f5d4] animate-ping" />
                  {activeModalData.tag}
                </div>
                <h4 className="font-valorant-title text-xl sm:text-2xl text-[#ece8e1] tracking-wider uppercase mt-0.5">
                  {activeModalData.title}
                </h4>
              </div>

              <button
                onClick={() => {
                  audioRef.current?.playMechanical();
                  setActiveModalData(null);
                }}
                className="p-1.5 sm:p-2 bg-[#ff4655] hover:bg-[#00f5d4] hover:text-[#090e14] text-white transition-colors cursor-pointer"
                title="Cerrar cuadrito"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>

            {/* Modal Body with internal scroll */}
            <div className="p-4 sm:p-5 overflow-y-auto flex-1 font-valorant-hud">
              {activeModalData.content}
            </div>

            {/* Footer action */}
            <div className="flex items-center justify-between p-3 sm:p-4 border-t border-white/10 text-xs font-valorant-mono shrink-0 bg-[#090e14]/60">
              <span className="text-[#8b9bb4] text-[11px] hidden sm:inline">ESTADO: EXPEDIENTE VERIFICADO</span>
              <button
                onClick={() => {
                  audioRef.current?.playMechanical();
                  setActiveModalData(null);
                }}
                className="w-full sm:w-auto px-4 py-2 bg-[#ff4655] hover:bg-[#ff2035] text-white transition-all cursor-pointer font-bold tracking-wider clip-tactical text-xs"
              >
                CERRAR CUADRO [X]
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
