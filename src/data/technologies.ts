import type { Resource, Technology } from "@/types";
import type { Locale, Localized } from "@/i18n/types";

/** Nombres de tecnología: nombres propios, no se traducen entre idiomas. */
export const technologies: Technology[] = [
  { name: "TypeScript", icon: "logos:typescript-icon", category: "frontend" },
  { name: "React", icon: "logos:react", category: "frontend" },
  { name: "Astro", icon: "logos:astro-icon", category: "frontend" },
  { name: "Next.js", icon: "logos:nextjs-icon", category: "frontend" },
  { name: "Angular", icon: "logos:angular-icon", category: "frontend" },
  { name: "Node.js", icon: "logos:nodejs-icon", category: "backend" },
  { name: "Java", icon: "logos:java", category: "backend" },
  { name: "Python", icon: "logos:python", category: "backend" },
  { name: "PostgreSQL", icon: "logos:postgresql", category: "backend" },
  { name: "GraphQL", icon: "logos:graphql", category: "backend" },
  { name: "AWS", icon: "logos:aws", category: "cloud" },
  { name: "AWS Lambda", icon: "logos:aws-lambda", category: "cloud" },
  { name: "Amazon S3", icon: "logos:aws-s3", category: "cloud" },
  { name: "API Gateway", icon: "logos:aws-api-gateway", category: "cloud" },
  { name: "CloudFront", icon: "logos:aws-cloudfront", category: "cloud" },
  { name: "DynamoDB", icon: "logos:aws-dynamodb", category: "cloud" },
  { name: "AWS Batch", icon: "logos:aws-batch", category: "cloud" },
  { name: "Docker", icon: "logos:docker-icon", category: "devops" },
  { name: "Kubernetes", icon: "logos:kubernetes", category: "devops" },
  { name: "GitHub Actions", icon: "logos:github-actions", category: "devops" },
  { name: "Terraform", icon: "logos:terraform-icon", category: "devops" },
  { name: "Redis", icon: "logos:redis", category: "backend" },
  { name: "Swift", icon: "logos:swift", category: "mobile" },
  { name: "Kotlin", icon: "logos:kotlin-icon", category: "mobile" },
  { name: "Flutter", icon: "logos:flutter", category: "mobile" },
  { name: "VTK", icon: "lucide:box", category: "3d" },
];

interface ResourceSource {
  title: Localized;
  description: Localized;
  icon: string;
  href: string;
  tag: Localized;
}

const resourcesSource: ResourceSource[] = [
  {
    title: { es: "Guía de onboarding para clientes", en: "Client onboarding guide" },
    description: {
      es: "Cómo trabajamos, canales de comunicación y qué esperar en las primeras semanas del proyecto.",
      en: "How we work, communication channels, and what to expect in the first weeks of the project.",
    },
    icon: "book-open",
    href: "/recursos/onboarding",
    tag: { es: "Guía", en: "Guide" },
  },
  {
    title: { es: "Documentación de API y entregables", en: "API documentation and deliverables" },
    description: {
      es: "Acceso a la documentación técnica de proyectos activos para equipos de clientes.",
      en: "Access to technical documentation for active projects, for client teams.",
    },
    icon: "file-text",
    href: "/recursos/documentacion",
    tag: { es: "Documentación", en: "Documentation" },
  },
  {
    title: { es: "SLA y soporte post-lanzamiento", en: "SLA and post-launch support" },
    description: {
      es: "Niveles de servicio, tiempos de respuesta y canales de soporte una vez el proyecto está en producción.",
      en: "Service levels, response times and support channels once the project is in production.",
    },
    icon: "life-buoy",
    href: "/recursos/soporte",
    tag: { es: "Soporte", en: "Support" },
  },
  {
    title: { es: "Buenas prácticas de seguridad", en: "Security best practices" },
    description: {
      es: "Lineamientos que seguimos en cada proyecto: gestión de secretos, revisión de código y auditorías.",
      en: "Guidelines we follow on every project: secrets management, code review and audits.",
    },
    icon: "shield-check",
    href: "/recursos/seguridad",
    tag: { es: "Seguridad", en: "Security" },
  },
];

export function getResources(locale: Locale): Resource[] {
  return resourcesSource.map((r) => ({
    title: r.title[locale],
    description: r.description[locale],
    icon: r.icon,
    href: r.href,
    tag: r.tag[locale],
  }));
}
