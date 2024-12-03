import type { APIRoute } from "astro";
import { getImage } from "astro:assets";
import type { CollectionEntry } from "astro:content";
import { DLAstro } from "../../../../../domains/dl/DLAstro";
import { renderOgImage } from "../../../../../domains/og-image/renderOgImage";

export const prerender = false;

export type Params = {
  creatorSlug: CollectionEntry<"creators">["id"];
  gameSlug: string;
};

export const GET: APIRoute = async (ctx) => {
  const params = ctx.params as Params;

  const { creator } = await DLAstro.getCreator({ slug: params.creatorSlug });
  const { game } = await DLAstro.getGame({
    slug: `${params.creatorSlug}/${params.gameSlug}` as any,
  });

  const backgroundImage = await getImage({
    src: game.data.image as any,
    format: "png",
    quality: "low",
  });

  return await renderOgImage({
    title: game.data.name,
    description: game.data.description,
    footerItems: [`By ${creator.data.name}`],
    accentColor: game.data.theme?.accentColor,
    ctx: ctx,
    src: backgroundImage.src,
  });
};
