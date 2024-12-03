import type { APIRoute } from "astro";
import type { CollectionEntry } from "astro:content";
import { DLAstro } from "../../../../domains/dl/DLAstro";
import { renderOgImage } from "../../../../domains/og-image/renderOgImage";

export const prerender = false;

export type Params = {
  creatorSlug: CollectionEntry<"creators">["id"];
};

export const GET: APIRoute = async (ctx) => {
  const params = ctx.params as Params;

  const { creator } = await DLAstro.getCreator({
    slug: params.creatorSlug,
  });

  return await renderOgImage({
    title: creator.data.name,
    description: creator.data.description || "Creator of games and assets",
    ctx: ctx,
  });
};
