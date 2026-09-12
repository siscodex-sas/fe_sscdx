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
├── layouts/        → BaseLayout (páginas normales), SimpleContentLayout (legal/recursos)
├── pages/          → rutas (file-based routing de Astro)
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
