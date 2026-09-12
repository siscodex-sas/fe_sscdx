/** Nombre de icono de la colección Lucide (sin prefijo), p.ej. "cloud" o "shield-check". */
export type IconName = string;

/** Nombre de icono completo con colección (Iconify), p.ej. "logos:react" o "lucide:database-zap". */
export type IconifyIconName = string;

export interface NavLink {
  label: string;
  href: string;
}

export interface Service {
  index: string;
  icon: IconName;
  title: string;
  description: string;
  bullets: string[];
  href: string;
}

export interface Advantage {
  icon: IconName;
  title: string;
  description: string;
}

export interface ProcessStep {
  number: string;
  title: string;
  description: string;
}

export type ProjectCategory = "web" | "cloud" | "ia" | "mobile" | "health";

/** Área de especialidad mostrada en Soluciones — genérica, no un caso de cliente puntual. */
export interface Project {
  slug: string;
  title: string;
  category: ProjectCategory;
  summary: string;
  capabilities: string[];
  /** Tipos de organización a los que le sirve esta especialidad — no un stack técnico. */
  idealFor: string[];
}

export type TechCategory =
  | "frontend"
  | "backend"
  | "cloud"
  | "mobile"
  | "3d"
  | "devops";

export interface Technology {
  name: string;
  icon: IconifyIconName;
  category: TechCategory;
}

export interface TeamMember {
  name: string;
  role: string;
  headline: string;
  summary: string;
  highlights: string[];
  photo: string;
  linkedin: string;
  website?: string;
}

export interface Resource {
  title: string;
  description: string;
  icon: IconName;
  href: string;
  tag: string;
}

export interface SEOProps {
  title: string;
  description: string;
  path: string;
  image?: string;
  noindex?: boolean;
}
