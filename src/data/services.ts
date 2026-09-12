import type { Advantage, ProcessStep, Service } from "@/types";

export const services: Service[] = [
  {
    index: "01",
    icon: "code-2",
    title: "Desarrollo de software a medida",
    description:
      "Construimos plataformas robustas desde cero, adaptadas exactamente a tus flujos de negocio. Priorizamos código limpio, pruebas automatizadas y arquitecturas resilientes.",
    bullets: ["Aplicaciones web", "Apps móviles (iOS / Android)", "APIs y microservicios"],
    href: "/servicios#desarrollo-a-medida",
  },
  {
    index: "02",
    icon: "cloud-cog",
    title: "Infraestructura y arquitectura cloud en AWS",
    description:
      "Diseñamos, implementamos y gestionamos infraestructura segura en AWS, incluyendo procesamiento batch a gran escala. Garantizamos calidad, mantenibilidad y eficiencia, reduciendo los costos de mantenimiento sin sacrificar disponibilidad ni rendimiento.",
    bullets: ["Arquitectura y migración en AWS", "Procesamiento batch a gran escala", "Pipelines de DevOps y seguridad", "Optimización de costos operativos"],
    href: "/servicios#cloud",
  },
  {
    index: "03",
    icon: "brain-circuit",
    title: "Inteligencia artificial aplicada",
    description:
      "Integramos IA generativa y modelos de machine learning en productos existentes o nuevos, con foco en casos de uso medibles para el negocio.",
    bullets: ["Automatización con LLMs", "Agentes y copilotos internos", "Analítica predictiva"],
    href: "/servicios#ia",
  },
  {
    index: "04",
    icon: "layers",
    title: "Modernización de plataformas",
    description:
      "Tomamos sistemas legados, los refactorizamos y preparamos para escalar. Resolvemos cuellos de botella técnicos sin detener el negocio.",
    bullets: ["De monolito a microservicios", "Optimización de rendimiento", "Tuning de bases de datos"],
    href: "/servicios#modernizacion",
  },
  {
    index: "05",
    icon: "shield-check",
    title: "Sistemas empresariales",
    description:
      "Desarrollamos sistemas internos, ERPs y herramientas de gestión a medida que se integran con tu operación existente.",
    bullets: ["Integraciones con terceros", "Portales internos", "Automatización de procesos"],
    href: "/servicios#sistemas-empresariales",
  },
  {
    index: "06",
    icon: "users-round",
    title: "Staff augmentation",
    description:
      "Integramos ingenieros senior directamente en tu equipo, con la misma exigencia técnica que aplicamos en nuestros propios proyectos.",
    bullets: ["Equipos dedicados", "Onboarding rápido", "Reportes de avance semanales"],
    href: "/servicios#staff-augmentation",
  },
];

export const advantages: Advantage[] = [
  {
    icon: "handshake",
    title: "Trato directo",
    description: "Hablas directamente con quienes construyen tu software, sin intermediarios que diluyan el mensaje.",
  },
  {
    icon: "cloud",
    title: "Infraestructura AWS",
    description: "Expertos en la nube e infraestructura AWS: arquitecturas eficientes y seguras, con procesamiento batch a gran escala.",
  },
  {
    icon: "trending-up",
    title: "Escalabilidad real",
    description: "Aplicaciones listas para crecer con tu negocio, diseñadas desde el día uno para manejar volumen.",
  },
  {
    icon: "badge-check",
    title: "Calidad y mantenibilidad",
    description: "Ingenieros senior en cada línea de código: garantizamos calidad, mantenibilidad y buenas prácticas por defecto.",
  },
  {
    icon: "piggy-bank",
    title: "Ahorro de costos",
    description: "Optimizamos infraestructura y arquitectura para reducir los costos de mantenimiento de tu aplicación sin sacrificar rendimiento.",
  },
  {
    icon: "shield-check",
    title: "Seguridad garantizada",
    description: "Aplicamos buenas prácticas de seguridad en cada capa: desde la infraestructura cloud hasta el código de tu aplicación.",
  },
];

export const processSteps: ProcessStep[] = [
  {
    number: "01",
    title: "Descubrimiento",
    description: "Entendemos a fondo tu negocio y tus objetivos antes de proponer cualquier solución.",
  },
  {
    number: "02",
    title: "Planeación",
    description: "Definimos el plan de trabajo, el alcance y las herramientas adecuadas para tu presupuesto y tus tiempos.",
  },
  {
    number: "03",
    title: "Desarrollo",
    description: "Construimos por etapas, con entregas frecuentes que puedes revisar y ajustar en el camino.",
  },
  {
    number: "04",
    title: "Lanzamiento",
    description: "Puesta en marcha segura, con acompañamiento activo desde el primer día.",
  },
];

export const processCapabilities: Advantage[] = [
  {
    icon: "search-check",
    title: "Análisis a fondo",
    description: "Entendemos tu negocio antes de proponer una solución, para que el alcance sea real desde el primer día.",
  },
  {
    icon: "trending-up",
    title: "Avances visibles",
    description: "Ves resultados concretos en cada etapa del proyecto, con avances que puedes revisar en el camino.",
  },
  {
    icon: "bar-chart-3",
    title: "Seguimiento y control",
    description: "Reportes claros de avance y visibilidad total sobre tiempos y presupuesto en cada etapa.",
  },
  {
    icon: "users",
    title: "Equipo dedicado",
    description: "Un equipo dedicado por completo a tu proyecto, con atención directa y constante.",
  },
];
