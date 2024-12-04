import type { APIRoute } from "astro";
import { getImage } from "astro:assets";
import { DLAstro } from "../../../../../domains/dl/DLAstro";
import { renderOgImage } from "../../../../../domains/og-image/renderOgImage";

export const prerender = false;

export type Params = {
  creatorSlug: string;
  gameSlug: string;
};

export const GET: APIRoute = async (ctx) => {
  const params = ctx.params as Params;

  const { game, creator } = await DLAstro.getGame({
    id: `${params.creatorSlug}/${params.gameSlug}` as any,
    includeCreator: true,
  });

  const backgroundImage = await getImage({
    src: game.data.image as any,
    format: "png",
    quality: "low",
  });

  return await renderOgImage({
    title: game.data.name,
    description: "",
    footerItems: [`By ${creator!.data.name}`],
    ctx: ctx,
    src: backgroundImage.src,

    accentColor: game.data.theme?.accentColor,
  });
};
