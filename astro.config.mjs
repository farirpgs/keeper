import mdx from "@astrojs/mdx";
import netlify from "@astrojs/netlify";
import partytown from "@astrojs/partytown";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import starlight from "@astrojs/starlight";
import sentry from "@sentry/astro";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, envField } from "astro/config";
import { constants } from "./src/domains/utils/constants";

// https://astro.build/config
export default defineConfig({
  site: "https://keeper.farirpgs.com",
  output: "static",
  prefetch: {
    prefetchAll: true,
  },
  site: constants.site({
    localhost: process.env.NODE_ENV === "development",
  }),
  env: {
    schema: {
      SENTRY_AUTH_TOKEN: envField.string({
        context: "server",
        access: "public",
        optional: true,
        description: "Sentry auth token for uploading source maps.",
      }),
    },
  },
  integrations: [
    starlight({
      title: "Keeper Documentation",
      disable404Route: true,
      logo: {
        src: "./public/keeper/name.svg",
        replacesTitle: true,
      },
      sidebar: [
        {
          label: "Documentation",
          autogenerate: {
            directory: "docs",
          },
        },
      ],
      customCss: ["./src/styles/docs.css"],
      social: {
        discord: "https://farirpgs.com/discord",
        github: "https://github.com/farirpgs/keeper",
      },
    }),
    react(),
    mdx(),
    sitemap(),
    partytown({
      config: {
        forward: ["dataLayer.push"],
      },
    }),
    sentry({
      dsn: "https://3169f6f4e1c7e125267cf97b22e1f062@o332302.ingest.us.sentry.io/4509136604364800",
      tracesSampleRate: 0,
      replaysSessionSampleRate: 0,
      replaysOnErrorSampleRate: 0,
      sourceMapsUploadOptions: {
        project: "keeper",
        authToken: process.env.SENTRY_AUTH_TOKEN,
      },
    }),
  ],
  experimental: {
    contentIntellisense: true,
  },
  adapter: netlify(),
  vite: {
    plugins: [tailwindcss()],
  },
});
