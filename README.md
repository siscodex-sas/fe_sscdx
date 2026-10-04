# Siscodex Web

Sitio web corporativo oficial de **Siscodex** — estudio de ingeniería de software
especializado en desarrollo a medida, arquitectura cloud e inteligencia artificial.

Construido con [Astro](https://astro.build) + TypeScript estricto + Tailwind CSS v4, 100%
estático. Desplegado en **Cloudflare Pages**; también listo para Vercel, Netlify, AWS S3/CloudFront
o GitHub Pages sin cambios de código. Bilingüe (español por defecto, inglés bajo `/en/`) vía el
routing i18n nativo de Astro.

📄 **Documentación técnica completa** (arquitectura, sistema de diseño, SEO, performance y
deployment): [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).

## Funcionalidades con backend o servicios externos

- **Formulario de contacto**: envía a la Cloudflare Pages Function `/api/contact`
  (`functions/api/contact.ts`), que valida los datos, verifica el antispam de **Cloudflare
  Turnstile** y manda la notificación por **Resend** con la plantilla de `src/emails/`. Por qué
  esta combinación y no otras: [`docs/ENVIO-DE-CORREOS.md`](docs/ENVIO-DE-CORREOS.md).
- **Google Analytics 4 con consentimiento**: GA solo se carga si el visitante acepta en el banner de
  cookies (`CookieConsent.astro`); se puede cambiar la elección desde "Preferencias de cookies" en
  el pie de página.
- **Política de privacidad** (`/legal/privacidad`, ES/EN) conforme a la Ley 1581 de 2012, con
  autorización obligatoria de tratamiento de datos en el formulario. Los datos legales de la
  empresa viven en `src/data/company.ts`.

## Requisitos

- Node.js ≥ 22.12 (lo exige Astro 7)

## Empezar

```bash
npm install
cp .env.example .env   # variables locales (ver abajo)
npm run dev            # http://localhost:4321 — sitio sin el formulario real
npm run dev:cf         # http://localhost:8788 — sitio + formulario de contacto funcionando
```

`npm run dev` no ejecuta `functions/`, así que el formulario de contacto solo funciona de punta a
punta con `npm run dev:cf`.

## Variables de entorno

En local se definen en `.env` (copiado de `.env.example`, ignorado por git); en producción, en
Cloudflare Pages → Settings → Variables and Secrets. Detalle en
[`docs/ARCHITECTURE.md` § 7.6](docs/ARCHITECTURE.md#76-variables-de-entorno).

| Variable                    | Tipo            | Para qué                                                                            |
| --------------------------- | --------------- | ----------------------------------------------------------------------------------- |
| `PUBLIC_TURNSTILE_SITE_KEY` | Pública (build) | Widget antispam del formulario. En local, la clave de prueba de `.env.example`.     |
| `TURNSTILE_SECRET_KEY`      | Secreta         | Verificación del antispam en la función. En local, la clave de prueba.              |
| `RESEND_API_KEY`            | Secreta         | Envío del correo de notificación.                                                   |
| `CONTACT_TO`                | Servidor        | Destinatarios de la notificación, separados por coma.                               |
| `CONTACT_FROM`              | Servidor        | Remitente, en un dominio verificado en Resend.                                      |
| `PUBLIC_GA_MEASUREMENT_ID`  | Pública (build) | Google Analytics. Vacía = sin GA ni banner de cookies. No usar el ID real en local. |
| `PUBLIC_BASE_PATH`          | Pública (build) | Solo para servir el sitio bajo una subruta; en Cloudflare Pages queda en `/`.       |

Las claves de producción de Turnstile solo funcionan en `siscodex.com`: en local y en los previews
se usan las de prueba.

## Scripts

| Comando           | Descripción                                                                                                                                       |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| `npm run dev`     | Servidor de desarrollo con hot reload.                                                                                                            |
| `npm run build`   | Type-check (`astro check`) + build de producción en `dist/`.                                                                                      |
| `npm run preview` | Sirve `dist/` localmente para verificar el build de producción.                                                                                   |
| `npm run dev:cf`  | Build + `wrangler pages dev`: sitio **y** Pages Functions (formulario de contacto real) en `http://localhost:8788`, con las variables del `.env`. |
| `npm run check`   | Solo type-check, sin compilar.                                                                                                                    |
| `npm run format`  | Formatea el proyecto con Prettier.                                                                                                                |

## Estructura del proyecto

```
src/
├── components/   # ui/ (átomos) · sections/ (bloques de página) · layout/ (Navbar, Footer, CookieConsent) · seo/
├── data/         # Contenido tipado: servicios, proyectos, tecnologías, navegación (getX(locale)), company.ts (datos legales)
├── i18n/         # Diccionario ES/EN, t(), localizedHref(), alternateUrls()
├── layouts/      # BaseLayout y SimpleContentLayout
├── pages/        # Rutas del sitio (file-based routing) — en/ espeja cada página en inglés
├── scripts/      # JS de cliente compartido (scroll-reveal, modo claro, GA con consentimiento)
├── styles/       # Theme de Tailwind v4 (global.css)
├── types/        # Contratos de datos
├── emails/       # Plantillas de correo (notificación del formulario de contacto)
└── utils/        # Helpers de SEO

functions/        # Cloudflare Pages Functions — /api/contact (Turnstile + Resend)
```

Ver el detalle completo, con la justificación de cada decisión, en
[`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).

## Deployment

- **Cloudflare Pages** (actual): conectado directo al repo, auto-deploy en cada push a `master`.
  Headers de seguridad y redirects reales vía `public/_headers`/`public/_redirects`. La carpeta
  `functions/` se despliega en el mismo push; las variables de la tabla de arriba deben estar
  cargadas en el entorno Production antes de publicar cambios del formulario.
- **Vercel / Netlify**: detección automática del framework Astro; Netlify usa `netlify.toml`. El
  formulario de contacto depende de Cloudflare Pages Functions y habría que portarlo.
- **AWS (S3 + CloudFront)**: subir el contenido de `dist/` tras `npm run build`.
- **GitHub Pages**: documentado como alternativa, no usado actualmente (no soporta headers HTTP
  custom ni redirects HTTP reales).

Instrucciones paso a paso para cada plataforma en
[`docs/ARCHITECTURE.md § 7`](docs/ARCHITECTURE.md#7-deployment).
