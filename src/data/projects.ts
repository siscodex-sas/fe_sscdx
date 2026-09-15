import type { Project, ProjectCategory } from "@/types";
import type { Locale, Localized } from "@/i18n/types";

/**
 * Áreas de especialidad de Siscodex. Deliberadamente genéricas (no casos de
 * cliente con métricas inventadas) hasta que haya suficientes proyectos
 * reales publicables por área — mantener la misma forma de datos para no
 * romper `SpecialtiesTabs`.
 */
interface ProjectSource {
  slug: string;
  title: Localized;
  category: ProjectCategory;
  summary: Localized;
  capabilities: Localized<string[]>;
  idealFor: Localized<string[]>;
}

const projectsSource: ProjectSource[] = [
  {
    slug: "cloud-infraestructura",
    title: { es: "Cloud & Infraestructura", en: "Cloud & Infrastructure" },
    category: "cloud",
    summary: {
      es: "Diseñamos y operamos arquitecturas cloud en AWS, seguras, escalables y optimizadas en costo — con procesamiento batch a gran escala y garantía de calidad y mantenibilidad, listas para crecer con tu negocio.",
      en: "We design and operate secure, scalable, cost-optimized cloud architectures on AWS — with large-scale batch processing and a commitment to quality and maintainability, ready to grow with your business.",
    },
    capabilities: {
      es: ["Migración y arquitectura en AWS", "Procesamiento batch a gran escala", "Alta disponibilidad y DR", "Monitoreo y observabilidad 24/7", "Optimización de costos de mantenimiento"],
      en: ["AWS architecture and migration", "Large-scale batch processing", "High availability and DR", "24/7 monitoring and observability", "Maintenance cost optimization"],
    },
    idealFor: {
      es: ["Empresas en crecimiento", "Equipos sin infraestructura propia", "Negocios con picos de tráfico"],
      en: ["Growing companies", "Teams without their own infrastructure", "Businesses with traffic spikes"],
    },
  },
  {
    slug: "inteligencia-artificial",
    title: { es: "Inteligencia Artificial", en: "Artificial Intelligence" },
    category: "ia",
    summary: {
      es: "Integramos IA generativa y modelos de machine learning en productos existentes o nuevos, con foco en casos de uso medibles para el negocio.",
      en: "We integrate generative AI and machine learning models into existing or new products, focused on measurable business use cases.",
    },
    capabilities: {
      es: ["Automatización con LLMs", "Agentes y copilotos internos", "Analítica predictiva", "Integración con tus sistemas existentes"],
      en: ["Automation with LLMs", "Internal agents and copilots", "Predictive analytics", "Integration with your existing systems"],
    },
    idealFor: {
      es: ["Equipos con procesos manuales repetitivos", "Empresas con grandes volúmenes de datos", "Negocios que buscan automatizar soporte"],
      en: ["Teams with repetitive manual processes", "Companies with large volumes of data", "Businesses looking to automate support"],
    },
  },
  {
    slug: "aplicaciones-moviles",
    title: { es: "Aplicaciones Móviles", en: "Mobile Applications" },
    category: "mobile",
    summary: {
      es: "Construimos apps móviles nativas y multiplataforma, desde el diseño hasta la publicación en tiendas.",
      en: "We build native and cross-platform mobile apps, from design through store publication.",
    },
    capabilities: {
      es: ["Apps nativas iOS / Android", "Desarrollo multiplataforma", "Integración con backend existente", "Publicación y mantenimiento en tiendas"],
      en: ["Native iOS / Android apps", "Cross-platform development", "Integration with existing backends", "Store publication and maintenance"],
    },
    idealFor: {
      es: ["Equipos que trabajan en campo", "Negocios con clientes móviles", "Empresas que necesitan una app propia"],
      en: ["Field teams", "Businesses with mobile customers", "Companies that need their own app"],
    },
  },
  {
    slug: "desarrollo-web",
    title: { es: "Desarrollo Web", en: "Web Development" },
    category: "web",
    summary: {
      es: "Plataformas web robustas y portales a medida, con foco en rendimiento y experiencia de usuario.",
      en: "Robust web platforms and custom portals, focused on performance and user experience.",
    },
    capabilities: {
      es: ["Portales y plataformas a medida", "APIs y microservicios", "Integraciones con sistemas existentes", "Rendimiento y SEO técnico"],
      en: ["Custom portals and platforms", "APIs and microservices", "Integrations with existing systems", "Performance and technical SEO"],
    },
    idealFor: {
      es: ["Empresas que superaron una plantilla genérica", "Negocios con procesos internos complejos", "Equipos que necesitan un portal propio"],
      en: ["Companies that have outgrown a generic template", "Businesses with complex internal processes", "Teams that need their own portal"],
    },
  },
  {
    slug: "salud-digital",
    title: { es: "Salud Digital", en: "Digital Health" },
    category: "health",
    summary: {
      es: "Desarrollamos plataformas web y aplicaciones médicas para el sector salud — desde telemedicina hasta gestión de información clínica especializada.",
      en: "We develop web platforms and medical applications for the healthcare sector — from telemedicine to specialized clinical information management.",
    },
    capabilities: {
      es: ["Aplicaciones web médicas", "Telemedicina y agendamiento", "Gestión de información clínica y de laboratorio", "Cumplimiento y privacidad de datos"],
      en: ["Medical web applications", "Telemedicine and scheduling", "Clinical and lab information management", "Data compliance and privacy"],
    },
    idealFor: {
      es: ["Clínicas y centros médicos", "Laboratorios y bancos de datos clínicos", "Organizaciones que manejan información médica sensible"],
      en: ["Clinics and medical centers", "Labs and clinical data banks", "Organizations that handle sensitive medical information"],
    },
  },
];

export function getProjects(locale: Locale): Project[] {
  return projectsSource.map((p) => ({
    slug: p.slug,
    title: p.title[locale],
    category: p.category,
    summary: p.summary[locale],
    capabilities: p.capabilities[locale],
    idealFor: p.idealFor[locale],
  }));
}
