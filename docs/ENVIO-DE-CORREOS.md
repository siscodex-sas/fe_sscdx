# Envío de correos del formulario de contacto — opciones evaluadas

Registro de la decisión tomada en septiembre de 2026 para el formulario de `siscodex.com/contacto`:
qué opciones se consideraron, qué ventajas tiene cada una y por qué se eligió **Resend**.

**Objetivo:** que lo que escribe un visitante en el formulario llegue a uno o varios correos de
Siscodex (hoy `contacto@siscodex.com`), con una plantilla propia y sin costo o con costo mínimo.

**Contexto que condiciona la decisión:**

- El sitio es estático y está en **Cloudflare Pages**, así que hace falta un backend pequeño para
  enviar correos sin exponer claves en el navegador.
- El dominio `siscodex.com` está registrado en Squarespace, pero su **DNS lo administra Cloudflare**.
- El correo corporativo va a vivir en **Zoho Mail**, así que los registros MX del dominio apuntan a
  Zoho.

---

## Resumen

|                                              | Cloudflare Email Routing        | Cloudflare Email Sending                        | **Resend (elegida)**            | Formspree                            | Zoho Mail (SMTP/API)    |
| -------------------------------------------- | ------------------------------- | ----------------------------------------------- | ------------------------------- | ------------------------------------ | ----------------------- |
| Costo                                        | Gratis                          | 5 USD/mes (Workers Paid), incluye 3.000 correos | **Gratis** (3.000/mes, 100/día) | Gratis: 50 envíos/mes                | Requiere plan pago      |
| Estado                                       | Estable                         | Beta                                            | **Estable**                     | Estable                              | Estable                 |
| Compatible con Zoho Mail en el mismo dominio | ❌ No                           | ✅ Sí                                           | **✅ Sí**                       | ✅ Sí                                | ✅ Sí                   |
| Varios destinatarios                         | ⚠️ Solo direcciones verificadas | ✅ Sí                                           | **✅ Sí**                       | ⚠️ Solo plan Business (90 USD/mes)   | ✅ Sí                   |
| Correo de confirmación al visitante          | ❌ No                           | ✅ Sí                                           | **✅ Sí**                       | ⚠️ Limitado                          | ✅ Sí                   |
| Funciona desde Pages Functions               | ❌ No (exige un Worker aparte)  | ✅ Sí (API REST)                                | **✅ Sí (API HTTP)**            | No aplica (envío desde el navegador) | ⚠️ Poco práctico (SMTP) |
| Plantilla propia en el repo                  | ✅                              | ✅                                              | **✅**                          | ❌ La define Formspree               | ✅                      |
| Validación en servidor propio                | ✅                              | ✅                                              | **✅**                          | ❌                                   | ✅                      |

---

## 1. Cloudflare Email Routing (binding `send_email`)

Servicio de Cloudflare pensado para **recibir y reenviar** correo (por ejemplo, reenviar lo que
llega a `info@` a otro buzón). Como función secundaria, permite enviar correos desde código.

**Ventajas**

- Gratis en todos los planes.
- Todo queda dentro de Cloudflare: un solo proveedor, un solo panel.
- Servicio estable (GA).

**Por qué se descartó**

- **Choca con Zoho Mail:** exige que los registros MX de `siscodex.com` apunten a Cloudflare, y
  Zoho necesita que apunten a Zoho. Un dominio no puede recibir correo en los dos a la vez.
- Solo envía a **direcciones verificadas** en la cuenta de Cloudflare, así que nunca permitiría un
  correo de confirmación al visitante.
- Su binding `send_email` **no está disponible en Pages Functions**: habría que crear y mantener
  un Worker aparte. Se confirmó en el dashboard durante un primer intento (ver `CLAUDE.md`, punto 25).

## 2. Cloudflare Email Sending (Cloudflare Email Service)

Servicio de Cloudflare dedicado al **envío de correos transaccionales** a cualquier destinatario.

**Ventajas**

- Envía a cualquier dirección, así que permite notificaciones internas y confirmación al visitante.
- Integración nativa con Workers y API REST; todo dentro de Cloudflare.
- Convive con Zoho Mail: no exige cambiar los MX.
- Costo bajo una vez pagado el plan: 3.000 correos incluidos y 0,35 USD por cada 1.000 adicionales.

**Por qué no se eligió**

- Exige el plan **Workers Paid (5 USD/mes)**; no está disponible en el plan gratuito.
- Estaba en **beta** al momento de la decisión.
- **Queda como plan de migración natural** si más adelante se contrata Workers Paid o el servicio
  pasa a estable. Como la plantilla vive en el código, migrar solo implica cambiar la función que
  hace el envío.

## 3. Resend ✅ (opción elegida)

Proveedor especializado en correo transaccional, con API HTTP.

**Ventajas**

- **Gratis:** 3.000 correos al mes y 100 al día, muy por encima del volumen de un formulario de
  contacto corporativo.
- **Convive con Zoho Mail sin conflictos de DNS:** Resend usa el subdominio `send.siscodex.com`
  para SPF/return-path y el registro `resend._domainkey` para DKIM; Zoho usa la raíz y
  `zmail._domainkey`.
- **Funciona desde una Cloudflare Pages Function** con un simple `fetch`: mismo repo, mismo
  despliegue automático y mismo dominio (`siscodex.com/api/contact`), sin un Worker aparte.
