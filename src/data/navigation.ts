import type { NavLink } from "@/types";

/** Accesos directos a secciones del home (scroll a ancla, no páginas propias). */
export const mainNavAnchors: NavLink[] = [
  { label: "Inicio", href: "/#top" },
  { label: "Servicios", href: "/#servicios" },
  { label: "Soluciones", href: "/#soluciones" },
];

/** Páginas independientes con ruta propia. */
export const mainNavPages: NavLink[] = [
  { label: "Recursos", href: "/recursos" },
  { label: "Tecnología", href: "/tecnologia" },
  { label: "Nosotros", href: "/nosotros" },
];

export const footerLinks: { title: string; links: NavLink[] }[] = [
  {
    title: "Empresa",
    links: [
      { label: "Servicios", href: "/#servicios" },
      { label: "Soluciones", href: "/#soluciones" },
      { label: "Nosotros", href: "/nosotros" },
      { label: "Contacto", href: "/contacto" },
    ],
  },
  {
    title: "Ingeniería",
    links: [
      { label: "Stack tecnológico", href: "/tecnologia" },
      { label: "Recursos y documentación", href: "/recursos" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Política de privacidad", href: "/legal/privacidad" },
      { label: "Términos de servicio", href: "/legal/terminos" },
    ],
  },
];
