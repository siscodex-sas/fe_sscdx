import type { TeamMember } from "@/types";
import type { Locale, Localized } from "@/i18n/types";

interface TeamMemberSource {
  name: string;
  role: string;
  roleFull: Localized;
  headline: Localized;
  summary: Localized;
  highlights: Localized<string[]>;
  photo: string;
  linkedin: string;
  website?: string;
}

const teamSource: TeamMemberSource[] = [
  {
    name: "Fherney Silva",
    role: "CEO",
    roleFull: { es: "Chief Executive Officer", en: "Chief Executive Officer" },
    headline: { es: "Estrategia e Innovación Corporativa", en: "Corporate Strategy and Innovation" },
    summary: {
      es: "Visionario tecnológico y líder de negocios que define la estrategia global de la compañía, impulsando el crecimiento mediante IA, Cloud-Native y automatización inteligente.",
      en: "A technology visionary and business leader who defines the company's global strategy, driving growth through AI, cloud-native architecture and intelligent automation.",
    },
    highlights: {
      es: [
        "Arquitecturas de alta disponibilidad (AWS, IaC) alineadas a objetivos de negocio",
        "Gestión de stakeholders y resolución de desafíos críticos",
        "Cultura corporativa de alto rendimiento y desarrollo del talento",
      ],
      en: [
        "High-availability architectures (AWS, IaC) aligned with business goals",
        "Stakeholder management and critical challenge resolution",
        "High-performance corporate culture and talent development",
      ],
    },
    photo: "/team/fherney-silva.jpeg",
    linkedin: "https://www.linkedin.com/in/fherneysilva/",
    website: "https://www.fherneysilva.com/",
  },
  {
    name: "Duban Silva",
    role: "CTO",
    roleFull: { es: "Chief Technology Officer", en: "Chief Technology Officer" },
    headline: { es: "Visión Tecnológica y Arquitectura Cloud", en: "Technology Vision and Cloud Architecture" },
    summary: {
      es: "Líder técnico integral que orquesta la visión tecnológica y la arquitectura empresarial, dirigiendo ecosistemas Cloud escalables, seguros y de vanguardia.",
      en: "A well-rounded technical leader who orchestrates technology vision and enterprise architecture, steering scalable, secure, cutting-edge cloud ecosystems.",
    },
    highlights: {
      es: [
        "Diseño y despliegue de arquitecturas Cloud (AWS, microservicios, Serverless)",
        "Integración de IA y automatización avanzada (AIOps, IaC)",
        "Liderazgo técnico ágil con foco en calidad y resiliencia",
      ],
      en: [
        "Design and deployment of cloud architectures (AWS, microservices, serverless)",
        "AI integration and advanced automation (AIOps, IaC)",
        "Agile technical leadership focused on quality and resilience",
      ],
    },
    photo: "/team/duban-silva.jpeg",
    linkedin: "https://www.linkedin.com/in/duban-yesid-silva-buitrago/",
  },
  {
    name: "Juan Ríos",
    role: "CPO",
    roleFull: { es: "Chief Product Officer", en: "Chief Product Officer" },
    headline: { es: "Estrategia de Producto y Experiencia Digital", en: "Product Strategy and Digital Experience" },
    summary: {
      es: "Estratega de producto con ADN técnico que lidera todo el ciclo de vida del producto, desde el roadmap hasta el lanzamiento, maximizando el valor para el usuario.",
      en: "A product strategist with technical DNA who leads the entire product lifecycle, from roadmap to launch, maximizing value for the user.",
    },
    highlights: {
      es: [
        "Arquitecturas complejas y ecosistemas de datos en banca y FinTech",
        "Productos robustos, automatizados e impulsados por datos",
        "Metodologías ágiles (Scrum, DevOps) para acelerar el time-to-market",
      ],
      en: [
        "Complex architectures and data ecosystems in banking and FinTech",
        "Robust, automated, data-driven products",
        "Agile methodologies (Scrum, DevOps) to accelerate time-to-market",
      ],
    },
    photo: "/team/juan-rios.jpeg",
    linkedin: "https://www.linkedin.com/in/juanriost/",
  },
];

export function getTeam(locale: Locale): TeamMember[] {
  return teamSource.map((m) => ({
    name: m.name,
    role: m.role,
    roleFull: m.roleFull[locale],
    headline: m.headline[locale],
    summary: m.summary[locale],
    highlights: m.highlights[locale],
    photo: m.photo,
    linkedin: m.linkedin,
    website: m.website,
  }));
}
