# Siscodex Web — Documentación técnica

Sitio web corporativo oficial de **Siscodex** (siscodex.com): estudio de ingeniería de software
especializado en desarrollo a medida, arquitectura cloud e inteligencia artificial.

Este documento es la referencia técnica completa del proyecto: arquitectura, stack, sistema de
diseño, contenido, SEO, performance, deployment y buenas prácticas. Está pensado para que
cualquier ingeniero (o un cliente corporativo evaluando el trabajo) entienda el "por qué" detrás
de cada decisión, no solo el "qué".

---

## Índice

1. [Arquitectura del proyecto](#1-arquitectura-del-proyecto)
2. [Stack tecnológico y configuración](#2-stack-tecnológico-y-configuración)
3. [Diseño visual y sistema de componentes](#3-diseño-visual-y-sistema-de-componentes)
4. [Contenido y páginas](#4-contenido-y-páginas)
5. [SEO y metadata](#5-seo-y-metadata)
6. [Performance y optimización](#6-performance-y-optimización)
7. [Deployment](#7-deployment)
8. [Buenas prácticas](#8-buenas-prácticas)

---

## 1. Arquitectura del proyecto

### 1.1 Estructura de carpetas

```
fe_sscdx/
├── .github/workflows/        # CI (PRs) y CD (deploy a GitHub Pages)
│   ├── ci.yml
│   └── deploy.yml
├── docs/
│   └── ARCHITECTURE.md       # Este documento
├── public/                   # Assets servidos tal cual, sin procesar por Vite
│   ├── favicon.svg
│   ├── logo.png               # Logo real recortado a su bounding box visible (565×62)
│   ├── team/                  # Fotos reales de liderazgo (TeamSection/TeamCard en /nosotros)
│   ├── og/default.svg        # Placeholder de Open Graph (ver §5.4)
│   ├── robots.txt
│   └── CNAME                 # Dominio personalizado para GitHub Pages
├── src/
│   ├── components/
│   │   ├── layout/           # Navbar, Footer — presentes en todas las páginas
│   │   ├── sections/         # Bloques de página (Hero, ServiceCard, SpecialtiesTabs, TeamSection, ContactForm...)
│   │   ├── seo/               # <SEO /> — metadata, OG, Schema.org
│   │   └── ui/                # Átomos reutilizables (Button, SectionTitle, TechTile, Badge...)
│   ├── data/                  # Contenido estructurado como TypeScript (no CMS todavía)
│   │   ├── navigation.ts
│   │   ├── services.ts
│   │   ├── projects.ts
│   │   ├── technologies.ts
│   │   └── team.ts
│   ├── layouts/
│   │   ├── BaseLayout.astro          # Shell HTML: head, Navbar, Footer, scripts globales
│   │   └── SimpleContentLayout.astro # Layout ligero para páginas de solo texto (legal, recursos)
│   ├── pages/                 # Cada archivo = una ruta (file-based routing de Astro)
│   │   ├── index.astro         # Incluye las secciones que antes eran /servicios y /soluciones
│   │   ├── tecnologia.astro
│   │   ├── nosotros.astro
│   │   ├── contacto.astro
│   │   ├── recursos.astro
│   │   ├── recursos/          # Subpáginas de documentación para clientes (noindex)
│   │   ├── legal/              # Privacidad y términos
│   │   └── 404.astro
│   ├── scripts/                # JS de cliente compartido (no components)
│   │   └── reveal.ts           # Scroll-reveal con la librería "motion"
│   ├── styles/
│   │   └── global.css          # Theme de Tailwind v4 (@theme) + estilos base
│   ├── types/
│   │   └── index.ts            # Contratos de datos (Service, Project, Technology...)
│   └── utils/
│       └── seo.ts              # Helpers de título/canonical/OG
├── astro.config.mjs
├── tsconfig.json
├── package.json
├── netlify.toml
└── .env.example
```

**Por qué esta separación en `components/`:** `layout` vs `sections` vs `ui` refleja tres niveles
de reutilización distintos:

- **`ui/`** — átomos sin conocimiento de negocio (`Button`, `SectionTitle`, `TechnologyBadge`,
  `StatusPill`). Podrían moverse a otro proyecto sin cambios.
- **`sections/`** — bloques con conocimiento del dominio Siscodex (`ServiceCard`, `ContactForm`),
  ensamblados a partir de átomos de `ui/`. Se componen dentro de las páginas.
- **`layout/`** — aparecen en *todas* las páginas y viven fuera del `<slot />` de contenido
  (`Navbar`, `Footer`).

Esta jerarquía evita la ambigüedad de tener una sola carpeta `components/` plana, que en un sitio
de 10+ páginas rápidamente mezcla átomos con bloques de página y dificulta saber qué se puede
reutilizar con seguridad.

### 1.2 Convenciones de nombrado

| Elemento | Convención | Ejemplo |
|---|---|---|
| Componentes `.astro` | `PascalCase` | `ServiceCard.astro` |
| Páginas de ruta | `kebab-case` en español (coincide con la URL) | `tecnologia.astro` |
| Archivos de datos/utils `.ts` | `camelCase` | `seo.ts`, `navigation.ts` |
| Tipos e interfaces | `PascalCase`, sin prefijo `I` | `Service`, `Project` |
| Props de componente | `interface Props` local al `.astro` | — |
| Variables CSS de tema | `--color-{escala}-{paso}` | `--color-brand-400` |
| Atributos `data-*` para JS | `data-{intención}` | `data-reveal`, `data-menu-toggle` |

Las rutas de página usan español porque son visibles en la URL pública (`/servicios`,
`/contacto`) y así se indexan; el código interno (componentes, variables, tipos) usa inglés,
que es el estándar de facto para mantenibilidad y para que colaboradores externos puedan
contribuir sin fricción.

### 1.3 Decisiones arquitectónicas justificadas

**¿Por qué Astro?**
El sitio es 100% contenido de marketing/institucional: no hay estado de aplicación complejo,
autenticación de usuario final ni datos que cambien por request. Astro genera HTML estático en
build time y solo envía JavaScript para las piezas que realmente lo necesitan (el menú móvil, el
formulario, las microinteracciones de scroll) — el llamado modelo de **islas**. Frente a un
framework SPA (Next.js/Remix en modo cliente pesado), esto se traduce directamente en mejor
Lighthouse Performance y menor Time to Interactive, que es exactamente lo que un sitio B2B
premium necesita para transmitir "esta empresa construye software rápido y bien hecho".

**¿Por qué TypeScript estricto?**
El contenido del sitio (servicios, proyectos, tecnologías) vive como datos tipados en `src/data/`
en lugar de estar hardcodeado en el JSX/HTML de cada página. `strict: true` +
`noUncheckedIndexedAccess` garantiza que un error de tipeo en un campo de `Service` o `Project`
se detecte en `astro check` (que corre en CI) antes de llegar a producción, no en un
`undefined is not a function` en el navegador de un cliente potencial.

**¿Por qué Tailwind CSS v4 sin `tailwind.config.ts`?**
Tailwind v4 introdujo una configuración *CSS-first*: los tokens de diseño (colores, tipografía,
radios, animaciones) se declaran dentro de un bloque `@theme` en `src/styles/global.css`, y
Tailwind genera las utilidades automáticamente a partir de esas custom properties. Esta es la vía
recomendada oficialmente por el equipo de Tailwind para proyectos nuevos en v4 — un
`tailwind.config.ts` sigue siendo soportado por compatibilidad (vía la directiva `@config`), pero
usarlo aquí sería adoptar deliberadamente el patrón legacy en un proyecto que arranca desde cero.
Ver el detalle completo del theme en [§3.1](#31-paleta-de-colores).

**¿Por qué "motion" (vanilla) en vez de Framer Motion?**
Framer Motion es una librería de React. Astro no usa React salvo que se añada explícitamente como
integración de UI, y hacerlo solo para animaciones significaría enviar el runtime completo de
React al cliente por una microinteracción de scroll-reveal — exactamente el tipo de peso
innecesario que el modelo de islas de Astro busca evitar. `motion` (antes "Motion One", del mismo
autor que Framer Motion) expone la misma API de animación pero funciona sobre el DOM directamente,
sin framework. Se usa en un único módulo (`src/scripts/reveal.ts`) para animar cualquier elemento
marcado con `data-reveal` al entrar en el viewport.

**¿Por qué Lucide vía `astro-icon` y no `lucide-react`/web components?**
`astro-icon` con `@iconify-json/lucide` resuelve los iconos **en build time**: cada `<Icon />` se
convierte en un `<svg>` inline en el HTML final, con cero JavaScript de runtime y sin petición de
red adicional. Es la opción de menor costo posible para iconografía en un sitio estático.

**¿Por qué datos en TypeScript (`src/data/*.ts`) y no un CMS?**
El brief indica "sin backend todavía". Modelar servicios/proyectos/tecnologías como arrays
tipados en TypeScript da **type-safety completo** (una especialidad sin `idealFor` no compila) sin
introducir infraestructura adicional. Cuando el contenido lo justifique (por ejemplo, que alguien
de marketing/ventas necesite editar contenido sin tocar código), la migración natural es a
**Content Collections de Astro** (Markdown/MDX con `zod` schema) o a un headless CMS — ambas
opciones consumen la misma forma de datos definida en `src/types/index.ts`, por lo que la
migración no requiere rediseñar componentes.

### 1.4 Patrones de componentes reutilizables

- **Props tipadas por interfaz `Props` local** en cada `.astro`, nunca `any`.
- **Composición sobre configuración**: `CTASection`, `ServiceCard`, `SpecialtiesTabs`, `TeamCard`
  reciben los datos ya resueltos (`Service`, `Project`, `TeamMember`) en vez de 10 props sueltas —
  el componente no sabe de dónde vienen los datos, solo cómo pintarlos.
- **Slots para contenido variable, props para datos estructurados**: `SectionTitle` usa props
  (`title`, `description`) porque su contenido es texto simple; `SimpleContentLayout` usa
  `<slot />` porque su contenido es HTML rico (varios `<h2>`/`<p>`/`<ul>`).
- **`class:list` para clases condicionales**, nunca concatenación manual de strings.
- Componentes de sección **no importan `BaseLayout`** — solo las páginas en `src/pages/` lo hacen.
  Esto evita capas de layout anidadas y mantiene cada sección testeable/movible de forma aislada.

### 1.5 Gestión de estado y datos

No hay estado de aplicación global: cada página es HTML estático generado en build time. El único
estado en cliente es local a un componente (menú móvil abierto/cerrado, formulario enviado) y se
maneja con JavaScript vanilla dentro de un `<script>` del propio componente, sin librería de
estado. Es la decisión correcta para el tamaño y naturaleza de este sitio — introducir
Redux/Zustand/nanostores no tendría ningún estado real que gestionar todavía.

---

## 2. Stack tecnológico y configuración

| Categoría | Elección | Versión objetivo |
|---|---|---|
| Framework | Astro (`output: "static"`) | ^7.1 |
| Lenguaje | TypeScript (`strict`) | ^6.0 |
| Estilos | Tailwind CSS v4 (`@tailwindcss/vite`) | ^4.3 |
| Animación | `motion` (vanilla, ex Motion One) | ^12 |
| Iconografía | `astro-icon` + `@iconify-json/lucide` | ^1.1 |
| Tipografía | `@fontsource-variable/*` (Inter, Space Grotesk, JetBrains Mono) | ^5 |
| Sitemap | `@astrojs/sitemap` | ^3.6 |

### 2.1 `astro.config.mjs`

Puntos clave de la configuración (ver el archivo real en la raíz del proyecto):

- **`site: "https://siscodex.com"`** — usado por `@astrojs/sitemap` y por los helpers de SEO para
  generar URLs canónicas absolutas, independientemente de dónde se compile el sitio.
- **`base: process.env.PUBLIC_BASE_PATH ?? "/"`** — controlado por variable de entorno, no
  hardcodeado. Con dominio propio (siscodex.com, Vercel, Netlify, CloudFront) siempre es `"/"`.
  Solo cambia a `"/nombre-del-repo"` si se despliega en un GitHub Pages de *proyecto* sin dominio
  personalizado — ver [§7.1](#71-github-pages).
- **`output: "static"`** — no hay SSR; todo el sitio se pre-renderiza. Es compatible tal cual con
  cualquiera de las cuatro plataformas de destino (GitHub Pages, Vercel, Netlify, S3+CloudFront).
- **`prefetch`** — precarga las páginas enlazadas cuando entran al viewport, para que la
  navegación se sienta instantánea (patrón usado por Vercel/Linear).
- **`vite.plugins: [tailwindcss()]`** — integra Tailwind v4 directamente en Vite, sin el paquete
  `@astrojs/tailwind` (que es la vía legacy pensada para Tailwind v3).
- **`redirects`** — `/servicios` y `/soluciones` dejaron de ser páginas propias (su contenido se
  fusionó en el home, ver [§4](#4-contenido-y-páginas)); en vez de dejarlas devolver 404, redirigen
  a `/#servicios` y `/#soluciones`. Con `output: "static"` Astro genera esto como una página HTML
  con `<meta http-equiv="refresh">` en build time (no un 301 real vía servidor) — es la única opción
  compatible con GitHub Pages, que no sirve redirects HTTP configurables.

### 2.2 `tsconfig.json`

Extiende `astro/tsconfigs/strict` y añade:

- `noUncheckedIndexedAccess`: obliga a comprobar `undefined` al indexar arrays/objetos por clave
  dinámica (relevante en los `Record<Category, string>` usados para agrupar tecnología/proyectos).
- `verbatimModuleSyntax`: evita ambigüedad entre imports de tipo y de valor, requerido para que
  los imports `type { X }` se eliminen limpiamente en el bundle final.
- Alias de rutas (`@/components/*`, `@/data/*`, etc.) para evitar cadenas de `../../../` al
  importar entre carpetas profundas.

### 2.3 Dependencias — justificación de cada una

| Paquete | Por qué está |
|---|---|
| `astro` | Framework base. |
| `@astrojs/sitemap` | Genera `sitemap-index.xml` automáticamente a partir de las rutas de `src/pages`, sin mantenerlo a mano. |
| `astro-icon` + `@iconify-json/lucide` | Iconos inline en build-time, cero JS de runtime. |
| `@tailwindcss/vite` + `tailwindcss` | Estilos utility-first, ver §1.3. |
| `motion` | Microinteracciones sin dependencia de React, ver §1.3. |
| `@fontsource-variable/*` | Tipografía autohospedada: sin petición a Google Fonts CDN, sin banner de cookies/CSP adicional, funciona sin conexión, y una sola familia variable sustituye a múltiples pesos estáticos (menos peso total). |
| `@astrojs/check` (dev) | Type-checking de `.astro` en CI (`astro check`), corre antes de cada build. |
| `prettier` + `prettier-plugin-astro` (dev) | Formato consistente en `.astro`, `.ts`, `.css`. |

No se incluyó ningún framework de UI (React/Vue/Svelte) porque ningún componente del sitio
requiere estado interactivo complejo que justifique su costo en bundle — el menú móvil, el
formulario y el scroll-reveal se resuelven con `<script>` vanilla por componente.

---

## 3. Diseño visual y sistema de componentes

### 3.1 Paleta de colores

Definida en `src/styles/global.css` dentro de `@theme`, como dos escalas:

- **`ink-{50..950}`** — fondo/superficie/texto. Gris carbón neutro (sin tinte azul), deliberadamente
  más claro que un negro puro — un dark mode "gris" se percibe menos técnico/agresivo para
  audiencias no desarrolladoras que un negro casi absoluto. `ink-950` (#1a1b1e) es el fondo base;
  `ink-50` (#f8f8f9) es el texto de mayor énfasis (titulares).
- **`brand-{300..700}`** (verde esmeralda) — color de marca primario: headline destacado del Hero,
  CTAs primarios, la mayoría de eyebrows/iconos. `brand-500` (#10b981) es el tono principal.
- **`accent-{300..700}`** (verde azulado / teal) — variación tonal dentro de la familia verde. Ya
  no se usa en ningún componente salvo como tercer color de `.text-gradient-brand`; el rol de
  "profundidad en blobs de fondo" que tenía antes lo cubre ahora `gold-400`.
- **`gold-400`** (`#e3a94a`) — acento secundario aprobado (no de prueba) a partir de una exploración
  de diseño con dos candidatos de dorado y tres tratamientos por candidato ("reemplazo total",
  "acento dual", "solo en CTA"); se eligió acento dual. Vive en: índice/icono/viñetas de
  `ServiceCard`, círculo+línea del timeline de `ProcessSection`, marco de la cara trasera de
  `TeamCard`, y el blob inferior de fondo (Hero/CTASection/body). El verde no se toca en headline ni
  CTA primario en ningún lugar — el dorado es estrictamente secundario, nunca reemplaza al verde
  como color de marca.
- `ember-400` (`#d38434`, naranja) — acento puntual, solo para el label de rol en `TeamCard`. No es
  un acento de marca general.

Esta paleta reemplazó una primera iteración cian/violeta: el cliente pidió alinear el sitio con un
verde esmeralda de referencia, y de paso se aprovechó para quitar el tinte azul del fondo y dejarlo
en un carbón neutro. Poco después se subió la luminosidad de toda la escala `ink` (el fondo pasó de
casi negro a un gris oscuro real) porque el negro casi puro se percibía "demasiado técnico" para una
audiencia de compradores no desarrolladores — ver [§CLAUDE.md](../CLAUDE.md) para el detalle de
por qué. Sigue el mismo espíritu Vercel/Linear/Stripe: superficies oscuras sin
calidez, acentos saturados usados con moderación (nunca como color de fondo grande) y
gradientes sutiles solo en elementos de foco (botón primario, blobs de fondo del Hero).

### 3.2 Tipografía

| Uso | Familia | Variable Tailwind |
|---|---|---|
| Cuerpo de texto | Inter Variable | `font-sans` (default) |
| Titulares (`h1`-`h4`) | Space Grotesk Variable | `font-display` |
| Etiquetas, mono, código, eyebrows | JetBrains Mono Variable | `font-mono` |

Los tres son fuentes variables autohospedadas vía `@fontsource-variable`, importadas directamente
en `global.css`. Se aplican por defecto vía `@layer base` (`body` → `font-sans`,
`h1..h4` → `font-display`), así que ningún componente necesita especificar la familia manualmente.

### 3.3 Espaciado y layout

Tailwind v4 usa una **escala de espaciado dinámica** (`calc(var(--spacing) * N)`): cualquier
utilidad `p-18`, `size-4.5`, `h-18`, etc. se resuelve automáticamente sin necesidad de declarar
cada valor en el theme. El ancho máximo de contenido se centraliza en `--container-page: 80rem`
(clase `max-w-(--container-page)`), usado consistentemente en todas las secciones para que el
contenido nunca se desalinee entre bloques.

### 3.4 Especificación de componentes

| Componente | Ubicación | Responsabilidad |
|---|---|---|
| `Navbar` | `layout/` | Navegación fija con fondo translúcido permanente (`bg-ink-950/75 backdrop-blur-xl`, no depende de scroll), menú móvil accesible (`aria-expanded`), CTA "Hablemos". |
| `Footer` | `layout/` | Logo + enlaces agrupados, copyright dinámico (`new Date().getFullYear()`) — sin párrafo descriptivo ni íconos sociales. |
| `Hero` | `sections/` | Titular + descripción + doble CTA + fondos decorativos (grid + blobs con `animate-drift`). |
| `WhyUs` | `sections/` | "Por qué Siscodex": filas de icono + texto en 2 columnas (sin tarjeta/borde), `title`/`description` opcionales para reutilizar en Home y Nosotros con copy distinto. |
| `ServiceCard` / `ServicesGrid` | `sections/` | Tarjeta de servicio con flip 3D al hacer clic (frente: resumen; reverso: checklist de capacidades) en vez de linkear a una página de detalle — `aria-expanded`/`aria-hidden` sincronizados con el estado, ver `CLAUDE.md` punto 17. |
| `ProcessSection` | `sections/` | Pasos del proceso (`processSteps`, timeline en acento `gold-400`) + fila de capacidades de equipo (`processCapabilities`). |
| `SpecialtiesTabs` | `sections/` | Pestañas de las 5 áreas de especialidad (`src/data/projects.ts`): resumen, capacidades y audiencia (`idealFor`) por área, sin recargar la página. Vive únicamente embebida en el home desde que `/soluciones` se eliminó como página propia (`CLAUDE.md` punto 16). |
| `TeamSection` / `TeamCard` | `sections/` | Grilla de liderazgo con foto real, nombre y rol (acento `ember-400`). Cada tarjeta tiene flip 3D: cara trasera con `roleFull`, resumen y highlights, con `inert` en la cara inactiva y un botón "Cerrar perfil" accesible por teclado — patrón de referencia para cualquier flip nuevo, ver `CLAUDE.md` punto 19. |
| `TechnologyBadge` | `ui/` | Pill con icono + nombre de tecnología, usado en el stack condensado de Home. |
| `TechTile` | `ui/` | Tile de tecnología con logo de marca real (`@iconify-json/logos`), usado en el mosaico de `/tecnologia`. |
| `ContactForm` | `sections/` | Formulario controlado, validación HTML nativa, listo para backend (ver §4.4). |
| `SectionTitle` | `ui/` | Encabezado de sección (`eyebrow` + `title` + `description`), alineación izquierda o centrada. |
| `Button` | `ui/` | Renderiza `<a>` o `<button>` según reciba `href`; variantes `primary`/`secondary`/`ghost`; envuelve `href` en `withBase()`. |
| `StatusPill` | `ui/` | Badge con punto pulsante, usado como "eyebrow" en Hero/PageHeader. |
| `PageHeader` | `sections/` | Cabecera reducida para páginas internas (equivalente a un Hero sin doble CTA). |
| `CTASection` | `sections/` | Bloque de cierre de página con título/descripción/CTA configurables. |
| `SEO` | `seo/` | `<title>`, meta description, canonical, Open Graph, Twitter Card, JSON-LD de Organization. |

### 3.5 Animaciones y microinteracciones

- **Scroll reveal** (`data-reveal` + `src/scripts/reveal.ts`): fade + translateY al entrar en
  viewport, con `inView` de `motion`. Se aplica a tarjetas de servicios y proyectos, filas de
  "Por qué Siscodex" y pasos del proceso.
- **`animate-drift`**: blobs de fondo del Hero con movimiento lento e infinito, vía `@keyframes`
  puro en CSS (no requiere JS — es decorativo y no debe bloquear el hilo principal).
- **`animate-pulse-dot`**: punto de "estado activo" en `StatusPill`, mismo patrón que usan
  Vercel/Linear para transmitir "en vivo".
- **Transiciones de color/borde** en hover (`transition-colors duration-200/300`) en tarjetas y
  enlaces — nunca animaciones de más de 400ms, para que la interfaz se sienta responsiva, no lenta.
- **`<ClientRouter />`** (View Transitions nativas de Astro) en `BaseLayout` para navegación
  fluida entre páginas sin recarga completa, coherente con la sensación "app" de un producto SaaS.

Deliberadamente **no** se usan animaciones de scroll con parallax pesado, ni animaciones que
retrasen la lectura del contenido — el brief pide "sin exceso".

### 3.6 Responsive design

Mobile-first en todos los componentes: las clases base son el layout móvil y los prefijos
`sm:`/`md:`/`lg:` añaden la versión de escritorio (grid de 1 columna → 2 → 3/4, navegación
horizontal oculta bajo `md:`, menú hamburguesa visible solo `< md`). Breakpoints usados (los
defaults de Tailwind, sin sobreescribir): `sm` 40rem, `md` 48rem, `lg` 64rem, `xl` 80rem.

---

## 4. Contenido y páginas

| Ruta | Objetivo | Secciones principales |
|---|---|---|
| `/` | Conversión: que un decisor técnico/de negocio agende contacto. | Hero, Por qué Siscodex, Servicios (completo, flip cards), Proceso, Soluciones (pestañas), Tecnología (badges + CTA a `/tecnologia`), CTA final |
| `/servicios`, `/soluciones` | *(eliminadas, ver `CLAUDE.md` punto 16)* Redirigen a `/#servicios` y `/#soluciones` — su contenido vive en `/`. | — |
| `/tecnologia` | Credibilidad técnica ante equipos de ingeniería del cliente. | PageHeader, mosaico de logos reales agrupado por categoría, CTA |
| `/nosotros` | Confianza: quién construye el software. | PageHeader, equipo de liderazgo (fotos reales, flip cards), valores, Por qué Siscodex (misión), cita de cierre, CTA |
| `/contacto` | Conversión directa. | PageHeader, formulario completo |
| `/recursos` | Punto de entrada de documentación para clientes activos. | PageHeader, grilla de recursos, CTA de soporte |
| `/recursos/*` | Documentación operativa (onboarding, docs de API, SLA, seguridad). | `noindex` — no es contenido de adquisición |
| `/legal/*` | Privacidad y términos. | — |
| `/404` | Recuperación de navegación rota. | Mensaje + CTAs de vuelta |

El nav superior (`src/data/navigation.ts`) refleja esta misma división: `mainNavAnchors` (Inicio,
Servicios, Soluciones) son anclas al home; `mainNavPages` (Recursos, Tecnología, Nosotros) son
páginas propias con ruta.

### 4.1 Tono de contenido

Los textos usan lenguaje directo orientado a quien **contrata** desarrollo (no a quien busca
empleo): se habla de resultados de negocio ("reducción de costos", "escalabilidad real"), se
evita jerga interna sin explicar el beneficio, y cada CTA es una acción concreta ("Hablemos de tu
proyecto", "Agendar una consulta") en vez de genérica ("Enviar").

### 4.2 Datos estructurados como contenido

`src/data/services.ts`, `projects.ts`, `technologies.ts`, `team.ts` y `navigation.ts` son la única
fuente de verdad de contenido dinámico. Actualizar un servicio, una especialidad o reordenar la
navegación es un cambio de datos, no de componente — reduce el riesgo de romper el diseño al
actualizar contenido.

### 4.3 Especialidades — taxonomía fija, no casos de cliente

`src/data/projects.ts` (nombre de archivo heredado del scaffold inicial; el tipo se llama
`Project` pero representa una **especialidad**, no un caso de cliente) define las 5 áreas reales
de Siscodex: Cloud & Infraestructura, Inteligencia Artificial, Aplicaciones Móviles, Desarrollo Web
y Salud Digital. Deliberadamente no incluye métricas ni nombres de cliente inventados — cada
entrada tiene `summary`, `capabilities` (qué incluye) e `idealFor` (a qué tipo de organización le
sirve, p. ej. "Clínicas y centros médicos"), consumidas por `SpecialtiesTabs.astro`. El caso real
del sector salud (una plataforma para un banco digital de tejidos) se generaliza a propósito en
`summary`/`capabilities` ("aplicaciones web médicas", telemedicina) sin nombrar al cliente — ver
`CLAUDE.md` punto 15. Añadir una especialidad nueva es una entrada más en el array, sin cambios de
componente, siempre que respete la interfaz `Project` en `src/types/index.ts`.

### 4.4 Formulario de contacto — listo para backend

`ContactForm.astro` es funcional en el navegador (validación HTML5, estado de envío) pero **no
envía datos a ningún servidor todavía** — el `submit` handler en su `<script>` hace
`preventDefault()` y muestra un mensaje de confirmación local. Está marcado con un comentario
`TODO` explícito señalando dónde conectar un backend real (endpoint propio, AWS Lambda, o un
servicio como Formspree), y `PUBLIC_CONTACT_ENDPOINT` ya existe en `.env.example` para esa
integración futura.

---

## 5. SEO y metadata

### 5.1 Componente `<SEO />`

Cada página pasa `title`, `description`, `path` (y opcionalmente `image`/`noindex`) a
`BaseLayout`, que los reenvía a `<SEO />`. Este componente centraliza:

- `<title>` con sufijo de marca consistente (`pageTitle()` en `utils/seo.ts`).
- `meta description` único por página.
- `<link rel="canonical">` absoluto, calculado con `canonicalUrl()`.
- Open Graph completo (`og:title`, `og:description`, `og:image`, `og:url`, `og:locale`).
- Twitter Card (`summary_large_image`).
- JSON-LD de `Organization` (nombre, URL, logo, punto de contacto) en **todas** las páginas —
  refuerza la entidad "Siscodex" ante buscadores independientemente de en qué página aterrice el
  crawler.

### 5.2 Recomendaciones de título/descripción por página

| Página | `<title>` renderizado | Descripción (elevator pitch) |
|---|---|---|
| Home | Siscodex | Estudio de ingeniería de software: desarrollo a medida, cloud e IA — incluye servicios y soluciones completos. |
| Tecnología | Tecnología · Siscodex | Stack por categoría. |
| Nosotros | Nosotros · Siscodex | Propuesta de valor del equipo. |
| Contacto | Contacto · Siscodex | Invitación a agendar conversación técnica. |

`/servicios` y `/soluciones` ya no son páginas indexables — son redirects `noindex` a anclas del
home (ver `redirects` en [§2.1](#21-astroconfigmjs)).

Cada `description` en el código ya sigue este patrón (ver el prop `description` de cada
`BaseLayout` en `src/pages/*.astro`) — no requiere reescritura antes de publicar.

### 5.3 Sitemap y robots.txt

`@astrojs/sitemap` genera `sitemap-index.xml` automáticamente en cada build a partir de las
páginas reales — no se mantiene a mano y nunca queda desincronizado. `public/robots.txt` permite
todo el rastreo salvo `/recursos/*` (subpáginas de documentación operativa, marcadas también
`noindex` en su `<meta>` por defensa en profundidad) y referencia el sitemap explícitamente.

### 5.4 Pendiente antes de lanzamiento

`public/og/default.svg` es un placeholder generado por código (gradiente + logo + texto). Twitter/X
no renderiza SVG en `og:image` (sí lo hacen LinkedIn/Slack) — antes de publicar, sustituir por un
PNG/JPG de 1200×630 diseñado por el equipo de marca, manteniendo la misma ruta o actualizando
`DEFAULT_OG_IMAGE` en `src/utils/seo.ts`.

---

## 6. Performance y optimización

### 6.1 Objetivos Lighthouse

| Métrica | Objetivo |
|---|---|
| Performance | 95+ |
| Accessibility | 95+ |
| Best Practices | 100 |
| SEO | 100 |

### 6.2 Cómo se alcanzan

- **Cero JS por defecto**: al ser un sitio 100% estático sin islas de framework, el HTML inicial
  no depende de hidratación. El único JS que se envía es específico por componente (menú, form,
  scroll-reveal) e inline/pequeño.
- **Fuentes autohospedadas y variables**: elimina el round-trip a `fonts.googleapis.com` y evita
  cargar pesos estáticos duplicados (una sola fuente variable cubre todo el rango de `font-weight`
  usado).
- **Iconos SVG inline en build-time** (`astro-icon`): sin request de red ni parseo de JS para
  renderizar un icono.
- **`compressHTML: true`** y `build.inlineStylesheets: "auto"` en `astro.config.mjs`: HTML
  minificado y CSS crítico inline cuando es pequeño, reduciendo requests bloqueantes.
- **`prefetch` en viewport**: las páginas enlazadas se precargan antes de que el usuario haga clic,
  bajando el TTFB percibido en la navegación interna a casi cero.
- **Imágenes**: el sitio actual no usa fotografías (deliberado, ver §6.4); los pocos gráficos son
  SVG vectorial, que escala sin peso adicional en ninguna resolución/densidad de pantalla. Si se
  añaden fotografías de proyectos reales, usar `astro:assets` (`<Image />`) para optimización y
  `lazy loading` automáticos — ya viene incluido en el core de Astro, sin dependencia adicional.

### 6.3 Accesibilidad (WCAG)

- Contraste de texto verificado contra los fondos `ink-950`/`ink-900`/`ink-800` (la paleta se
  diseñó con AA como mínimo para texto de cuerpo).
- Navegación por teclado: `:focus-visible` con outline visible en todo elemento interactivo
  (definido globalmente en `global.css`, no por componente).
- `aria-expanded`/`aria-controls` en el toggle del menú móvil; `aria-current="page"` en el enlace
  de navegación activo — comparando solo la parte de ruta del `href` (antes del `#`), nunca el
  `href` completo contra `location.pathname`: un `href` con ancla (`/#servicios`) nunca es igual a
  un pathname, así que compararlos completos deja el enlace "activo" roto en silencio.
- **Patrón de flip 3D accesible** (`ServiceCard`, `TeamCard`): el control que gira expone
  `aria-expanded`; la cara inactiva se marca `aria-hidden` y, si contiene elementos enfocables
  (links, botones), además `inert` — `backface-visibility: hidden` solo oculta visualmente, no saca
  nada del tab order ni del árbol de accesibilidad por sí solo. Un contenedor interactivo (`div
  role="button"`) nunca debe envolver otros elementos interactivos reales (`<a>`, `<button>`) —
  semántica ARIA anidada inválida; si hace falta un control de cierre por teclado, usar un
  `<button>` real (puede estar visualmente oculto con `sr-only focus:not-sr-only`). Replicar este
  patrón en cualquier componente nuevo con dos caras/estados alternables.
- Formulario con `<label for>` explícito en cada campo, nunca solo `placeholder` como etiqueta.
- `prefers-reduced-motion` — pendiente de verificación manual antes de lanzamiento: las animaciones
  actuales son sutiles (opacidad/translate ≤16px, blobs decorativos), pero se recomienda envolver
  `initScrollReveal` en una comprobación de `matchMedia("(prefers-reduced-motion: reduce)")` si se
  añaden animaciones más notorias en el futuro.

### 6.4 Fotografía: sin stock genérico, sí fotos reales de liderazgo

El brief pide explícitamente evitar "imágenes genéricas de personas trabajando" (stock de bancos de
imágenes). El sitio sigue sin ese tipo de fotografía en Hero, servicios o especialidades — ahí se
usan elementos gráficos abstractos (grid pattern, blobs de gradiente, iconografía técnica). La
única excepción, deliberada, es la sección de equipo en `/nosotros` (`TeamSection`/`TeamCard`),
que usa las 3 fotos reales de los líderes vigentes (`public/team/*.jpeg`) precisamente porque ahí el
objetivo es transparencia ("con quién estás hablando"), no ambientación — es lo opuesto al stock
genérico que el brief pedía evitar.

---

## 7. Deployment

El sitio compila a HTML/CSS/JS 100% estático (`output: "static"`), por lo que **cualquier** CDN o
host estático funciona sin adaptador de Astro. Solo cambia el mecanismo de build/publish.

### 7.1 GitHub Pages

Configurado y funcional out-of-the-box vía `.github/workflows/deploy.yml`:

1. En GitHub → Settings → Pages, seleccionar **"GitHub Actions"** como fuente.
2. Con dominio propio (`siscodex.com`, ya declarado en `public/CNAME`): no tocar nada, `base`
   permanece en `/`. Apuntar el DNS del dominio a GitHub Pages (registro `A`/`ALIAS` según la
   documentación de GitHub) y añadir el dominio en Settings → Pages → Custom domain.
3. Sin dominio propio (GitHub Pages de proyecto, `usuario.github.io/fe_sscdx`): eliminar
   `public/CNAME` y definir `PUBLIC_BASE_PATH: /fe_sscdx` en el step "Type-check y build" del
   workflow.
4. Cada push a `master` (la rama por defecto de este repo) dispara el build y despliega
   automáticamente.

### 7.2 Vercel

1. Importar el repositorio en Vercel — el framework preset "Astro" se detecta automáticamente
   (build command `npm run build`, output `dist`). No requiere configuración adicional.
2. Definir `PUBLIC_BASE_PATH=/` (o dejarlo sin definir; el default en `astro.config.mjs` ya es
   `/`) y, cuando exista, `PUBLIC_CONTACT_ENDPOINT` en Environment Variables.
3. Cada push a la rama configurada genera un deployment; los PRs obtienen preview URLs
   automáticas.

### 7.3 Netlify

1. `netlify.toml` en la raíz ya define `command = "npm run build"` y `publish = "dist"` — importar
   el repo en Netlify y desplegar sin configuración manual.
2. Variables de entorno (si aplica) se definen en Site settings → Environment variables, mismas
   claves que en `.env.example`.

### 7.4 AWS (S3 + CloudFront)

1. `npm run build` genera `dist/`.
2. Subir el contenido de `dist/` a un bucket S3 configurado para hosting estático (o como origen
   privado de CloudFront con Origin Access Control — recomendado sobre hosting público de S3).
3. Configurar CloudFront con el bucket como origen, `index.html` como *default root object*, y una
   *custom error response* 404 → `/404.html` con código de estado `404` (Astro genera `404.html`
   automáticamente a partir de `src/pages/404.astro`).
4. Certificado TLS del dominio vía ACM (región `us-east-1`, requisito de CloudFront) y registro
   DNS del dominio apuntando al distribution de CloudFront.
5. Para CI/CD, un workflow adicional de GitHub Actions con `aws-actions/configure-aws-credentials`
   + `aws s3 sync dist/ s3://bucket --delete` + invalidación de CloudFront
   (`aws cloudfront create-invalidation`) es la extensión natural de `deploy.yml` — no incluido por
   defecto porque requiere credenciales/ARNs específicos de la cuenta de AWS del cliente.

### 7.5 Variables de entorno

Ver `.env.example` — actualmente ninguna es obligatoria para build o dev (el sitio no tiene
backend todavía). `PUBLIC_BASE_PATH` y `PUBLIC_CONTACT_ENDPOINT` están declaradas para cuando se
necesiten, siguiendo la convención de Astro de exponer al cliente solo variables con prefijo
`PUBLIC_`.

---

## 8. Buenas prácticas

### 8.1 TypeScript

- `strict: true` sin excepciones locales (`@ts-ignore`) salvo casos documentados.
- Tipos de dominio centralizados en `src/types/index.ts` — un componente nunca redefine su propio
  tipo `Service`/`Project` local.
- Props de componente siempre vía `interface Props`, nunca `any` ni `Record<string, unknown>`.

### 8.2 Commits y versionado

- Mensajes de commit en modo imperativo, explicando el *por qué* cuando no es obvio
  (`git log` de este repo sigue ese patrón desde el commit inicial).
- Sin commits directos a `master` en equipo: todo cambio vía Pull Request, que dispara `ci.yml`
  (type-check + build) antes de poder mergear.
- Versionado semántico recomendado si el sitio evoluciona a librería de componentes interna
  (no aplica todavía — es un único sitio, no un paquete publicado).

### 8.3 Testing — estructura recomendada

El proyecto no incluye tests automatizados en esta primera entrega porque no hay lógica de
negocio no trivial que testear (es contenido estático + un formulario sin backend). Cuando se
integre el backend del formulario o se añada lógica (p. ej. filtrado de proyectos, validación
compleja), la estructura recomendada es:

- **Unit**: [Vitest](https://vitest.dev) para funciones puras de `src/utils/` (`seo.ts` y
  las que se añadan).
- **Component/E2E**: [Playwright](https://playwright.dev) para flujos críticos (envío de
  formulario, navegación del menú móvil, enlaces del footer) — se integra de forma nativa con
  `astro preview` en CI.
- Ubicación sugerida: `tests/unit/*.test.ts` y `tests/e2e/*.spec.ts`, ejecutados como job
  adicional en `ci.yml`.

### 8.4 Mantenibilidad y escalabilidad

- Añadir una página nueva no requiere tocar `BaseLayout` ni `Navbar` salvo que deba aparecer en la
  navegación (en cuyo caso, un único cambio en `src/data/navigation.ts`).
- Añadir un servicio/proyecto/tecnología nuevo es una entrada más en el array correspondiente de
  `src/data/` — cero cambios de componente si respeta la interfaz de `src/types/index.ts`.
- Si el volumen de contenido crece (blog técnico, más de ~15 proyectos), migrar `src/data/*.ts` a
  **Content Collections** de Astro es el siguiente paso natural, sin reescribir componentes de
  presentación.