- Envía a varios destinatarios (variable `CONTACT_TO`) y permite agregar el correo de confirmación
  al visitante más adelante.
- Plantilla propia versionada en el repo (`src/emails/contactNotification.ts`).
- `reply_to` con el correo del visitante: al responder desde Zoho, la respuesta le llega directo.
- Panel con el registro de cada envío, útil para diagnosticar problemas.
- Servicio estable; si el volumen crece, el siguiente plan (Pro) cuesta 20 USD/mes por 50.000 correos.

**Limitaciones asumidas**

- Es un proveedor más, fuera de Cloudflare (cuenta y API key propias).
- Hasta verificar el dominio `siscodex.com` en Resend, solo puede enviar al correo dueño de la
  cuenta (útil para pruebas, no para producción).

## 4. Formspree (solución temporal anterior)

Servicio que recibe formularios HTML y los reenvía por correo, sin backend propio.

**Ventajas**

- Cero backend: el formulario envía directo a Formspree.
- Configuración en minutos y filtro de spam propio.
- Fue útil como **solución temporal** mientras no existía correo corporativo.

**Por qué se reemplazó**

- El plan gratuito solo admite **50 envíos al mes** y cada formulario notifica a **un único
  correo destino**; notificar a varios a la vez exige "Form Rules", solo en el plan Business.
- **Personalizar la plantilla exige el plan Business (90 USD/mes)**; en los demás planes el
  correo lo diseña Formspree.
- Las validaciones (honeypot, campos obligatorios) solo ocurrían en el navegador, sin un servidor
  propio que las revisara de nuevo. Tampoco permite la ubicación aproximada por IP ni la constancia
  de autorización con versión de política que hoy agrega la función propia.
- Datos del formulario en manos de un tercero más.

**Planes oficiales** (consultados el 30 de septiembre de 2026 en
[formspree.io/plans](https://formspree.io/plans)):

|                                                  | Free    | Personal                  | Professional              | Business                  |
| ------------------------------------------------ | ------- | ------------------------- | ------------------------- | ------------------------- |
| Precio mensual                                   | 0 USD   | 15 USD (10 USD/mes anual) | 30 USD (20 USD/mes anual) | 90 USD (60 USD/mes anual) |
| Envíos al mes                                    | 50      | 200                       | 2.000                     | 20.000                    |
| Correos vinculados a la cuenta                   | 2       | Ilimitados                | Ilimitados                | Ilimitados                |
| Notificar a varios correos a la vez (Form Rules) | ❌      | ❌                        | ❌                        | ✅                        |
| Plantilla personalizada (HTML/CSS)               | ❌      | ❌                        | ❌                        | ✅                        |
| Respuesta automática al visitante                | ❌      | ❌                        | ✅                        | ✅                        |
| Historial de envíos                              | 30 días | Ilimitado                 | Ilimitado                 | Ilimitado                 |
| Página de "gracias" propia                       | ❌      | ✅                        | ✅                        | ✅                        |
| Integraciones (Zapier, webhooks, CRM)            | ❌      | Básicas                   | ✅                        | ✅                        |
| Miembros del equipo                              | 1       | 1                         | 2                         | Ilimitados                |

Para igualar lo que hoy hace la solución con Resend (plantilla propia y varios destinatarios),
Formspree exige el plan Business: **90 USD/mes, o 720 USD/año**. Un truco que sí funciona en el
plan gratuito es usar como correo destino un grupo de Zoho (`contacto@siscodex.com`) que reparta a
los socios, pero la plantilla seguiría siendo la de Formspree.

## 5. Zoho Mail (SMTP o API propia)

Enviar usando el mismo buzón corporativo de Zoho.

**Ventajas**

- Un solo proveedor para recibir y enviar correo.
- Los correos salen desde el buzón real de Siscodex.

**Por qué se descartó**

- El **plan gratuito de Zoho Mail no incluye acceso SMTP/IMAP**; habría que pagar un plan.
- SMTP no es práctico desde Cloudflare Pages Functions / Workers, que están pensados para llamadas
  HTTP.

---

## Piezas comunes a la solución implementada

Independientemente del proveedor de correo, la solución incluye:

- **Cloudflare Pages Function** (`functions/api/contact.ts`): recibe el formulario, lo valida y
  envía el correo. Gratis dentro del plan Workers Free (100.000 ejecuciones al día).
- **Cloudflare Turnstile**: antispam gratuito (verificaciones ilimitadas) que impide que bots usen
  el formulario.
- **Destinatarios fijos** en `CONTACT_TO`: la API no permite elegir a quién se envía, así que no se
  puede abusar para mandar correos a terceros.

Costo total de la solución elegida: **0 USD/mes**.

Detalle técnico completo: `docs/ARCHITECTURE.md` §4.4 y `CLAUDE.md` puntos 25 y 26.

---

_Precios y condiciones consultados en septiembre de 2026 en la documentación oficial de
[Cloudflare Email Service](https://developers.cloudflare.com/email-service/),
[precios de Cloudflare Email Service](https://developers.cloudflare.com/email-service/platform/pricing/),
[Cloudflare Turnstile](https://developers.cloudflare.com/turnstile/plans/) y
[Resend](https://resend.com/pricing). Pueden cambiar; verificar antes de nuevas decisiones._
