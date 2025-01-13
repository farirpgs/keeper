import { glob } from "astro/loaders";
import { defineCollection, reference, z } from "astro:content";

import { docsLoader } from "@astrojs/starlight/loaders";
import { docsSchema } from "@astrojs/starlight/schema";

import { Colors } from "./domains/colors/colors";

const themeSchema = z
  .object({
    accentColor: z.enum(Colors.getAccentColors()).optional(),
    headingFont: z.string().optional(),
    bodyFont: z.string().optional(),
  })
  .optional();

export const collections = {
  creators: defineCollection({
    loader: glob({
      pattern: "**/*.mdx",
      base: "./src/content/creators",
    }),
    schema: z.object({
      name: z.string(),
      description: z.string().default(""),
    }),
  }),
  games: defineCollection({
    loader: glob({
      pattern: "**/*.mdx",
      base: "./src/content/games",
    }),
    schema: (ctx) =>
      z.object({
        name: z.string(),
        description: z.string().default(""),
        creator: reference("creators"),
        image: ctx.image().optional(),
        theme: themeSchema,
        weight: z.number().optional().default(0),
        _optimizedImageSrc: z.string().optional(),
      }),
  }),
  assets: defineCollection({
    loader: glob({
      pattern: "**/*.mdx",
      base: "./src/content/assets",
    }),
    schema: z.object({
      name: z.string(),
      description: z.string().default(""),
      game: reference("games"),
      version: z
        .number()
        .default(1)
        .transform((version) => {
          if (version === 1) return "";
          return `v${version}`;
        }),
    }),
  }),
  resources: defineCollection({
    loader: glob({
      pattern: "**/*.mdx",
      base: "./src/content/resources",
    }),
    schema: (ctx) =>
      z.object({
        name: z.string(),
        description: z.string().default(""),
        creator: reference("creators"),
        links: z.record(z.string(), z.string()).nullable().default({}),
        image: ctx.image().nullable().optional(),
        theme: themeSchema,
        weight: z.number().optional().default(0),
        license: z.string().optional(),
        _optimizedImageSrc: z.string().optional(),
        _idWithoutLocale: z.string().optional(),
        _locale: z.string().optional(),
      }),
  }),
  docs: defineCollection({ loader: docsLoader(), schema: docsSchema() }),
};
