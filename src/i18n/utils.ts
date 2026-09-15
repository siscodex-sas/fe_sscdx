import { SITE_URL } from "@/utils/seo";
import { DEFAULT_LOCALE, type Locale } from "./types";
import { ui, type UIKey } from "./ui";

/** `const t = useTranslations(locale)` en el frontmatter de cualquier `.astro`, luego `{t("clave")}`. */
export function useTranslations(locale: Locale) {
  return function t(key: UIKey): string {
    return ui[locale][key] ?? ui[DEFAULT_LOCALE][key];
  };
}

/**
 * Quita el prefijo `/en` de una ruta si lo tiene, dejando la ruta canónica
 * en español (sin prefijo de idioma) — idempotente: da igual si `path` ya
 * viene canónico o con prefijo.
 */
function toCanonicalPath(path: string): string {
  if (path === "/en") return "/";
  if (path.startsWith("/en/")) return path.slice(3);
  return path;
}

/**
 * Antepone el prefijo de idioma correspondiente a una ruta interna
 * raíz-relativa. El español es el idioma por defecto y no lleva prefijo.
 * No toca rutas externas (http(s):, mailto:, protocolo-relativas "//") ni
 * valores que no empiecen con "/" — mismo criterio que `withBase()`
 * (`src/utils/url.ts`), con la que se compone: `withBase(localizedHref(path, locale))`.
 */
export function localizedHref(path: string, locale: Locale): string {
  if (!path.startsWith("/") || path.startsWith("//")) return path;
  const canonical = toCanonicalPath(path);
  if (locale === "es") return canonical;
  return canonical === "/" ? "/en" : `/en${canonical}`;
}

/** URLs absolutas (dominio real, sin `base`) de la misma página en cada idioma — para hreflang y el selector de idioma. */
export function alternateUrls(currentPath: string): Record<Locale, string> {
  const canonical = toCanonicalPath(currentPath);
  const normalized = canonical === "/" ? "" : canonical.replace(/\/$/, "");
  return {
    es: `${SITE_URL}${normalized}`,
    en: `${SITE_URL}/en${normalized}`,
  };
}
