/**
 * Diccionario de strings de UI reutilizables (componentes compartidos entre
 * varias páginas: nav, footer, formulario, defaults de secciones). El copy
 * *propio* de cada página (títulos, PageHeader, arrays inline como
 * `values` en nosotros.astro, prosa de legal/recursos) vive directamente en
 * el archivo `.astro` de cada idioma — no tiene sentido indirectarlo aquí
 * porque no se reutiliza en ningún otro lugar. Ver `src/i18n/utils.ts` para
 * `useTranslations()`.
 */
export const ui = {
  es: {
    "nav.aria.menu": "Abrir menú de navegación",
    "nav.cta": "Hablemos",
    "lang.switch": "Cambiar a inglés",
    "theme.switchToLight": "Cambiar a modo claro",
    "theme.switchToDark": "Cambiar a modo oscuro",

    "footer.rights": "Todos los derechos reservados.",

    "hero.cta.primary": "Hablemos de tu proyecto",
    "hero.cta.secondary": "Conoce nuestros servicios",

    "whyus.eyebrow": "Por qué Siscodex",
    "whyus.title": "Ventaja competitiva construida en cada entrega",
    "whyus.description":
      "Combinamos visión estratégica con ejecución técnica senior para entregar software que impulsa tu negocio.",

    "services.eyebrow": "Servicios",
    "services.title": "Soluciones de ingeniería para cada etapa de tu producto",
    "services.description":
      "Desde el primer prototipo hasta la operación a escala, cubrimos todo el ciclo de vida del software empresarial.",
    "services.card.viewDetail": "Ver detalle de",

    "process.eyebrow": "Metodología",
    "process.title": "Cómo trabajamos",
    "process.description":
      "Entendemos tu negocio, avanzamos con transparencia y te acompañamos en cada etapa — no solo escribimos código.",

    "specialties.eyebrow": "Soluciones",
    "specialties.title": "Especialización respaldada por experiencia real",
    "specialties.description":
      "Nuestra experiencia en distintas industrias nos permite combinar ingeniería de software, arquitectura cloud e inteligencia artificial para transformar desafíos complejos en soluciones eficientes, escalables y de alto impacto.",
    "specialties.includes": "Qué incluye",
    "specialties.idealFor": "Para quién es esto",

    "team.eyebrow": "Liderazgo",
    "team.title": "Acceso directo a quienes toman las decisiones",
    "team.description":
      "Hablas con el liderazgo desde el primer día — respaldado por un equipo completo detrás de cada proyecto.",
    "team.card.viewTrajectory": "Ver la trayectoria de",
    "team.card.close": "Cerrar perfil de",
    "team.card.website": "Sitio web de",
    "team.card.linkedin": "Perfil de LinkedIn de",

    "tech.eyebrow": "Stack tecnológico",
    "tech.title": "Herramientas de nivel empresarial",
    "tech.description":
      "Priorizamos tecnología madura y probada en producción, con estabilidad y soporte a largo plazo.",
    "tech.viewAll": "Ver todo el stack tecnológico",

    "cta.default.primary": "Agendar una consulta",

    "contact.form.name": "Nombre",
    "contact.form.company": "Empresa",
    "contact.form.email": "Email de trabajo",
    "contact.form.phone": "Teléfono",
    "contact.form.service": "Servicio de interés",
    "contact.form.message": "Descripción del proyecto",
    "contact.form.placeholder.name": "Tu nombre completo",
    "contact.form.placeholder.company": "Nombre de tu empresa",
    "contact.form.placeholder.email": "tu@empresa.com",
    "contact.form.placeholder.phone": "+1 (555) 000-0000",
    "contact.form.placeholder.service": "Selecciona un servicio",
    "contact.form.placeholder.message":
      "Cuéntanos brevemente tu necesidad técnica, plazos y alcance estimado...",
    "contact.form.honeypotLabel": "Deja este campo vacío",
    "contact.form.submit": "Enviar solicitud",
    "contact.form.submitting": "Enviando…",
    "contact.services.custom": "Desarrollo de software a medida",
    "contact.services.cloud": "Infraestructura y arquitectura cloud",
    "contact.services.ai": "Inteligencia artificial aplicada",
    "contact.services.modernization": "Modernización de plataformas",
    "contact.services.enterprise": "Sistemas empresariales",
    "contact.services.other": "Otro",
    "contact.error.required": "Este campo es obligatorio.",
    "contact.error.email": "Ingresa un email válido.",
    "contact.error.phonePattern": "Ingresa solo números (puedes usar +, espacios, paréntesis o guiones).",
    "contact.error.minLength": "Escribe al menos {min} caracteres.",
    "contact.error.generic": "Revisa este campo.",
    "contact.status.success":
      "¡Gracias por escribirnos! Un miembro de nuestro equipo revisará tu solicitud y se pondrá en contacto contigo pronto.",
    "contact.status.error": "Revisa los campos marcados antes de enviar.",

    "seo.orgDescription":
      "Siscodex es un estudio de ingeniería de software especializado en desarrollo a medida, arquitectura cloud e inteligencia artificial para empresas.",
  },
  en: {
    "nav.aria.menu": "Open navigation menu",
    "nav.cta": "Let's talk",
    "lang.switch": "Switch to Spanish",
    "theme.switchToLight": "Switch to light mode",
    "theme.switchToDark": "Switch to dark mode",

    "footer.rights": "All rights reserved.",

    "hero.cta.primary": "Let's talk about your project",
    "hero.cta.secondary": "See our services",

    "whyus.eyebrow": "Why Siscodex",
    "whyus.title": "Competitive advantage built into every delivery",
    "whyus.description":
      "We combine strategic vision with senior technical execution to deliver software that drives your business forward.",

    "services.eyebrow": "Services",
    "services.title": "Engineering solutions for every stage of your product",
    "services.description":
      "From the first prototype to operating at scale, we cover the entire enterprise software lifecycle.",
    "services.card.viewDetail": "View details for",

    "process.eyebrow": "Methodology",
    "process.title": "How we work",
    "process.description":
      "We understand your business, move forward with transparency, and support you at every stage — we don't just write code.",

    "specialties.eyebrow": "Solutions",
    "specialties.title": "Specialization backed by real experience",
    "specialties.description":
      "Our experience across different industries lets us combine software engineering, cloud architecture and artificial intelligence to turn complex challenges into efficient, scalable, high-impact solutions.",
    "specialties.includes": "What's included",
    "specialties.idealFor": "Who this is for",

    "team.eyebrow": "Leadership",
    "team.title": "Direct access to the people making the decisions",
    "team.description":
      "You talk to leadership from day one — backed by a full team behind every project.",
    "team.card.viewTrajectory": "View the background of",
    "team.card.close": "Close profile for",
    "team.card.website": "Website for",
    "team.card.linkedin": "LinkedIn profile for",

    "tech.eyebrow": "Tech stack",
    "tech.title": "Enterprise-grade tools",
    "tech.description":
      "We prioritize mature, production-proven technology, with stability and long-term support.",
    "tech.viewAll": "See the full tech stack",

    "cta.default.primary": "Book a consultation",

    "contact.form.name": "Name",
    "contact.form.company": "Company",
    "contact.form.email": "Work email",
    "contact.form.phone": "Phone",
    "contact.form.service": "Service of interest",
    "contact.form.message": "Project description",
    "contact.form.placeholder.name": "Your full name",
    "contact.form.placeholder.company": "Your company name",
    "contact.form.placeholder.email": "you@company.com",
    "contact.form.placeholder.phone": "+1 (555) 000-0000",
    "contact.form.placeholder.service": "Select a service",
    "contact.form.placeholder.message":
      "Tell us briefly about your technical needs, timeline and estimated scope...",
    "contact.form.honeypotLabel": "Leave this field empty",
    "contact.form.submit": "Send request",
    "contact.form.submitting": "Sending…",
    "contact.services.custom": "Custom software development",
    "contact.services.cloud": "Cloud infrastructure and architecture",
    "contact.services.ai": "Applied artificial intelligence",
    "contact.services.modernization": "Platform modernization",
    "contact.services.enterprise": "Enterprise systems",
    "contact.services.other": "Other",
    "contact.error.required": "This field is required.",
    "contact.error.email": "Enter a valid email address.",
    "contact.error.phonePattern": "Numbers only (you can use +, spaces, parentheses or hyphens).",
    "contact.error.minLength": "Write at least {min} characters.",
    "contact.error.generic": "Check this field.",
    "contact.status.success":
      "Thanks for reaching out! A member of our team will review your request and get back to you soon.",
    "contact.status.error": "Check the highlighted fields before submitting.",

    "seo.orgDescription":
      "Siscodex is a software engineering studio specialized in custom development, cloud architecture and artificial intelligence for businesses.",
  },
} as const;

export type UIKey = keyof typeof ui.es;
