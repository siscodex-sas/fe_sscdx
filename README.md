# Siscodex Web

Sitio web corporativo oficial de **Siscodex** — estudio de ingeniería de software
especializado en desarrollo a medida, arquitectura cloud e inteligencia artificial.

Construido con [Astro](https://astro.build) + TypeScript estricto + Tailwind CSS v4, 100%
estático. Desplegado en **Cloudflare Pages**; también listo para Vercel, Netlify, AWS S3/CloudFront
o GitHub Pages sin cambios de código. Bilingüe (español por defecto, inglés bajo `/en/`) vía el
routing i18n nativo de Astro.

📄 **Documentación técnica completa** (arquitectura, sistema de diseño, SEO, performance y
deployment): [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).

## Requisitos

- Node.js ≥ 20.3

## Empezar

```bash
npm install
npm run dev       # http://localhost:4321
```

## Scripts

| Comando | Descripción |
|---|---|
| `npm run dev` | Servidor de desarrollo con hot reload. |
| `npm run build` | Type-check (`astro check`) + build de producción en `dist/`. |
| `npm run preview` | Sirve `dist/` localmente para verificar el build de producción. |
| `npm run check` | Solo type-check, sin compilar. |
| `npm run format` | Formatea el proyecto con Prettier. |

## Estructura del proyecto

```
src/
├── components/   # ui/ (átomos) · sections/ (bloques de página) · layout/ (Navbar, Footer) · seo/
├── data/         # Contenido tipado: servicios, proyectos, tecnologías, navegación (getX(locale))
├── i18n/         # Diccionario ES/EN, t(), localizedHref(), alternateUrls()
├── layouts/      # BaseLayout y SimpleContentLayout
├── pages/        # Rutas del sitio (file-based routing) — en/ espeja cada página en inglés
├── scripts/      # JS de cliente compartido (scroll-reveal)
├── styles/       # Theme de Tailwind v4 (global.css)
├── types/        # Contratos de datos
└── utils/        # Helpers de SEO
```

Ver el detalle completo, con la justificación de cada decisión, en
[`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).

## Deployment

- **Cloudflare Pages** (actual): conectado directo al repo, auto-deploy en cada push a `master`.
  Headers de seguridad y redirects reales vía `public/_headers`/`public/_redirects`.
- **Vercel / Netlify**: detección automática del framework Astro; Netlify usa `netlify.toml`.
- **AWS (S3 + CloudFront)**: subir el contenido de `dist/` tras `npm run build`.
- **GitHub Pages**: documentado como alternativa, no usado actualmente (no soporta headers HTTP
  custom ni redirects HTTP reales).

Instrucciones paso a paso para cada plataforma en
[`docs/ARCHITECTURE.md § 7`](docs/ARCHITECTURE.md#7-deployment).
