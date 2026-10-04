/**
 * Datos legales de Siscodex como Responsable del Tratamiento de datos personales
 * (Ley 1581 de 2012 y Decreto 1377 de 2013, art. 13 — hoy compilado en el
 * Decreto 1074 de 2015). Los usan las dos versiones de la política de
 * privacidad (/legal/privacidad y /en/legal/privacidad).
 *
 * Un campo vacío ("") se muestra en la política como un texto entre paréntesis
 * que indica qué hay que poner (objeto `pending` de cada página) — la norma
 * exige identificar al responsable con nombre, domicilio, dirección, correo y
 * teléfono, así que todos deben completarse antes de dar la política por final.
 */
export const company = {
  /** Razón social tal como aparece en el registro mercantil / RUT. */
  legalName: "", // p. ej. "Siscodex S.A.S." — confirmar contra el RUT
  /** NIT con dígito de verificación, p. ej. "901.234.567-8". */
  nit: "",
  /** Dirección física de notificaciones. */
  address: "",
  /** Ciudad de domicilio, p. ej. "Cúcuta, Norte de Santander". */
  city: "",
  country: { es: "Colombia", en: "Colombia" },
  /** Teléfono de contacto, p. ej. "+57 300 000 0000". */
  phone: "",
  /** Canal para consultas y reclamos sobre datos personales. */
  privacyEmail: "contacto@siscodex.com",
  /** Fecha de entrada en vigencia de la versión actual de la política (YYYY-MM-DD). */
  privacyPolicyEffectiveDate: "2026-09-26",
} as const;
