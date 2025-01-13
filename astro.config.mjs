import mdx from "@astrojs/mdx";
import netlify from "@astrojs/netlify";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import starlight from "@astrojs/starlight";
import tailwind from "@astrojs/tailwind";
import { defineConfig } from "astro/config";

import { constants } from "./src/domains/utils/constants";

import partytown from "@astrojs/partytown";

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
    tailwind(),
    mdx(),
    sitemap(),
    partytown({
      config: {
        forward: ["dataLayer.push"],
      },
    }),
  ],
  experimental: {
    contentIntellisense: true,
  },
  adapter: netlify(),
});
