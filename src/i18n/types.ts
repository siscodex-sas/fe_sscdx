export type Locale = "es" | "en";

export const LOCALES: Locale[] = ["es", "en"];
export const DEFAULT_LOCALE: Locale = "es";

/** Estructura genérica para un campo de texto traducible en los archivos de `src/data/`. */
export type Localized<T = string> = Record<Locale, T>;
