// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";
import icon from "astro-icon";

/**
 * `site` debe apuntar siempre al dominio canónico (usado en sitemap, RSS,
 * canonical URLs y Open Graph), independientemente de dónde se despliegue.
 *
 * `base` solo es necesario cuando el sitio se sirve desde una subruta, como
 * un GitHub Pages de proyecto sin dominio propio (usuario.github.io/repo).
 * Con un dominio propio (siscodex.com) o en Vercel/Netlify/CloudFront,
 * `base` debe permanecer en "/". Se controla vía variable de entorno para
 * no tocar código al cambiar de plataforma.
 */
export default defineConfig({
  site: "https://siscodex.com",
  base: process.env.PUBLIC_BASE_PATH ?? "/",
  trailingSlash: "never",
  output: "static",
  compressHTML: true,

  // Español por defecto sin prefijo (URLs ya indexadas, no se tocan);
  // inglés vive bajo /en/ con los mismos slugs — ver src/i18n/ y
  // CLAUDE.md § Internacionalización para el detalle de la arquitectura.
  i18n: {
    defaultLocale: "es",
    locales: ["es", "en"],
    routing: {
      prefixDefaultLocale: false,
    },
  },

  // /servicios y /soluciones dejaron de ser páginas propias (su contenido se
  // fusionó en el home) — el redirect a /#servicios y /#soluciones vive en
  // public/_redirects (301 real, servido por Cloudflare Pages) en vez de
  // generarse acá como página de meta-refresh: ese truco solo existía porque
  // GitHub Pages no podía servir redirects HTTP.

  integrations: [
    sitemap({
      changefreq: "weekly",
      priority: 0.7,
    }),
    icon({
      include: {
        lucide: ["*"],
        // Logos reales de marca para el stack tecnológico — solo los que se
        // usan, no todo el set, para no inflar el build.
        logos: [
          "typescript-icon",
          "react",
          "astro-icon",
          "nextjs-icon",
          "nodejs-icon",
          "python",
          "postgresql",
          "graphql",
          "redis",
          "aws",
          "docker-icon",
          "kubernetes",
          "github-actions",
          "terraform-icon",
          "swift",
          "kotlin-icon",
          "flutter",
          "aws-lambda",
          "aws-s3",
          "aws-api-gateway",
          "aws-cloudfront",
          "aws-dynamodb",
          "aws-batch",
          "angular-icon",
          "java",
          "linkedin-icon",
        ],
      },
    }),
  ],

  vite: {
    plugins: [tailwindcss()],
  },

  build: {
    inlineStylesheets: "auto",
  },

  prefetch: {
    prefetchAll: true,
    defaultStrategy: "viewport",
  },
});
