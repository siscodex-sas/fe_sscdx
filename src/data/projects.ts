import type { Project } from "@/types";

/**
 * Áreas de especialidad de Siscodex. Deliberadamente genéricas (no casos de
 * cliente con métricas inventadas) hasta que haya suficientes proyectos
 * reales publicables por área — mantener la misma forma de datos para no
 * romper `SpecialtiesTabs`.
 */
export const projects: Project[] = [
  {
    slug: "cloud-infraestructura",
    title: "Cloud & Infraestructura",
    category: "cloud",
    summary:
      "Diseñamos y operamos arquitecturas cloud en AWS, seguras, escalables y optimizadas en costo — con procesamiento batch a gran escala y garantía de calidad y mantenibilidad, listas para crecer con tu negocio.",
    capabilities: [
      "Migración y arquitectura en AWS",
      "Procesamiento batch a gran escala",
      "Alta disponibilidad y DR",
      "Monitoreo y observabilidad 24/7",
      "Optimización de costos de mantenimiento",
    ],
    idealFor: ["Empresas en crecimiento", "Equipos sin infraestructura propia", "Negocios con picos de tráfico"],
  },
  {
    slug: "inteligencia-artificial",
    title: "Inteligencia Artificial",
    category: "ia",
    summary:
      "Integramos IA generativa y modelos de machine learning en productos existentes o nuevos, con foco en casos de uso medibles para el negocio.",
    capabilities: ["Automatización con LLMs", "Agentes y copilotos internos", "Analítica predictiva", "Integración con tus sistemas existentes"],
    idealFor: ["Equipos con procesos manuales repetitivos", "Empresas con grandes volúmenes de datos", "Negocios que buscan automatizar soporte"],
  },
  {
    slug: "aplicaciones-moviles",
    title: "Aplicaciones Móviles",
    category: "mobile",
    summary: "Construimos apps móviles nativas y multiplataforma, desde el diseño hasta la publicación en tiendas.",
    capabilities: ["Apps nativas iOS / Android", "Desarrollo multiplataforma", "Integración con backend existente", "Publicación y mantenimiento en tiendas"],
    idealFor: ["Equipos que trabajan en campo", "Negocios con clientes móviles", "Empresas que necesitan una app propia"],
  },
  {
    slug: "desarrollo-web",
    title: "Desarrollo Web",
    category: "web",
    summary: "Plataformas web robustas y portales a medida, con foco en rendimiento y experiencia de usuario.",
    capabilities: ["Portales y plataformas a medida", "APIs y microservicios", "Integraciones con sistemas existentes", "Rendimiento y SEO técnico"],
    idealFor: ["Empresas que superaron una plantilla genérica", "Negocios con procesos internos complejos", "Equipos que necesitan un portal propio"],
  },
  {
    slug: "salud-digital",
    title: "Salud Digital",
    category: "health",
    summary:
      "Desarrollamos plataformas web y aplicaciones médicas para el sector salud — desde telemedicina hasta gestión de información clínica especializada.",
    capabilities: [
      "Aplicaciones web médicas",
      "Telemedicina y agendamiento",
      "Gestión de información clínica y de laboratorio",
      "Cumplimiento y privacidad de datos",
    ],
    idealFor: ["Clínicas y centros médicos", "Laboratorios y bancos de datos clínicos", "Organizaciones que manejan información médica sensible"],
  },
];
