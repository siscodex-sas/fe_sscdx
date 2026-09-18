# CLAUDE.md

Guía de orientación rápida para retomar este proyecto desde cualquier sesión. Para el detalle
profundo (arquitectura, SEO, performance, deployment paso a paso) ver
[`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — este archivo es el resumen operativo, no lo
duplica.

## Qué es esto

Sitio web corporativo de **Siscodex** (siscodex.com): estudio de ingeniería de software
(desarrollo a medida, cloud, IA). Astro 7 + TypeScript estricto + Tailwind CSS v4, 100% estático,
sin backend todavía. Inspiración visual: Vercel/Linear/Stripe.

## Comandos

```bash
npm install
npm run dev       # http://localhost:4321
npm run build     # astro check + build de producción en dist/
npm run preview   # sirve dist/ localmente
npm run check     # solo type-check
```

Si `npm install` falla con un ERESOLVE por `typescript`: `@astrojs/check` todavía no soporta
TypeScript 7.x — mantener `typescript` en `^6.x` en `package.json` (ver historial de este archivo
si vuelve a pasar).

## Mapa del proyecto

```
src/
├── components/
│   ├── ui/        → átomos sin conocimiento de negocio (Button, SectionTitle, TechnologyBadge, TechTile, StatusPill)
│   ├── sections/   → bloques de página (Hero, ServiceCard, SpecialtiesTabs, TeamSection, TeamCard, ContactForm, CTASection...)
│   ├── layout/     → Navbar, Footer (en todas las páginas)
│   └── seo/        → <SEO /> (metadata, OG, JSON-LD)
├── data/           → contenido tipado: services.ts, projects.ts, technologies.ts, team.ts, navigation.ts
├── i18n/           → ui.ts (diccionario ES/EN), utils.ts (t(), localizedHref(), alternateUrls()), types.ts (Locale)
├── layouts/        → BaseLayout (páginas normales), SimpleContentLayout (legal/recursos)
├── pages/          → rutas (file-based routing de Astro) — en/ espeja cada página en inglés
├── scripts/        → reveal.ts (scroll-reveal con la librería "motion")
├── styles/         → global.css — AQUÍ VIVE TODO EL SISTEMA DE COLOR/TIPOGRAFÍA (@theme de Tailwind v4)
├── types/          → contratos de datos (Service, Project, Technology...)
└── utils/          → seo.ts (título, canonical, OG)
```

**Regla de oro**: nunca hardcodear un color hex dentro de un componente `.astro`. Todo pasa por
los tokens de `src/styles/global.css` (`ink-*`, `brand-*`, `accent-*`). Cambiar la marca completa
es, en teoría, un cambio de un solo archivo — así se hizo el rebrand de cian/violeta a verde (ver
"Historial de decisiones" abajo). Las únicas excepciones legítimas son archivos que Tailwind no
procesa: `public/favicon.svg`, `public/og/default.svg` y el `theme-color` en `BaseLayout.astro` —
si cambia la paleta, esos tres hay que tocarlos a mano.

**Segunda regla de oro**: cualquier `href`/`src` interno que empiece con `/` (rutas de página,
`/logo.png`, `/favicon.svg`) **debe** pasar por `withBase()` de `src/utils/url.ts`. `Button.astro`
ya lo aplica internamente, así que todo lo que use `<Button href="...">` está cubierto gratis —
pero un `<a href="/algo">` o `<img src="/algo">` escrito a mano, no. Si no se envuelve, el link
funciona en local y en producción con dominio propio (`base: "/"`), pero se rompe apenas alguien
prueba en un GitHub Pages de proyecto (`base: "/fe_sscdx"`) — es exactamente el bug que se encontró
y arregló la primera vez que se probó ahí (ver punto 7 de "Historial de decisiones").

**Tercera regla de oro (i18n)**: si el href es de una *página* (no un asset como `/logo.png`),
`withBase()` solo no alcanza — hay que componerlo con `localizedHref()` de `src/i18n/utils.ts`:
`withBase(localizedHref(path, locale))`. `Button.astro` ya lo hace internamente (igual que con
`withBase()`), así que `<Button href="/contacto">` funciona solo en ambos idiomas — pero un
`<a href="/algo">` escrito a mano necesita el envoltorio manual. Ver "Internacionalización" abajo.

**Cuarta regla de oro (modo claro)**: desde que existe modo claro (ver abajo), casi todos los
tokens de color (`ink-*`, `brand-*`, `accent-*`, `gold-400`, `danger-400`) **cambian de valor**
según el tema — así que un componente nunca debe asumir que `ink-950` es "oscuro" o que `ink-50`
es "claro" en un sentido absoluto, solo en el sentido relativo de "fondo de página" / "texto más
legible". Si de verdad se necesita un color que **no** cambie con el tema (texto sobre un fill
saturado, un scrim sobre una foto), usar `--color-fixed-dark` (`text-fixed-dark`,
`from-fixed-dark`...) en vez de `ink-950` — es el único token que no se redefine en modo claro. Ver
"Modo claro" abajo para el resto de la arquitectura.

## Sistema de diseño actual (estado real, septiembre 2026)

- **Acento primario: verde esmeralda. Acento secundario aprobado: dorado.** `brand-500 #10b981` /
  `brand-400 #34d399` sigue siendo el tono principal (headline destacado del Hero, CTAs primarios,
  la mayoría de iconos/eyebrows). `gold-400 #e3a94a` es un acento secundario real (no de prueba)
  aprobado a partir de una exploración de diseño con dos candidatos (`#E3A94A` vs `#D9A15C`) y tres
  tratamientos por candidato — se eligió "acento dual": el verde no se toca en headline/CTA
  primario, y el dorado vive en el índice/icono/viñetas de `ServiceCard`, el círculo+línea del
  timeline de `ProcessSection`, el marco de la cara trasera de `TeamCard`, y el blob inferior de
  fondo del Hero/CTASection/body (antes era `accent-500`, teal). `accent-*` sigue existiendo en el
  theme pero ya no se usa en ningún componente salvo como tercer color de `.text-gradient-brand` —
  no confundir con el nuevo `gold-400`, son acentos distintos con roles distintos. Existe además
  `ember-400 #d38434` (naranja), usado solo como color del label de rol en `TeamCard.astro` — no es
  un acento de marca general, no se usa en botones ni CTAs.
- **Fondo: gris carbón, no negro puro.** `ink-950 #1a1b1e` → `ink-50 #f8f8f9`. Se subió a
  propósito desde un casi-negro (`#0b0c0e`) porque se sentía "demasiado técnico/hacker" para
  audiencia no desarrolladora — ver punto 6 de "Historial de decisiones". Si alguien propone
  oscurecer el fondo otra vez, primero confirmar con el cliente: ya se probó y se descartó.
- **Tipografía**: Space Grotesk (display) / Inter (body) / JetBrains Mono (labels/mono), variables
  autohospedadas vía `@fontsource-variable`, sin CDN de Google Fonts.
- **Radios**: `--radius-md: 0.625rem` es el valor por defecto en tarjetas y botones.
- Tailwind v4 usa configuración **CSS-first** (`@theme` en `global.css`) — no existe
  `tailwind.config.ts` a propósito; ver justificación en `docs/ARCHITECTURE.md` §1.3.

### "Por qué Siscodex" (WhyUs.astro)

Es **filas simples de icono + texto en 2 columnas, sin tarjeta ni borde** — no una grilla de
tarjetas. Si alguna vez se ve una versión con `border`/`bg` ahí, es una regresión: se cambió a
propósito para igualar una referencia visual real que compartió el cliente.

## Internacionalización (i18n)

El sitio es español por defecto (sin prefijo, `/nosotros`) con inglés bajo `/en/` con los
**mismos slugs** (`/en/nosotros`, no `/en/about-us` — decisión explícita del cliente: más simple,
sin tabla de equivalencias de slugs). Usa el routing i18n nativo de Astro (`i18n` en
`astro.config.mjs`, `defaultLocale: "es"`, `prefixDefaultLocale: false`).

- **`src/i18n/ui.ts`**: diccionario `{ es: {...}, en: {...} }` de strings de UI *reutilizables*
  (nav, footer, formulario de contacto, defaults de secciones compartidas, aria-labels). `const t
  = useTranslations(locale)` en el frontmatter, luego `{t("clave")}`.
- **Copy propio de cada página NO va en el diccionario** — títulos, `PageHeader`, arrays inline
  (`values` en nosotros.astro), la prosa de legal/recursos, se escriben directamente traducidos en
  el archivo `en/*.astro` correspondiente. Solo lo que se *reutiliza* entre varios archivos vive en
  `ui.ts` — si algo solo se usa una vez, indirectarlo por una clave es ruido, no ayuda.
- **`src/data/{services,projects,technologies,team,navigation}.ts`**: cada campo traducible es
  `{ es: "...", en: "..." }` en una estructura `*Source` interna; el archivo exporta una función
  `getServices(locale)` / `getProjects(locale)` / etc. que devuelve el shape localizado de siempre
  (`Service[]`, `Project[]`...) — los componentes que ya consumían el array directamente solo
  cambian a llamar la función con `Astro.currentLocale`. Los nombres de tecnología
  (`technologies.ts` → `technologies`, sin función) **no se traducen** — son nombres propios.
- **`Astro.currentLocale`** está disponible en cualquier `.astro` sin pasarlo por props — patrón
  usado en todos partes: `const locale = (Astro.currentLocale as Locale | undefined) ?? DEFAULT_LOCALE;`.
- **`ContactForm.astro`**: el `<script>` de validación es inline, así que las strings traducidas
  (mensajes de error, estado de envío) se inyectan con `<script define:vars={{ i18n: {...} }}>`
  (mecanismo oficial de Astro para pasar valores server-computed a un script de cliente) — el
  script las lee de `i18n.required`, etc., en vez de tener strings literales.
- **`LanguageSwitcher.astro`** (pastilla dorada en el Navbar, "EN"/"ES"): es un `<a href>` normal,
  sin JS — calcula la URL equivalente en el otro idioma con `alternateUrls()`/`localizedHref()` de
  `src/i18n/utils.ts`. Al no tener estado de cliente, no hay riesgo de bug de View Transitions
  (contraste con el bug del punto 14 de abajo). Recibe `pagePath` como prop desde `BaseLayout` →
  `Navbar` (la ruta canónica de la página, la misma que ya se pasaba a `SEO.astro`).
- **`404.astro` no tiene versión `/en/`** a propósito: GitHub Pages sirve un único `404.html` en la
  raíz del sitio para cualquier ruta rota, sin importar el idioma de la URL — un `en/404.astro`
  sería inalcanzable en producción.
- **SEO**: `SEO.astro` agrega `<link rel="alternate" hreflang="es|en|x-default">` (vía
  `alternateUrls()`) y `og:locale` dinámico (`es_ES`/`en_US`); `BaseLayout.astro` pone
  `<html lang={locale}>` dinámico. El sitemap (`@astrojs/sitemap`) incluye automáticamente las 22
  URLs (11 páginas × 2 idiomas) sin config extra — **no** genera anotaciones `xhtml:link` de
  alternates dentro del sitemap (solo en el `<head>` de cada página vía `SEO.astro`), que es
  suficiente para Google/Bing.
- **Ver punto 21** de "Historial de decisiones" para el detalle completo de cómo se implementó.

## Modo claro

El sitio nació solo-oscuro (ver "Fondo: gris carbón" arriba); el modo claro se agregó después como
alternativa **opcional**, con el oscuro como tema por defecto — no auto-detecta
`prefers-color-scheme`, respeta lo que el visitante elija con la pastilla sol/luna del Navbar (o
oscuro, la primera vez). Paleta aprobada: dirección "Paper" (neutro cálido, no blanco/gris frío
puro) de una exploración con 3 direcciones + 5 tratamientos de ícono en un Artifact — ver punto 22.

- **Cómo funciona técnicamente**: los MISMOS tokens de `@theme` (`ink-*`, `brand-*`, `accent-*`,
  `gold-400`, `danger-400`) se redefinen bajo `:root[data-theme="light"]` en `global.css` — como
  toda la app ya consume estos tokens vía clases de Tailwind (que a su vez usan `var(--color-x)`),
  cambiar de tema es *solo* cambiar el atributo `data-theme` de `<html>`, sin tocar ningún
  componente. `ember-400` es la única excepción real que **no** se redefine (ver el punto siguiente).
- **`--color-fixed-dark`** (nuevo, en `@theme`, nunca redefinido bajo `[data-theme="light"]`): para
  los pocos lugares donde el color debe quedarse oscuro sin importar el tema, porque el contraste
  que protege no depende del tema de la página — el texto del botón primario sobre `bg-brand-400`
  (`Button.astro`), y el scrim + nombre sobre la foto en la cara frontal de `TeamCard`. Si se
  encuentra otro `text-ink-950`/`bg-ink-950` que en realidad significaba "quiero que esto se vea
  oscuro siempre", es candidato a este token, no a `ink-950` (que ahora sí cambia con el tema).
- **`TeamCard`**: la cara trasera (`bg-ink-900`, sin foto) sí invierte normal — pero sus botones de
  redes sociales usaban `bg-white/5 text-white` a mano, que se veían invisibles sobre un fondo claro;
  se cambiaron a `bg-ink-50/5 text-ink-50` (mismo patrón que el resto del sitio: el texto "más
  legible" es `ink-50`, sea cual sea su valor en el tema activo). El label de rol de esa misma cara
  pasó de `ember-400` a `gold-400` por la misma razón (`ember-400` no invierte, se quedaría naranja
  claro sobre fondo claro con mal contraste; `gold-400` si invierte).
- **`src/scripts/theme.ts`**: `getStoredTheme()`/`setStoredTheme()` (persistencia en
  `localStorage`, clave `siscodex:theme`), `applyTheme()` (pone `data-theme` en `<html>` + actualiza
  `<meta name="theme-color">`, que no puede leer variables CSS — tocar a mano si cambia la paleta,
  igual que las otras excepciones de la "Regla de oro"), e `initThemePersistence()`.
- **Sin parpadeo en la carga inicial**: `BaseLayout.astro` tiene un `<script is:inline>` bloqueante
  al principio del `<head>` (antes de cualquier CSS) que lee `localStorage` y fija `data-theme`
  antes del primer paint — no puede importar `theme.ts` (un script inline no procesa imports), así
  que repite esa lógica mínima a mano.
- **Sin parpadeo entre navegaciones (View Transitions)**: como `data-theme` solo existe en el
  cliente, `swapRootAttributes()` lo borraría en cada navegación con `<ClientRouter />` (la página
  nueva no lo trae). `initThemePersistence()` lo reaplica dentro de `astro:before-swap`,
  envolviendo el `swap()` por defecto — igual que `LanguageSwitcher.astro` con el scroll (ver punto
  14): si se hiciera en `astro:after-swap` (después de la foto para el crossfade), se alcanzaría a
  ver un parpadeo del tema equivocado. Mismo patrón, mismo motivo, dos usos distintos.
- **`ThemeToggle.astro`** (junto a `LanguageSwitcher` en el Navbar): un solo `<button role="switch">`
  — todo el pill es clickeable (no hace falta acertarle al ícono de sol/luna), con `cursor-pointer`
  y un thumb (`<span>` absoluto) que se desliza con `translate-x-7` + transición de 300ms entre las
  dos posiciones; los íconos sol/luna son decorativos (`aria-hidden`), colorean vía
  `group-data-[state=...]` según el `data-state` del botón padre. `aria-label`/`aria-checked` se
  recalculan en cada click (`theme.switchToLight`/`theme.switchToDark` en `ui.ts`, frase de acción
  — "a qué cambia", no "qué es"). Sí necesita JS (a diferencia de `LanguageSwitcher`, esto no navega
  a ninguna URL, solo cambia un atributo). Delegación de clics sobre `document`, mismo patrón que el
  resto del sitio.
- **`public/logo.png` en modo claro**: es un PNG rasterizado con letras casi blancas sobre
  transparente (ver punto 4 de "Historial de decisiones") pensado para el fondo oscuro original —
  Tailwind no lo procesa, así que ningún token de color lo cubre (misma familia de excepción que
  `favicon.svg`/`og/default.svg` en la "Regla de oro"). Sobre el fondo "Paper" claro quedaba casi
  invisible. Se resolvió con un filtro CSS en vez de generar un segundo asset: clase `site-logo` en
  el `<img>` (Navbar y Footer) + `html[data-theme="light"] .site-logo { filter: invert(1); }` en
  `global.css` — invierte el blanco a negro solo en modo claro. Si se usa el logo en un lugar nuevo,
  aplicarle la misma clase `site-logo`.

## Historial de decisiones (para no repetir trabajo ni confundirse con git blame)

1. **V1 — "Aurora"**: paleta cian (`#3cd3ea`) + violeta (`#8564ef`) sobre negro-azulado, doble
   acento. Fue la primera versión implementada.
2. **V2 — "Canopy" (actual)**: el cliente compartió una captura de referencia con un solo acento
   verde esmeralda sobre fondo carbón neutro. Se migró todo el sistema de tokens de cian/violeta a
   verde/verde-azulado, se neutralizó el tinte azul del fondo, se cambió "Por qué Siscodex" de
   tarjetas a filas simples, y la línea conectora de `ProcessSection` pasó de gris neutro a verde.
   **Esta es la versión que está desplegada hoy.**
3. Se exploraron **7 direcciones visuales** completas (incluyendo Aurora, Canopy, y variantes tipo
   "registro dev-tool", "enterprise/serif", "producto/energía", más una fiel al HTML de Stitch
   original del cliente) en un Artifact de comparación fuera del repo — si el cliente pide "otra
   opción de color", ya existe ese trabajo de exploración, solo falta que Claude lo regenere si no
   se conserva el enlace.
4. El logo real (`public/logo.png`) vino como PNG con mucho padding transparente (707×353, el
   contenido visible ocupaba solo 549×46) — se recortó a 565×62. Si el logo se ve "perdido" o
   minúsculo en algún lugar nuevo donde se use, es casi seguro el mismo problema: medir el
   bounding box de píxeles no transparentes antes de asumir que `h-N` alcanza.
5. El Navbar tenía un bug donde el fondo era transparente hasta hacer scroll (`scrollY > 8`),
   dejando el contenido del Hero visualmente superpuesto con el menú en la carga inicial. Se
   corrigió haciendo el fondo translúcido (`bg-ink-950/75 backdrop-blur-xl`) permanente — el scroll
   ahora solo añade una sombra sutil. Si se reintroduce un navbar "transparente al inicio", revisar
   que el `Hero` tenga suficiente `padding-top` y que el fondo no dependa de JS para aparecer.
6. **V3 — se aclaró el fondo (mismo día que V2)**: con Canopy ya implementado, el cliente vio el
   sitio real y dio feedback de que se sentía "demasiado tech" y podía alejar a compradores no
   técnicos — específicamente el fondo casi negro. Se subió toda la escala `ink` de un casi-negro
   (`ink-950 #0b0c0e`) a un gris carbón real (`ink-950 #1a1b1e`), manteniendo los mismos pasos
   relativos de la escala. Sigue siendo dark mode, solo que se lee como "gris", no "negro". Si se
   toca el fondo de nuevo, este es el motivo — no es un tema de contraste/accesibilidad, es
   percepción de marca ante audiencia no técnica.
7. **Primer deploy real a GitHub Pages (repo se hizo público)**: Pages para repos privados requiere
   plan de pago, así que el repo se hizo público (se auditó todo el historial de commits antes —
   sin secretos). Al probar en `siscodex.github.io/fe_sscdx` con `PUBLIC_BASE_PATH: /fe_sscdx`
   aparecieron dos bugs reales: (a) los assets de Vite sí llevaban el prefijo automáticamente, pero
   (b) **todo `href`/`src` interno escrito a mano en el markup no** — nav, footer, logo, favicon,
   sitemap. Se creó `src/utils/url.ts` (`withBase()`) y se aplicó en `Button.astro` + cada `<a>`/
   `<img>` interno suelto. Ver la "Segunda regla de oro" arriba.
8. **Sección de Equipo**: se agregó `TeamSection`/`TeamCard` en `/nosotros` con las 3 fotos reales de
   liderazgo vigentes (`public/team/*.jpeg`: Fherney, Duban, Juan — un cuarto perfil, Javier Pancha,
   se agregó y luego se quitó en ramas paralelas; si vuelve a aparecer en algún merge, confirmar con
   el cliente antes de darlo por bueno). Título/descripción se redactaron a propósito para no insinuar
   que la empresa son solo estas personas ("Hablas con el liderazgo desde el primer día — respaldado
   por un equipo completo detrás de cada proyecto"). Introdujo el acento `ember-400` (ver arriba).
9. **Soluciones pasó de grilla a pestañas, y de "stack técnico" a "para quién es esto"**: se
   eliminaron `ProjectsGrid`/`ProjectCard` (mostraban las 5 especialidades como tarjetas fijas) y se
   reemplazaron por `SpecialtiesTabs.astro` (pestañas, una especialidad visible a la vez, sin
   navegación extra). El campo `technologies` de `Project` (`src/types/index.ts`) se renombró a
   `idealFor`: ya no es una lista de tecnologías, es una lista de tipos de organización a los que
   sirve esa especialidad (p. ej. "Clínicas y centros médicos") — se decidió así porque mostrar
   stack técnico ahí no le decía nada útil a un cliente no técnico sobre si el área le aplica.
10. **Mosaico de tecnología con logos reales**: `/tecnologia` pasó de un listado con nombre/letra por
    tecnología a un mosaico por categoría (`TechTile.astro`) que usa los logos de marca reales vía
    `@iconify-json/logos` (slugs siempre verificados leyendo `icons.json` del paquete instalado,
    nunca de memoria). Categorías vigentes: frontend, backend, cloud, aplicaciones móviles,
    desarrollo 3D (solo VTK, para no dejarla "solita"), DevOps — se quitó "Datos e IA" como
    categoría propia (Terraform es de infraestructura, no de IA; IA pasó a ser su propia especialidad
    en Soluciones, no una categoría de stack).
11. **Footer simplificado**: se quitó el párrafo descriptivo bajo el logo y los íconos de
    GitHub/LinkedIn — quedó solo el logo centrado a la izquierda y los grupos de enlaces.
12. **Metodología con más contenido, sin jerga ni negativos**: se agregó `processCapabilities`
    (Análisis a fondo / Avances visibles / Seguimiento y control / Equipo dedicado) junto a los
    pasos del proceso, para transmitir capacidad de equipo y seguimiento sin usar términos como
    "sprints"/"metodologías ágiles" ni frases en negativo como "sin sorpresas" o "no repartido entre
    diez clientes" (el cliente pidió explícitamente evitar ambas cosas).
13. **Bug del icono de Next.js dejando una mancha negra al hacer scroll**: es un bug de repintado de
    Chromium con `<mask>` SVG (el icono de `@iconify-json/logos` usa `<mask>` + gradientes). Se
    corrigió forzando una capa de composición propia (`transform-gpu` + `will-change-transform` en
    el wrapper del icono, ver `TechTile.astro`) — si aparece en otro ícono con máscara, es el mismo
    problema.
14. **Bug del menú móvil tras la primera navegación SPA**: con `<ClientRouter />` (View Transitions),
    el script de nivel superior corre una sola vez, así que una referencia de DOM cacheada en el
    Navbar quedaba obsoleta después de la primera navegación. Se corrigió con *event delegation*
    sobre `document`/`window` (se adjunta una sola vez, consulta el DOM fresco en el momento del
    evento) — mismo patrón usado en `SpecialtiesTabs.astro`. Si un componente con estado de cliente
    deja de responder solo después de navegar una vez, sospechar de esto primero.
15. **Salud Digital, generalizada**: el único caso real de este sector (una plataforma para un banco
    digital de tejidos) se referencia en el sitio solo de forma genérica — "aplicaciones web
    médicas", telemedicina, gestión de información clínica y de laboratorio — sin nombrar nunca al
    cliente específico. Si se agrega contenido nuevo de este sector, mantener el mismo nivel de
    generalidad.
16. **`/servicios` y `/soluciones` dejaron de ser páginas propias**: eran casi duplicados exactos de
    sus secciones del home (mismo copy, mismos componentes) — se fusionó su `PageHeader`/CTA en
    `ServicesGrid`/`SpecialtiesTabs` del home y se borraron las páginas. El nav superior se dividió
    en dos grupos (`mainNavAnchors`/`mainNavPages` en `navigation.ts`): **Inicio, Servicios,
    Soluciones** son anclas al home (`/#top`, `/#servicios`, `/#soluciones`); **Recursos,
    Tecnología, Nosotros** siguen siendo páginas propias. Un reviewer de Copilot marcó que borrar
    las páginas sin redirect rompía bookmarks/links indexados — se agregó `redirects` en
    `astro.config.mjs` (`/servicios` → `/#servicios`, `/soluciones` → `/#soluciones`), que en
    `output: "static"` genera páginas de meta-refresh, no 301 reales (GitHub Pages no sirve
    redirects HTTP). Si se borra otra página con URL ya pública, aplicar el mismo patrón.
17. **`ServiceCard` pasó de link a tarjeta con flip 3D**: clic para girar y mostrar el checklist
    completo en la cara trasera, en vez de navegar a un ancla de `/servicios#slug` (que ya no
    existe). El botón expone `aria-expanded` y cada cara alterna `aria-hidden` — antes ambas caras
    quedaban en el árbol de accesibilidad a la vez, marcado por Copilot. La página `/servicios` (la
    completa, con `PageHeader`/`ProcessSection`/CTA propio) ya no existe — ver punto 16 — así que
    `ServiceCard` ya no tiene una variante "estática" separada del flip.
18. **Acento dorado (`gold-400`)** — ver el bullet de "Sistema de diseño actual" arriba para el
    detalle completo de dónde vive.
19. **`TeamCard` — flip 3D con accesibilidad correcta y `roleFull`**: se agregó `roleFull` a
    `TeamMember` (p. ej. "Chief Executive Officer") mostrado en la cara trasera junto a la sigla
    (`role`, "CEO") que ya se ve en la foto de portada. Un reviewer de Copilot marcó dos problemas
    reales: (a) la cara trasera era un `div role="button"` envolviendo `<a>` reales — semántica
    ARIA anidada inválida — y (b) esa misma cara quedaba tabulable/enfocable con el teclado aunque
    estuviera visualmente oculta por `backface-visibility` (eso solo oculta visualmente, no saca
    del tab order ni del árbol de accesibilidad). Se corrigió quitando el `role`/`tabindex` del
    div, agregando un botón real "Cerrar perfil" (oculto visualmente, aparece al enfocarlo con
    teclado — patrón `sr-only focus:not-sr-only`), y alternando el atributo `inert` en la cara que
    no está activa. **Este es el patrón de referencia para cualquier tarjeta con flip 3D nueva** —
    replicarlo en vez de reinventar la accesibilidad cada vez.
20. **Falso conflicto de Git en un PR develop→master**: GitHub reportó "conflicting" en un PR donde
    `git merge`/`git merge-tree` (probado con la base explícita y también cruzando las dos bases)
    confirmaban un merge limpio. La causa era un **criss-cross merge** — dos merge-bases distintos
    entre `develop` y `master` porque la misma rama se había fusionado dos veces por caminos
    distintos (una vez directo a `master`, otra vía `develop`). El algoritmo de mergeability de
    GitHub no maneja bien la base virtual que sí calcula el `git` local. Solución: fusionar
    `master` dentro de `develop` localmente (confirmado limpio) y pushear ese merge commit a
    `develop` — deja una sola base clara y GitHub recalcula el PR como mergeable. Si "GitHub dice
    conflicto pero `git merge` local no", sospechar de esto antes de resolver manualmente algo que
    no está roto.
21. **Internacionalización ES/EN**: el cliente pidió español por defecto con opción de cambiar a
    inglés, "todo traducido, cada palabra, cada rincón" — se implementó con el routing i18n nativo
    de Astro (`/en/` con los mismos slugs, ver sección "Internacionalización" arriba) en vez de un
    toggle client-side, porque un sitio estático necesita URLs reales por idioma para que Google
    indexe ambas versiones (SSR/CSR toggles no son indexables igual). Se tradujeron las 11 páginas
    completas, incluyendo la prosa larga de legal/recursos y el formulario de contacto con su
    script de validación. Decisión explícita del cliente: slugs iguales bajo `/en/` (no
    `/en/about-us`), para no mantener una tabla de equivalencias — más simple y menos propenso a
    bugs en el selector de idioma.
22. **Modo claro ("Paper")**: el sitio nació solo-oscuro; el cliente pidió agregar modo claro más
    una pastilla sol/luna junto al selector de idioma. Antes de tocar código se generó un Artifact
    (canvas de diseño) con 3 direcciones de paleta completas (secciones reales re-pintadas, no
    swatches abstractos) y 5 tratamientos de ícono, todas ancladas a los tokens reales del modo
    oscuro — mismo patrón que las exploraciones anteriores de este proyecto (Aurora/Canopy, el
    acento dorado). El cliente eligió la dirección "Paper" (neutro cálido, no blanco/gris frío
    puro) y el ícono segmentado sol/luna (ambos siempre visibles, el activo resaltado) como
    referencia visual — al implementarlo se afinó a un switch deslizante de un solo botón (todo el
    pill clickeable, thumb animado) en vez de dos botones independientes, por usabilidad. Al pasar la
    paleta del mockup a los tokens reales apareció un problema que el mockup no tenía: varios
    lugares del código usaban `ink-950`/`text-white` asumiendo que siempre sería oscuro (el texto
    del botón primario sobre el fill verde, el scrim + nombre sobre la foto de `TeamCard`) — invertir
    `ink-950` a un valor claro los habría roto (texto invisible). Se resolvió con
    `--color-fixed-dark`, un token nuevo que nunca cambia de tema, ver "Modo claro" arriba. Lección
    para la próxima exploración de tema/color: un mockup aislado no revela estos casos — hay que
    grepear `ink-950`/`text-white`/`bg-white` en el código real antes de dar por buena una
    inversión de escala completa. Ese mismo grep tampoco atrapa un caso distinto: `public/logo.png`
    es un PNG con letras blancas, no un token de color, así que quedaba invisible en modo claro sin
    que ninguna búsqueda de texto lo detectara — se resolvió con un filtro `invert(1)` condicionado a
    `[data-theme="light"]` (ver "Modo claro" arriba). Lección adicional: además de grepear tokens,
    revisar también los assets rasterizados (`public/*.png`) pensados para un solo fondo.

## Pendientes conocidos antes de un lanzamiento real

- **⚠️ `PUBLIC_BASE_PATH` en `.github/workflows/deploy.yml` está en `/fe_sscdx` temporalmente**
  (repo público, probando en `siscodex.github.io/fe_sscdx` sin DNS todavía). Cuando el DNS de
  `siscodex.com` apunte a GitHub Pages y el dominio quede verificado en Settings → Pages, hay que
  volver a poner `PUBLIC_BASE_PATH: /` — si no, el sitio en el dominio real quedará sin estilos
  (mismo síntoma que se corrigió acá: CSS/JS apuntando a la ruta equivocada).
- `public/og/default.svg` es un placeholder generado por código (gradiente + logo + texto).
  Twitter/X no renderiza SVG en `og:image` — sustituir por un PNG/JPG 1200×630 real antes de
  publicar (ver `docs/ARCHITECTURE.md` §5.4).
- `ContactForm.astro` no envía datos a ningún backend todavía — el `TODO` está marcado en su
  `<script>`. `PUBLIC_CONTACT_ENDPOINT` ya existe en `.env.example` para cuando se integre.
- `src/data/projects.ts` ya **no** son casos de cliente inventados: son las 5 áreas de
  especialidad reales de Siscodex (Cloud, IA, Móvil, Web, Salud Digital), pensadas como taxonomía
  fija, no como placeholders a reemplazar. Si se agrega una especialidad nueva, mantener la forma
  de datos (`Project` en `src/types/index.ts`: `summary`, `capabilities`, `idealFor`).
- No hay tests automatizados (deliberado por ahora — ver justificación y estructura recomendada en
  `docs/ARCHITECTURE.md` §8.3).
- Las traducciones al inglés (`src/i18n/ui.ts`, campos `en` en `src/data/*.ts`, y las 11 páginas
  bajo `src/pages/en/`) las escribió Claude — funcionalmente completas y consistentes, pero no las
  ha revisado un hablante nativo de inglés. Antes de un lanzamiento real, vale la pena una pasada
  de revisión humana, especialmente en el copy de marketing (Hero, WhyUs, especialidades).
- **El modo claro se implementó y compila sin errores, pero Claude no lo vio en un navegador real**
  (no hay herramienta de automatización de navegador en este entorno) — los valores de contraste
  se calcularon a mano, no se verificaron con una herramienta real. Antes de darlo por terminado,
  alguien debería recorrer el sitio completo en modo claro (todas las páginas, ambos idiomas,
  mobile) y revisar especialmente: la tarjeta de equipo (flip 3D), los blobs decorativos de fondo,
  y el contraste de `gold-400`/`ember-400` en los distintos fondos donde aparecen.

## Deployment

GitHub Pages ya configurado (`.github/workflows/deploy.yml`, `public/CNAME` → siscodex.com).
Vercel/Netlify/AWS S3+CloudFront documentados paso a paso en `docs/ARCHITECTURE.md` §7 —
`netlify.toml` ya está en la raíz para Netlify.

## Convenciones de commits / trabajo con el usuario

- El usuario (Fherney) suele pedir cambios visuales mostrando una captura de pantalla como
  referencia — cuando pase, comparar contra el estado real del sitio, no asumir; usar el dev
  server o `curl` al HTML compilado para verificar antes de decir que algo está listo. Si la
  captura no coincide con lo que ya verificaste en el código/dev server, sospechar primero de caché
  del navegador antes de asumir que el cambio no se aplicó.
- No commitear a git salvo que se pida explícitamente. Cuando se pida, mensajes en **inglés**, una
  sola línea, estilo `tipo: descripción corta` (`feat:`/`fix:`), autor único (la cuenta de GitHub
  del usuario) — sin coautoría de Claude ni cuerpos largos, salvo que el usuario pida lo contrario.
  Si hay varios cambios de temas distintos sin commitear, agruparlos en commits separados por tema
  (usar `git diff --cached --stat` para confirmar el alcance antes de cada commit) en vez de uno
  solo gigante.
- Cada PR pasa por revisión automática de Copilot — cuando el usuario pida "revisar las sugerencias
  de Copilot", los hallazgos suelen ser reales (no ruido): en esta sesión los 4 que dio eran todos
  válidos (bug de `aria-current`, accesibilidad del flip de `ServiceCard`, semántica ARIA anidada +
  foco fantasma en `TeamCard`, rutas sin redirect). Tratarlos con el mismo rigor que un bug
  reportado por un humano.
- Verificar siempre con `npm run build` (incluye `astro check`) después de tocar componentes o
  `global.css` — este proyecto ya tuvo bugs reales de tipos con la librería `motion` (overloads de
  `animate` con "easing" en vez de "ease") y con IDs `Tag`/props de `Button.astro`.
