export interface Project {
  title: string;
  badge: { en: string; es: string };
  subtitle: { en: string; es: string };
  description: { en: string; es: string };
  impactMetrics: { en: string[]; es: string[] };
  tags: string[];
  githubUrl: string;
  demoUrl: string;
}

export const projects: Project[] = [
  {
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
  },
  {
    title: "The Guardian of Kaliche",
    badge: {
      en: "CYBERSECURITY • DESKTOP",
      es: "CIBERSEGURIDAD • DESKTOP",
    },
    subtitle: {
      en: "Kali Linux environment integrated natively on Windows",
      es: "Entorno Kali Linux integrado nativamente en Windows",
    },
    description: {
      en: "Desktop app that orchestrates Kali Linux on Windows via WSL 2, with a modern terminal and Python audit automations.",
      es: "App de escritorio que orquesta Kali Linux en Windows con WSL 2, terminal moderna y automatizaciones de auditoría en Python.",
    },
    impactMetrics: {
      en: [
        "Native WSL 2 integration",
        "Fluid UI with Electron and React",
        "Automated security scanning with Python",
      ],
      es: [
        "Integración nativa con WSL 2",
        "Interfaz fluida con Electron y React",
        "Escaneo automatizado de seguridad con Python",
      ],
    },
    tags: ["Electron", "React", "WSL 2", "Python", "Tailwind CSS"],
    githubUrl: "https://github.com/simviz12/the-guardian-of-kali_frontend",
    demoUrl: "https://github.com/simviz12/the-guardian-of-kali_frontend",
  },
  {
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
    title: "Pulso · Wear OS Haptics",
    badge: {
      en: "WEAR OS • WELLNESS",
      es: "WEAR OS • BIENESTAR",
    },
    subtitle: {
      en: "Gentle haptic engine for stress alerts and guided breathing",
      es: "Motor háptico gentil para alertas de estrés y respiración guiada",
    },
    description: {
      en: "Wear OS haptic specification and implementation: subtle stress pulses, inhale/exhale waveforms with amplitude control, configurable intensity and battery-safe fallbacks.",
      es: "Especificación e implementación háptica en Wear OS: pulsos de estrés sutiles, ondas de inhalación/exhalación, intensidad configurable y fallbacks de batería.",
    },
    impactMetrics: {
      en: [
        "Amplitude-controlled waveforms for inhale, hold and exhale",
        "LOW / MEDIUM / HIGH intensity plus extreme battery saver",
        "Screen-off breathing sessions driven only by vibration",
      ],
      es: [
        "Ondas con control de amplitud para inhalar, retener y exhalar",
        "Intensidad LOW / MEDIUM / HIGH y modo ahorro extremo",
        "Sesiones de respiración con pantalla apagada",
      ],
    },
    tags: ["Wear OS", "Kotlin", "Android", "Haptics"],
    githubUrl: "https://github.com/simviz12/smartwatch-frontend",
    demoUrl: "https://github.com/simviz12/smartwatch-frontend",
  },
  {
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
