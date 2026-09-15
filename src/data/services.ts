import type { Advantage, ProcessStep, Service } from "@/types";
import type { Locale, Localized } from "@/i18n/types";

interface ServiceSource {
  index: string;
  icon: string;
  title: Localized;
  description: Localized;
  bullets: Localized<string[]>;
}

const servicesSource: ServiceSource[] = [
  {
    index: "01",
    icon: "code-2",
    title: { es: "Desarrollo de software a medida", en: "Custom software development" },
    description: {
      es: "Construimos plataformas robustas desde cero, adaptadas exactamente a tus flujos de negocio. Priorizamos código limpio, pruebas automatizadas y arquitecturas resilientes.",
      en: "We build robust platforms from the ground up, tailored exactly to your business workflows. We prioritize clean code, automated testing and resilient architectures.",
    },
    bullets: {
      es: ["Aplicaciones web", "Apps móviles (iOS / Android)", "APIs y microservicios"],
      en: ["Web applications", "Mobile apps (iOS / Android)", "APIs and microservices"],
    },
  },
  {
    index: "02",
    icon: "cloud-cog",
    title: { es: "Infraestructura y arquitectura cloud en AWS", en: "Cloud infrastructure and architecture on AWS" },
    description: {
      es: "Diseñamos, implementamos y gestionamos infraestructura segura en AWS, incluyendo procesamiento batch a gran escala. Garantizamos calidad, mantenibilidad y eficiencia, reduciendo los costos de mantenimiento sin sacrificar disponibilidad ni rendimiento.",
      en: "We design, implement and manage secure infrastructure on AWS, including large-scale batch processing. We guarantee quality, maintainability and efficiency, reducing maintenance costs without sacrificing availability or performance.",
    },
    bullets: {
      es: ["Arquitectura y migración en AWS", "Procesamiento batch a gran escala", "Pipelines de DevOps y seguridad", "Optimización de costos operativos"],
      en: ["AWS architecture and migration", "Large-scale batch processing", "DevOps and security pipelines", "Operational cost optimization"],
    },
  },
  {
    index: "03",
    icon: "brain-circuit",
    title: { es: "Inteligencia artificial aplicada", en: "Applied artificial intelligence" },
    description: {
      es: "Integramos IA generativa y modelos de machine learning en productos existentes o nuevos, con foco en casos de uso medibles para el negocio.",
      en: "We integrate generative AI and machine learning models into existing or new products, focused on measurable business use cases.",
    },
    bullets: {
      es: ["Automatización con LLMs", "Agentes y copilotos internos", "Analítica predictiva"],
      en: ["Automation with LLMs", "Internal agents and copilots", "Predictive analytics"],
    },
  },
  {
    index: "04",
    icon: "layers",
    title: { es: "Modernización de plataformas", en: "Platform modernization" },
    description: {
      es: "Tomamos sistemas legados, los refactorizamos y preparamos para escalar. Resolvemos cuellos de botella técnicos sin detener el negocio.",
      en: "We take legacy systems, refactor them and prepare them to scale. We resolve technical bottlenecks without stopping the business.",
    },
    bullets: {
      es: ["De monolito a microservicios", "Optimización de rendimiento", "Tuning de bases de datos"],
      en: ["From monolith to microservices", "Performance optimization", "Database tuning"],
    },
  },
  {
    index: "05",
    icon: "shield-check",
    title: { es: "Sistemas empresariales", en: "Enterprise systems" },
    description: {
      es: "Desarrollamos sistemas internos, ERPs y herramientas de gestión a medida que se integran con tu operación existente.",
      en: "We develop internal systems, ERPs and custom management tools that integrate with your existing operation.",
    },
    bullets: {
      es: ["Integraciones con terceros", "Portales internos", "Automatización de procesos"],
      en: ["Third-party integrations", "Internal portals", "Process automation"],
    },
  },
  {
    index: "06",
    icon: "users-round",
    title: { es: "Staff augmentation", en: "Staff augmentation" },
    description: {
      es: "Integramos ingenieros senior directamente en tu equipo, con la misma exigencia técnica que aplicamos en nuestros propios proyectos.",
      en: "We embed senior engineers directly into your team, with the same technical rigor we apply to our own projects.",
    },
    bullets: {
      es: ["Equipos dedicados", "Onboarding rápido", "Reportes de avance semanales"],
      en: ["Dedicated teams", "Fast onboarding", "Weekly progress reports"],
    },
  },
];

interface AdvantageSource {
  icon: string;
  title: Localized;
  description: Localized;
}

