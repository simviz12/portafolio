type Localized = { en: string; es: string };

export interface VideoChapter {
  /** Start time in seconds. */
  t: number;
  label: Localized;
}

export interface ProjectVideo {
  src: string;
  poster: string;
  /** Length in seconds. */
  duration: number;
  chapters: VideoChapter[];
}

export interface Project {
  slug: string;
  title: string;
  badge: Localized;
  subtitle: Localized;
  description: Localized;
  impactMetrics: { en: string[]; es: string[] };
  tags: string[];
  githubUrl: string;
  demoUrl: string;
  /** Recorded walkthrough, played in the project viewer. */
  video?: ProjectVideo;
}

export const projects: Project[] = [
  {
    slug: "guardian-mobile",
    title: "The Guardian of Mobile",
    badge: {
      en: "MOBILE • INTEGRATED SECURITY",
      es: "MOBILE • SEGURIDAD INTEGRAL",
    },
    subtitle: {
      en: "Anti-theft mobile tracking with real-time GPS telemetry",
      es: "Sistema móvil antirrobo con rastreo GPS en tiempo real",
    },
    description: {
      en: "Mobile security app to protect, locate and recover lost or stolen devices with GPS, remote lock, alerts and cloud sync.",
      es: "App de seguridad para proteger, localizar y recuperar dispositivos con GPS, bloqueo remoto, alertas y sincronización en la nube.",
    },
    impactMetrics: {
      en: [
        "Background GPS telemetry and remote locking",
        "Realtime sync with Firebase & Cloud Functions",
        "Secure backend with NestJS and PostgreSQL",
      ],
      es: [
        "Telemetría GPS en segundo plano y bloqueo remoto",
        "Sincronización en tiempo real con Firebase",
        "Backend seguro con NestJS y PostgreSQL",
      ],
    },
    tags: ["Flutter", "Dart", "Firebase", "NestJS", "PostgreSQL"],
    githubUrl: "https://github.com/simviz12/fronted-guardianmobile",
    demoUrl: "https://github.com/simviz12/fronted-guardianmobile",
    video: {
      src: "/videos/guardian-mobile.mp4",
      poster: "/videos/posters/guardian-mobile.webp",
      duration: 60,
      chapters: [
        { t: 0, label: { en: "Intro", es: "Introducción" } },
        { t: 4, label: { en: "Secure access", es: "Acceso seguro" } },
        { t: 10, label: { en: "Main dashboard", es: "Panel principal" } },
        { t: 18, label: { en: "Remote actions", es: "Acciones remotas" } },
        { t: 25, label: { en: "Tracking map", es: "Mapa de rastreo" } },
        { t: 32, label: { en: "Theft mode", es: "Modo Robo" } },
        { t: 39, label: { en: "Remote wipe", es: "Borrado remoto" } },
        { t: 46, label: { en: "Command history", es: "Historial de órdenes" } },
        { t: 51, label: { en: "Settings and diagnostics", es: "Ajustes y diagnóstico" } },
        { t: 57, label: { en: "Wrap-up", es: "Cierre" } },
      ],
    },
  },
  {
    slug: "guardian-kaliche",
    title: "The Guardian of Kaliche",
    badge: {
      en: "CYBERSECURITY • DESKTOP",
      es: "CIBERSEGURIDAD • DESKTOP",
    },
    subtitle: {
      en: "Ethical-hacking copilot: a real Kali terminal plus an AI assistant",
      es: "Copiloto de hacking ético: terminal real de Kali + asistente de IA",
    },
    description: {
      en: "Desktop app that runs a real Kali Linux shell on Windows via WSL 2. An AI copilot proposes commands, a policy engine decides what may run, and every command is logged for audit.",
      es: "App de escritorio que abre una shell real de Kali Linux en Windows con WSL 2. Un copiloto de IA propone comandos, un motor de políticas decide qué se ejecuta y cada comando queda auditado.",
    },
    impactMetrics: {
      en: [
        "Real Kali shell through WSL 2 with node-pty and xterm.js",
        "AI copilot (Gemini) with the human always in the loop",
        "Policy engine: blocklist, authorized scope and risk level, tested with pytest",
      ],
      es: [
        "Shell real de Kali por WSL 2 con node-pty y xterm.js",
        "Copiloto de IA (Gemini) con el humano siempre en el circuito",
        "Motor de políticas: lista negra, alcance autorizado y nivel de riesgo, probado con pytest",
      ],
    },
    tags: ["Electron", "React", "WSL 2", "Python", "FastAPI", "Gemini", "SQLite"],
    githubUrl: "https://github.com/simviz12/the-guardian-of-kali_frontend",
    demoUrl: "https://github.com/simviz12/the-guardian-of-kali_frontend",
    video: {
      src: "/videos/guardian-kaliche.mp4",
      poster: "/videos/posters/guardian-kaliche.webp",
      duration: 90,
      chapters: [
        { t: 0, label: { en: "Intro", es: "Introducción" } },
        { t: 4, label: { en: "Loading screen", es: "Pantalla de carga" } },
        { t: 11, label: { en: "Login and sign-up", es: "Login y registro" } },
        { t: 18, label: { en: "Gemini API key", es: "API Key de Gemini" } },
        { t: 23, label: { en: "New session", es: "Nueva sesión" } },
        { t: 31, label: { en: "Kali terminal", es: "Terminal de Kali" } },
        { t: 39, label: { en: "AI copilot", es: "Copiloto de IA" } },
        { t: 49, label: { en: "Audit history", es: "Historial de auditoría" } },
        { t: 56, label: { en: "Settings", es: "Ajustes" } },
        { t: 62, label: { en: "Operating guide", es: "Guía operativa" } },
        { t: 68, label: { en: "Architecture", es: "Arquitectura" } },
        { t: 78, label: { en: "Policy engine", es: "Motor de políticas" } },
        { t: 86, label: { en: "Wrap-up", es: "Cierre" } },
      ],
    },
  },
  {
    slug: "pulso",
    title: "Pulso",
    badge: {
      en: "WEARABLE • WELLNESS",
      es: "WEARABLE • BIENESTAR",
    },
    subtitle: {
      en: "Detects tension, guides your breathing and brings you back to calm",
      es: "Detecta la tensión, guía tu respiración y te devuelve a la calma",
    },
    description: {
      en: "Smartwatch app that compares your pulse and HRV against your own baseline, warns you gently when tension rises and guides breathing through vibration. A companion Android app adds history, a tension map and an AI assistant.",
      es: "App de reloj que compara tu pulso y HRV con tu propia línea base, avisa con suavidad cuando sube la tensión y guía la respiración con vibración. La app Android suma historial, mapa de tensión y un asistente de IA.",
    },
    impactMetrics: {
      en: [
        "Tension detection against a 14-day personal baseline",
        "Breathing guided by vibration (4-6, box 4-4-4-4, 4-7-8), no need to look at the screen",
        "Watch + Android app + cloud API with a voice and text AI assistant",
      ],
      es: [
        "Detección de tensión contra una línea base personal de 14 días",
        "Respiración guiada por vibración (4-6, caja 4-4-4-4, 4-7-8) sin mirar la pantalla",
        "Reloj + app Android + API en la nube con asistente de IA por voz y texto",
      ],
    },
    tags: ["Garmin · Monkey C", "Kotlin", "Jetpack Compose", "NestJS", "PostgreSQL", "Haptics"],
    githubUrl: "https://github.com/simviz12/smartwatch-frontend",
    demoUrl: "https://github.com/simviz12/smartwatch-frontend",
    video: {
      src: "/videos/pulso.mp4",
      poster: "/videos/posters/pulso.webp",
      duration: 58,
      chapters: [
        { t: 0, label: { en: "Intro", es: "Introducción" } },
        { t: 4, label: { en: "Watch · Everything on your wrist", es: "Reloj · Todo en la muñeca" } },
        { t: 11, label: { en: "Watch · Tension detected", es: "Reloj · Tensión detectada" } },
        { t: 17, label: { en: "Watch · Guided calm", es: "Reloj · Calma guiada" } },
        { t: 24, label: { en: "Phone · Your day", es: "Celular · Tu día" } },
        { t: 32, label: { en: "Phone · History and map", es: "Celular · Historial y mapa" } },
        { t: 39, label: { en: "Phone · AI assistant", es: "Celular · Asistente IA" } },
        { t: 46, label: { en: "How it works", es: "Cómo funciona" } },
        { t: 54, label: { en: "Wrap-up", es: "Cierre" } },
      ],
    },
  },
  {
    slug: "viberoute",
    title: "VibeRoute",
    badge: {
      en: "LOGISTICS • AI OPTIMIZATION",
      es: "LOGÍSTICA • OPTIMIZACIÓN IA",
    },
    subtitle: {
      en: "Intelligent parcel routing with AI optimization",
      es: "Gestión de paquetes y rutas con IA",
    },
    description: {
      en: "Courier logistics platform for package allocation, driver telemetry and AI routing to cut delivery time and cost.",
      es: "Plataforma de logística para asignación de paquetes, telemetría de repartidores y ruteo con IA para reducir tiempos y costos.",
    },
    impactMetrics: {
      en: [
        "AI engine for real-time route optimization",
        "Clean Architecture with Spring Boot & PostgreSQL",
        "Realtime operations dashboard in React",
      ],
      es: [
        "Motor de IA para optimizar rutas en tiempo real",
        "Clean Architecture con Spring Boot y PostgreSQL",
        "Dashboard operativo en React",
      ],
    },
    tags: ["Java", "Spring Boot", "PostgreSQL", "React", "AI"],
    githubUrl: "https://github.com/simviz12/viberoute-frontend",
    demoUrl: "https://github.com/simviz12/viberoute-frontend",
  },
  {
    slug: "juanchopizza",
    title: "JuanchoPizza POS & ERP",
    badge: {
      en: "POS • CLEAN ARCHITECTURE",
      es: "POS • ARQUITECTURA LIMPIA",
    },
    subtitle: {
      en: "Point of sale, inventory, cash audit and management reports",
      es: "Punto de venta, inventario, arqueo de caja y reportes gerenciales",
    },
    description: {
      en: "Full POS/ERP for pizzerias: shift close, raw-material inventory, Nequi/Daviplata cash breakdown, RBAC and PDF reports. Built with SvelteKit 5, Drizzle and Neon PostgreSQL.",
      es: "POS/ERP para pizzerías: cierre de turno, inventario de insumos, desglose Nequi/Daviplata, RBAC y reportes PDF. SvelteKit 5, Drizzle y PostgreSQL (Neon).",
    },
    impactMetrics: {
      en: [
        "Clean Architecture + role-based access (admin, cashier, warehouse)",
        "Audit formula for portions, waste and cash balance semaphore",
        "Sub-200ms loads with batched queries and in-memory session cache",
      ],
      es: [
        "Clean Architecture y roles (jefe, cajero, bodeguero)",
        "Fórmula de auditoría de porciones, merma y semáforo de caja",
        "Cargas < 200 ms con consultas en lote y caché de sesión",
      ],
    },
    tags: ["SvelteKit", "Svelte 5", "TypeScript", "Drizzle", "PostgreSQL", "Tailwind CSS", "Docker"],
    githubUrl: "https://github.com/simviz12/juserr",
    demoUrl: "https://github.com/simviz12/juserr",
  },
  {
    slug: "chef-edwin",
    title: "Chef Edwin",
    badge: {
      en: "AI • MULTIMODAL EDUCATION",
      es: "IA • EDUCACIÓN MULTIMODAL",
    },
    subtitle: {
      en: "Culinary tutoring on WhatsApp with Gemini (text, audio, images)",
      es: "Tutoría culinaria en WhatsApp con Gemini (texto, audio e imágenes)",
    },
    description: {
      en: "Django platform that uses Google Gemini as a culinary tutor over WhatsApp via Twilio. Differentiates teacher/student roles and persists conversation history in PostgreSQL.",
      es: "Plataforma Django que usa Google Gemini como tutor culinario en WhatsApp (Twilio). Diferencia roles profesor/estudiante y guarda el historial en PostgreSQL.",
    },
    impactMetrics: {
      en: [
        "Multimodal Gemini for text, images and audio transcription",
        "Twilio webhook + role-aware system prompts",
        "Deployed with Gunicorn on Render and PostgreSQL",
      ],
      es: [
        "Gemini multimodal para texto, imagen y audio",
        "Webhook Twilio y prompts según rol",
        "Despliegue con Gunicorn en Render y PostgreSQL",
      ],
    },
    tags: ["Python", "Django", "Gemini", "PostgreSQL", "Twilio", "WhatsApp"],
    githubUrl: "https://github.com/simviz12/ChefEdwin",
    demoUrl: "https://github.com/simviz12/ChefEdwin",
  },
  {
    slug: "gym-tienda",
    title: "Gym Tienda",
    badge: {
      en: "E-COMMERCE • WEB",
      es: "E-COMMERCE • WEB",
    },
    subtitle: {
      en: "Gym storefront built with React and Vite",
      es: "Tienda de gimnasio construida con React y Vite",
    },
    description: {
      en: "Frontend store for gym products with a fast React + Vite experience, modern UI and production deployments.",
      es: "Frontend de tienda para productos de gimnasio con React + Vite, UI moderna y despliegues en producción.",
    },
    impactMetrics: {
      en: [
        "SPA with Vite HMR and a lean production build",
        "Component-driven catalog and storefront UX",
        "Live production deployments",
      ],
      es: [
        "SPA con Vite y build liviano de producción",
        "Catálogo por componentes y UX de tienda",
        "Despliegues en producción",
      ],
    },
    tags: ["React", "Vite", "JavaScript", "CSS"],
    githubUrl: "https://github.com/simviz12/gym_tienda",
    demoUrl: "https://github.com/simviz12/gym_tienda",
  },
];

export function formatDuration(seconds: number) {
  const s = Math.max(0, Math.floor(seconds));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}
