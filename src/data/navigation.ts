import type { NavLink } from "@/types";
import type { Locale, Localized } from "@/i18n/types";

interface NavLinkSource {
  label: Localized;
  href: string;
}

function resolve(links: NavLinkSource[], locale: Locale): NavLink[] {
  return links.map((link) => ({ label: link.label[locale], href: link.href }));
}

/** Accesos directos a secciones del home (scroll a ancla, no páginas propias). */
const mainNavAnchorsSource: NavLinkSource[] = [
  { label: { es: "Inicio", en: "Home" }, href: "/#top" },
  { label: { es: "Servicios", en: "Services" }, href: "/#servicios" },
  { label: { es: "Soluciones", en: "Solutions" }, href: "/#soluciones" },
];

/** Páginas independientes con ruta propia. */
const mainNavPagesSource: NavLinkSource[] = [
  { label: { es: "Recursos", en: "Resources" }, href: "/recursos" },
  { label: { es: "Tecnología", en: "Technology" }, href: "/tecnologia" },
  { label: { es: "Nosotros", en: "About us" }, href: "/nosotros" },
];

interface FooterGroupSource {
  title: Localized;
  links: NavLinkSource[];
}

const footerLinksSource: FooterGroupSource[] = [
  {
    title: { es: "Empresa", en: "Company" },
    links: [
      { label: { es: "Servicios", en: "Services" }, href: "/#servicios" },
      { label: { es: "Soluciones", en: "Solutions" }, href: "/#soluciones" },
      { label: { es: "Nosotros", en: "About us" }, href: "/nosotros" },
      { label: { es: "Contacto", en: "Contact" }, href: "/contacto" },
    ],
  },
  {
    title: { es: "Ingeniería", en: "Engineering" },
    links: [
      { label: { es: "Stack tecnológico", en: "Tech stack" }, href: "/tecnologia" },
      { label: { es: "Recursos y documentación", en: "Resources & docs" }, href: "/recursos" },
    ],
  },
  {
    title: { es: "Legal", en: "Legal" },
    links: [
      { label: { es: "Política de privacidad", en: "Privacy policy" }, href: "/legal/privacidad" },
      { label: { es: "Términos de servicio", en: "Terms of service" }, href: "/legal/terminos" },
    ],
  },
];

export function getMainNavAnchors(locale: Locale): NavLink[] {
  return resolve(mainNavAnchorsSource, locale);
}

export function getMainNavPages(locale: Locale): NavLink[] {
  return resolve(mainNavPagesSource, locale);
}

export function getFooterLinks(locale: Locale): { title: string; links: NavLink[] }[] {
  return footerLinksSource.map((group) => ({
    title: group.title[locale],
    links: resolve(group.links, locale),
  }));
}
