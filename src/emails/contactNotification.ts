/**
 * Plantilla del correo de notificación interna que llega a CONTACT_TO cada vez
 * que alguien envía el formulario de /contacto. La usa la Pages Function
 * `functions/api/contact.ts` (se ejecuta en Cloudflare, no en el navegador).
 *
 * Excepción documentada a la "Regla de oro" de CLAUDE.md: los clientes de correo
 * (Gmail, Outlook, Zoho...) no soportan variables CSS ni clases de Tailwind, así
 * que los colores van en hex y los estilos en línea, con layout de tablas. Si
 * cambia la paleta de marca, tocar también el objeto `colors` de abajo.
 */

// Import relativo (no "@/"): este módulo también lo empaqueta wrangler para la
// Pages Function, fuera del resolver de alias de Astro/Vite.
import { company } from "../data/company";

export interface ContactSubmission {
  name: string;
  company: string;
  email: string;
  phone: string;
  service: string;
  message: string;
  locale: "es" | "en";
  /**
   * Ciudad/región/país aproximados del visitante, deducidos por Cloudflare a
   * partir de su IP (`request.cf`) — no los escribe la persona. Puede faltar
   * (IP sin geolocalización) o ser inexacto (VPN, red corporativa, móvil).
   */
  location?: string;
}

// Espejo manual de los tokens de src/styles/global.css (modo oscuro).
const colors = {
  ink950: "#1a1b1e",
  ink700: "#34353a",
  ink500: "#5c5e63",
  ink100: "#e6e7e9",
  paper: "#f8f8f9",
  brand500: "#10b981",
  gold400: "#e3a94a",
} as const;

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// Constancia de la autorización (Ley 1581, art. 9: el responsable debe conservar
// prueba de ella). La función rechaza cualquier envío sin la casilla marcada,
// así que si este correo existe, la persona la aceptó en la fecha de "Recibido".
function consentText(): string {
  return `Aceptó la Política de privacidad (versión vigente desde ${company.privacyPolicyEffectiveDate}) al enviar el formulario.`;
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("es-CO", {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: "America/Bogota",
  }).format(date);
}

export function contactNotificationSubject(data: ContactSubmission): string {
  // Sin saltos de línea: un subject con CR/LF es un vector de inyección de headers.
  return `Nuevo contacto web: ${data.name} (${data.company})`.replace(/[\r\n]+/g, " ");
}

export function contactNotificationText(data: ContactSubmission, receivedAt = new Date()): string {
  return [
    "Nuevo mensaje desde el formulario de siscodex.com",
    "",
    `Nombre: ${data.name}`,
    `Empresa: ${data.company}`,
    `Email: ${data.email}`,
    `Teléfono: ${data.phone}`,
    `Servicio de interés: ${data.service}`,
    `Idioma del sitio: ${data.locale.toUpperCase()}`,
    `Ubicación (aprox., según IP): ${data.location ?? "No disponible"}`,
    `Recibido: ${formatDate(receivedAt)}`,
    `Autorización de datos: ${consentText()}`,
    "",
    "Mensaje:",
    data.message,
    "",
    "Responde a este correo para contestarle directamente a la persona.",
  ].join("\n");
}

export function contactNotificationHtml(data: ContactSubmission, receivedAt = new Date()): string {
  const rows: Array<[string, string]> = [
    ["Nombre", escapeHtml(data.name)],
    ["Empresa", escapeHtml(data.company)],
    [
      "Email",
      `<a href="mailto:${escapeHtml(data.email)}" style="color:${colors.brand500};text-decoration:none;">${escapeHtml(data.email)}</a>`,
    ],
    [
      "Teléfono",
      `<a href="tel:${escapeHtml(data.phone.replace(/[^0-9+]/g, ""))}" style="color:${colors.brand500};text-decoration:none;">${escapeHtml(data.phone)}</a>`,
    ],
    ["Servicio de interés", escapeHtml(data.service)],
    ["Idioma del sitio", data.locale.toUpperCase()],
    [
      "Ubicación",
      data.location
        ? `${escapeHtml(data.location)} <span style="color:${colors.ink500};font-size:12px;">(aprox., según IP)</span>`
        : `<span style="color:${colors.ink500};">No disponible</span>`,
    ],
    ["Recibido", escapeHtml(formatDate(receivedAt))],
    ["Autorización de datos", escapeHtml(consentText())],
  ];

  const rowsHtml = rows
    .map(
      ([label, value]) => `
          <tr>
            <td style="padding:10px 0;border-bottom:1px solid ${colors.ink100};width:170px;vertical-align:top;font-family:'JetBrains Mono',Consolas,monospace;font-size:11px;letter-spacing:0.08em;text-transform:uppercase;color:${colors.ink500};">${label}</td>
            <td style="padding:10px 0;border-bottom:1px solid ${colors.ink100};vertical-align:top;font-size:15px;color:${colors.ink950};">${value}</td>
          </tr>`,
    )
    .join("");

  const messageHtml = escapeHtml(data.message).replace(/\r?\n/g, "<br />");

  return `<!doctype html>
<html lang="es">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(contactNotificationSubject(data))}</title>
  </head>
  <body style="margin:0;padding:0;background-color:${colors.paper};">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${colors.paper};padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background-color:#ffffff;border:1px solid ${colors.ink100};border-radius:10px;overflow:hidden;font-family:Inter,'Segoe UI',Helvetica,Arial,sans-serif;">
            <tr>
              <td style="background-color:${colors.ink950};padding:24px 32px;border-bottom:3px solid ${colors.brand500};">
                <img src="https://siscodex.com/logo.png" alt="Siscodex" width="180" style="display:block;height:auto;border:0;color:#ffffff;font-size:20px;font-weight:bold;" />
              </td>
            </tr>
            <tr>
              <td style="padding:32px 32px 8px;">
                <p style="margin:0 0 6px;font-family:'JetBrains Mono',Consolas,monospace;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:${colors.ink500};">Formulario de contacto</p>
                <h1 style="margin:0;font-family:'Space Grotesk',Inter,Helvetica,Arial,sans-serif;font-size:22px;line-height:1.3;color:${colors.ink950};">Nueva solicitud de ${escapeHtml(data.name)}</h1>
              </td>
            </tr>
            <tr>
              <td style="padding:16px 32px 8px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${rowsHtml}
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:24px 32px 8px;">
                <p style="margin:0 0 8px;font-family:'JetBrains Mono',Consolas,monospace;font-size:11px;letter-spacing:0.08em;text-transform:uppercase;color:${colors.ink500};">Mensaje</p>
                <div style="padding:16px;background-color:${colors.paper};border-left:3px solid ${colors.gold400};border-radius:6px;font-size:15px;line-height:1.6;color:${colors.ink950};">${messageHtml}</div>
              </td>
            </tr>
            <tr>
              <td style="padding:24px 32px 32px;">
                <a href="mailto:${escapeHtml(data.email)}" style="display:inline-block;padding:12px 22px;background-color:${colors.brand500};border-radius:10px;color:${colors.ink950};font-size:14px;font-weight:600;text-decoration:none;">Responder a ${escapeHtml(data.name)}</a>
              </td>
            </tr>
            <tr>
              <td style="padding:16px 32px;background-color:${colors.paper};border-top:1px solid ${colors.ink100};font-size:12px;line-height:1.5;color:${colors.ink500};">
                Enviado automáticamente desde el formulario de <a href="https://siscodex.com/contacto" style="color:${colors.ink700};">siscodex.com/contacto</a>. Al responder este correo, la respuesta le llega directamente a la persona.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}