const advantagesSource: AdvantageSource[] = [
  {
    icon: "handshake",
    title: { es: "Trato directo", en: "Direct dealings" },
    description: {
      es: "Hablas directamente con quienes construyen tu software, sin intermediarios que diluyan el mensaje.",
      en: "You talk directly to the people building your software, with no middlemen diluting the message.",
    },
  },
  {
    icon: "cloud",
    title: { es: "Infraestructura AWS", en: "AWS infrastructure" },
    description: {
      es: "Expertos en la nube e infraestructura AWS: arquitecturas eficientes y seguras, con procesamiento batch a gran escala.",
      en: "AWS cloud and infrastructure experts: efficient, secure architectures with large-scale batch processing.",
    },
  },
  {
    icon: "trending-up",
    title: { es: "Escalabilidad real", en: "Real scalability" },
    description: {
      es: "Aplicaciones listas para crecer con tu negocio, diseñadas desde el día uno para manejar volumen.",
      en: "Applications ready to grow with your business, designed from day one to handle volume.",
    },
  },
  {
    icon: "badge-check",
    title: { es: "Calidad y mantenibilidad", en: "Quality and maintainability" },
    description: {
      es: "Ingenieros senior en cada línea de código: garantizamos calidad, mantenibilidad y buenas prácticas por defecto.",
      en: "Senior engineers on every line of code: we guarantee quality, maintainability and best practices by default.",
    },
  },
  {
    icon: "piggy-bank",
    title: { es: "Ahorro de costos", en: "Cost savings" },
    description: {
      es: "Optimizamos infraestructura y arquitectura para reducir los costos de mantenimiento de tu aplicación sin sacrificar rendimiento.",
      en: "We optimize infrastructure and architecture to reduce your application's maintenance costs without sacrificing performance.",
    },
  },
  {
    icon: "shield-check",
    title: { es: "Seguridad garantizada", en: "Guaranteed security" },
    description: {
      es: "Aplicamos buenas prácticas de seguridad en cada capa: desde la infraestructura cloud hasta el código de tu aplicación.",
      en: "We apply security best practices at every layer: from cloud infrastructure to your application's code.",
    },
  },
];

interface ProcessStepSource {
  number: string;
  title: Localized;
  description: Localized;
}

const processStepsSource: ProcessStepSource[] = [
  {
    number: "01",
    title: { es: "Descubrimiento", en: "Discovery" },
    description: {
      es: "Entendemos a fondo tu negocio y tus objetivos antes de proponer cualquier solución.",
      en: "We thoroughly understand your business and goals before proposing any solution.",
    },
  },
  {
    number: "02",
    title: { es: "Planeación", en: "Planning" },
    description: {
      es: "Definimos el plan de trabajo, el alcance y las herramientas adecuadas para tu presupuesto y tus tiempos.",
      en: "We define the work plan, scope and the right tools for your budget and timeline.",
    },
  },
  {
    number: "03",
    title: { es: "Desarrollo", en: "Development" },
    description: {
      es: "Construimos por etapas, con entregas frecuentes que puedes revisar y ajustar en el camino.",
      en: "We build in stages, with frequent deliveries you can review and adjust along the way.",
    },
  },
  {
    number: "04",
    title: { es: "Lanzamiento", en: "Launch" },
    description: {
      es: "Puesta en marcha segura, con acompañamiento activo desde el primer día.",
      en: "A secure go-live, with active support from day one.",
    },
  },
];

const processCapabilitiesSource: AdvantageSource[] = [
  {
    icon: "search-check",
    title: { es: "Análisis a fondo", en: "In-depth analysis" },
    description: {
      es: "Entendemos tu negocio antes de proponer una solución, para que el alcance sea real desde el primer día.",
      en: "We understand your business before proposing a solution, so the scope is realistic from day one.",
    },
  },
  {
    icon: "trending-up",
    title: { es: "Avances visibles", en: "Visible progress" },
    description: {
      es: "Ves resultados concretos en cada etapa del proyecto, con avances que puedes revisar en el camino.",
      en: "You see concrete results at every stage of the project, with progress you can review along the way.",
    },
  },
  {
    icon: "bar-chart-3",
    title: { es: "Seguimiento y control", en: "Tracking and control" },
    description: {
      es: "Reportes claros de avance y visibilidad total sobre tiempos y presupuesto en cada etapa.",
      en: "Clear progress reports and full visibility into timeline and budget at every stage.",
    },
  },
  {
    icon: "users",
    title: { es: "Equipo dedicado", en: "Dedicated team" },
    description: {
      es: "Un equipo dedicado por completo a tu proyecto, con atención directa y constante.",
      en: "A team fully dedicated to your project, with direct and constant attention.",
    },
  },
];

export function getServices(locale: Locale): Service[] {
  return servicesSource.map((s) => ({
    index: s.index,
    icon: s.icon,
    title: s.title[locale],
    description: s.description[locale],
    bullets: s.bullets[locale],
  }));
}

export function getAdvantages(locale: Locale): Advantage[] {
  return advantagesSource.map((a) => ({ icon: a.icon, title: a.title[locale], description: a.description[locale] }));
}

export function getProcessSteps(locale: Locale): ProcessStep[] {
  return processStepsSource.map((s) => ({ number: s.number, title: s.title[locale], description: s.description[locale] }));
}

export function getProcessCapabilities(locale: Locale): Advantage[] {
  return processCapabilitiesSource.map((a) => ({ icon: a.icon, title: a.title[locale], description: a.description[locale] }));
}
