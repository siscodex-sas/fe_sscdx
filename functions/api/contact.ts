/**
 * POST /api/contact — Cloudflare Pages Function que recibe el formulario de
 * /contacto, lo valida, verifica Turnstile y envía la notificación por Resend.
 *
 * Cloudflare Pages despliega todo lo que haya en `functions/` junto al sitio
 * estático (mismo repo, mismo push a master, mismo dominio): este archivo queda
 * servido en siscodex.com/api/contact. No corre en el navegador — las claves
 * de `env` nunca llegan al cliente.
 *
 * Variables (Cloudflare Pages → Settings → Variables and Secrets; en local, el
 * `.env` de la raíz, que `wrangler pages dev` lee solo):
 *   - RESEND_API_KEY        (secret) API key de Resend.
 *   - TURNSTILE_SECRET_KEY  (secret) clave secreta del widget de Turnstile.
 *   - CONTACT_TO            destinatarios separados por coma.
 *   - CONTACT_FROM          remitente, en un dominio verificado en Resend.
 *
 * Tipos: se declaran a mano (en vez de @cloudflare/workers-types) porque la
 * función solo usa APIs web estándar (Request, Response, fetch, FormData), que
 * ya vienen en el lib DOM del tsconfig de Astro — así `astro check` la cubre
 * sin un tsconfig aparte ni tipos globales que choquen con los de Astro.
 */

import {
  contactNotificationHtml,
  contactNotificationSubject,
  contactNotificationText,
  type ContactSubmission,
} from "../../src/emails/contactNotification";

interface Env {
  RESEND_API_KEY?: string;
  TURNSTILE_SECRET_KEY?: string;
  CONTACT_TO?: string;
  CONTACT_FROM?: string;
}

// Subconjunto de `request.cf` (IncomingRequestCfProperties) que se usa acá —
// Cloudflare lo agrega a cada petición con la geolocalización de la IP.
interface CfGeo {
  city?: string;
  region?: string;
  country?: string;
}

interface PagesContext {
  request: Request & { cf?: CfGeo };
  env: Env;
}

type ErrorCode =
  "invalid_request" | "invalid_fields" | "captcha_failed" | "send_failed" | "server_misconfigured";

const MAX_BODY_BYTES = 20_000;

const FIELD_LIMITS = {
  name: { min: 1, max: 120 },
  company: { min: 1, max: 160 },
  email: { min: 3, max: 254 },
  phone: { min: 7, max: 20 },
  service: { min: 1, max: 120 },
  message: { min: 20, max: 5_000 },
} as const;

type FieldName = keyof typeof FIELD_LIMITS;

// Mismas reglas que el formulario (ContactForm.astro) — el cliente valida por
// comodidad, acá se valida de verdad porque el endpoint es público.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^[0-9+()\s-]{7,20}$/;

function json(body: { ok: true } | { ok: false; error: ErrorCode }, status = 200): Response {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
}

function fail(error: ErrorCode, status: number): Response {
  return json({ ok: false, error }, status);
}

function readString(payload: Record<string, unknown>, key: string): string {
  const value = payload[key];
  return typeof value === "string" ? value.trim() : "";
}

function isSameOrigin(request: Request): boolean {
  const origin = request.headers.get("Origin");
  if (!origin) return false;
  try {
    return new URL(origin).host === new URL(request.url).host;
  } catch {
    return false; // Origin "null" u otro valor que no es una URL
  }
}

function parseSubmission(payload: Record<string, unknown>): ContactSubmission | null {
  const values = {} as Record<FieldName, string>;
  for (const key of Object.keys(FIELD_LIMITS) as FieldName[]) {
    const value = readString(payload, key);
    const { min, max } = FIELD_LIMITS[key];
    if (value.length < min || value.length > max) return null;
    values[key] = value;
  }
  if (!EMAIL_PATTERN.test(values.email) || !PHONE_PATTERN.test(values.phone)) return null;
  // Autorización de tratamiento de datos (Ley 1581): sin la casilla marcada no
  // hay base legal para procesar la solicitud, aunque el cliente se la salte.
  if (payload.privacyConsent !== "on") return null;

  return { ...values, locale: payload.locale === "en" ? "en" : "es" };
}

