/**
 * Google Analytics 4 condicionado al consentimiento de cookies (ver
 * CookieConsent.astro y CLAUDE.md punto 28).
 *
 * gtag.js NO se carga hasta que el visitante acepta en el banner — ni siquiera
 * en modo "sin cookies": sin consentimiento no sale ninguna petición a Google.
 * Si después lo revoca desde "Preferencias de cookies", se desactiva el envío
 * (`ga-disable-<ID>`) y se borran las cookies `_ga*` ya creadas.
 *
 * La elección vive en localStorage (no en una cookie: no hace falta mandarla al
 * servidor) y vence a los 12 meses, para volver a preguntar periódicamente.
 */

export type ConsentStatus = "granted" | "denied";

const STORAGE_KEY = "siscodex:cookie-consent";
const CONSENT_MAX_AGE_MS = 365 * 24 * 60 * 60 * 1000;

const measurementId: string = import.meta.env.PUBLIC_GA_MEASUREMENT_ID ?? "";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export function isAnalyticsConfigured(): boolean {
  return measurementId !== "";
}

/** La elección guardada, o null si nunca eligió / venció / no hay localStorage. */
export function getConsent(): ConsentStatus | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const { status, at } = JSON.parse(raw) as { status?: unknown; at?: unknown };
    if (status !== "granted" && status !== "denied") return null;
    if (typeof at !== "number" || Date.now() - at > CONSENT_MAX_AGE_MS) return null;
    return status;
  } catch {
    return null;
  }
}

export function setConsent(status: ConsentStatus): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ status, at: Date.now() }));
  } catch {
    // Sin localStorage (modo privado, etc.) la elección aplica solo a esta
    // página; en la siguiente carga se vuelve a preguntar.
  }
  if (status === "granted") enableAnalytics();
  else disableAnalytics();
}

let loaded = false;

function enableAnalytics(): void {
  if (!measurementId) return;
  (window as unknown as Record<string, unknown>)[`ga-disable-${measurementId}`] = false;
  if (loaded) return;
  loaded = true;

  window.dataLayer = window.dataLayer || [];
  // gtag.js espera el objeto `arguments` tal cual, no un array — por eso es
  // una function clásica y no una arrow function con rest params.
  window.gtag = function gtag() {
    window.dataLayer!.push(arguments);
  };
  window.gtag("js", new Date());
  // send_page_view: false — con <ClientRouter /> las navegaciones no recargan
  // la página; el page_view se manda a mano en cada astro:page-load (abajo).
  window.gtag("config", measurementId, { send_page_view: false });

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
  document.head.appendChild(script);
}

function disableAnalytics(): void {
  if (!measurementId) return;
  (window as unknown as Record<string, unknown>)[`ga-disable-${measurementId}`] = true;

  // GA crea _ga y _ga_<ID> en el dominio raíz (.siscodex.com); se prueban las
  // variantes de dominio porque una cookie solo se borra con el mismo domain.
  const host = location.hostname;
  const rootDomain = host.split(".").slice(-2).join(".");
  const domains = ["", host, `.${host}`, `.${rootDomain}`];
  document.cookie
    .split(";")
    .map((cookie) => cookie.split("=")[0]?.trim() ?? "")
    .filter((name) => name.startsWith("_ga"))
    .forEach((name) => {
      domains.forEach((domain) => {
        document.cookie = `${name}=; Max-Age=0; path=/${domain ? `; domain=${domain}` : ""}`;
      });
    });
}

export function trackPageView(): void {
  if (!loaded || getConsent() !== "granted") return;
  window.gtag?.("event", "page_view", {
    page_location: location.href,
    page_path: location.pathname + location.search,
    page_title: document.title,
  });
}

/** Se llama una sola vez (script empaquetado de BaseLayout). */
export function initAnalytics(): void {
  if (!measurementId) return;
  if (getConsent() === "granted") enableAnalytics();
  // astro:page-load cubre la carga inicial y cada navegación con View
  // Transitions. Si el visitante acepta a mitad de una página, CookieConsent
  // manda el page_view de esa página al aceptar.
  document.addEventListener("astro:page-load", trackPageView);
}
