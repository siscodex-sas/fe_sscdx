export type Theme = "dark" | "light";

const STORAGE_KEY = "siscodex:theme";
const DEFAULT_THEME: Theme = "dark";

export function getStoredTheme(): Theme {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored === "light" || stored === "dark" ? stored : DEFAULT_THEME;
  } catch {
    return DEFAULT_THEME;
  }
}

export function setStoredTheme(theme: Theme): void {
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // localStorage no disponible (modo privado, cuotas, etc.) — el tema
    // sigue funcionando en esta pestaña, solo no persiste entre visitas.
  }
}

// `<meta name="theme-color">` no puede leer variables CSS — es una de las
// tres excepciones ya documentadas en CLAUDE.md ("Regla de oro") que hay
// que tocar a mano si cambia la paleta. Debe coincidir con `--color-ink-950`
// de cada tema en global.css.
const THEME_COLOR: Record<Theme, string> = { dark: "#1a1b1e", light: "#f7f4ee" };

export function applyTheme(theme: Theme): void {
  document.documentElement.setAttribute("data-theme", theme);
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", THEME_COLOR[theme]);
}

/**
 * El oscuro es el tema por defecto del sitio (decisión de marca, ver
 * CLAUDE.md). El atributo `data-theme` que rige el CSS solo vive en el
 * cliente — nada lo server-renderiza — así que hay que reaplicarlo en
 * cada navegación con View Transitions, porque `swapRootAttributes()`
 * reemplaza los atributos de `<html>` por los de la página nueva (que no
 * trae ninguno) y lo borraría. Se engancha en `astro:before-swap` y se
 * envuelve el `swap()` por defecto para que quede aplicado *antes* de que
 * la View Transition tome la "foto" de la página nueva — si se hiciera
 * después (`astro:after-swap`) se alcanza a ver un parpadeo del tema
 * equivocado durante el crossfade (mismo problema, y misma solución, que
 * el scroll del selector de idioma en LanguageSwitcher.astro).
 */
export function initThemePersistence(): void {
  document.addEventListener("astro:before-swap", (event) => {
    const defaultSwap = event.swap;
    const theme = getStoredTheme();
    event.swap = () => {
      defaultSwap();
      applyTheme(theme);
    };
  });
}