function countryName(code: string): string {
  try {
    return new Intl.DisplayNames(["es"], { type: "region" }).of(code) ?? code;
  } catch {
    return code;
  }
}

/** "Medellín, Antioquia, Colombia" a partir de request.cf, o undefined si no hay datos. */
function describeLocation(cf: CfGeo | undefined): string | undefined {
  if (!cf) return undefined;
  // "XX" = sin datos, "T1" = red Tor: no son países reales.
  const country =
    cf.country && /^[A-Z]{2}$/.test(cf.country) && cf.country !== "XX" && cf.country !== "T1"
      ? countryName(cf.country)
      : undefined;
  const parts = [cf.city, cf.region, country].filter(
    (part, index, all): part is string => !!part && all.indexOf(part) === index,
  );
  return parts.length > 0 ? parts.join(", ") : undefined;
}

async function verifyTurnstile(token: string, secret: string, ip: string | null): Promise<boolean> {
  const body = new FormData();
  body.append("secret", secret);
  body.append("response", token);
  if (ip) body.append("remoteip", ip);

  try {
    const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body,
    });
    const result = (await response.json()) as { success?: boolean; "error-codes"?: string[] };
    if (!result.success) console.warn("Turnstile rechazó el token:", result["error-codes"]);
    return result.success === true;
  } catch (error) {
    console.error("No se pudo verificar Turnstile:", error);
    return false;
  }
}

async function sendWithResend(data: ContactSubmission, env: Required<Env>): Promise<boolean> {
  const to = env.CONTACT_TO.split(",")
    .map((address) => address.trim())
    .filter(Boolean);

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: env.CONTACT_FROM,
      to,
      reply_to: data.email,
      subject: contactNotificationSubject(data),
      html: contactNotificationHtml(data),
      text: contactNotificationText(data),
    }),
  });

  if (!response.ok) {
    console.error("Resend respondió", response.status, await response.text());
    return false;
  }
  return true;
}

export async function onRequestPost({ request, env }: PagesContext): Promise<Response> {
  const { RESEND_API_KEY, TURNSTILE_SECRET_KEY, CONTACT_TO, CONTACT_FROM } = env;
  if (!RESEND_API_KEY || !TURNSTILE_SECRET_KEY || !CONTACT_TO || !CONTACT_FROM) {
    console.error(
      "Faltan variables de entorno del formulario de contacto (RESEND_API_KEY, TURNSTILE_SECRET_KEY, CONTACT_TO o CONTACT_FROM).",
    );
    return fail("server_misconfigured", 500);
  }

  // Solo peticiones hechas desde el propio sitio (mismo host que atiende la
  // función: siscodex.com, un preview *.pages.dev o localhost). Un script
  // fuera del navegador puede falsificar Origin — la barrera real es Turnstile,
  // esto solo filtra ruido básico.
  if (!isSameOrigin(request)) return fail("invalid_request", 403);

  const contentLength = Number(request.headers.get("Content-Length") ?? "0");
  if (contentLength > MAX_BODY_BYTES) return fail("invalid_request", 413);

  let payload: Record<string, unknown>;
  try {
    const raw = await request.text();
    if (raw.length > MAX_BODY_BYTES) return fail("invalid_request", 413);
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed))
      return fail("invalid_request", 400);
    payload = parsed as Record<string, unknown>;
  } catch {
    return fail("invalid_request", 400);
  }

  // Honeypot lleno = bot. Se responde éxito para no darle pistas, sin enviar nada.
  if (readString(payload, "website") !== "") return json({ ok: true });

  const fields = parseSubmission(payload);
  if (!fields) return fail("invalid_fields", 400);
  const submission: ContactSubmission = { ...fields, location: describeLocation(request.cf) };

  const token = readString(payload, "cf-turnstile-response");
  const captchaOk =
    token !== "" &&
    (await verifyTurnstile(token, TURNSTILE_SECRET_KEY, request.headers.get("CF-Connecting-IP")));
  if (!captchaOk) return fail("captcha_failed", 403);

  const sent = await sendWithResend(submission, {
    RESEND_API_KEY,
    TURNSTILE_SECRET_KEY,
    CONTACT_TO,
    CONTACT_FROM,
  });
  return sent ? json({ ok: true }) : fail("send_failed", 502);
}
