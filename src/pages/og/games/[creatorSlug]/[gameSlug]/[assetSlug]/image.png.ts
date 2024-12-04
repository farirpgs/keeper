import type { APIRoute } from "astro";
import { getImage } from "astro:assets";
import { DLAstro } from "../../../../../../domains/dl/DLAstro";
import { renderOgImage } from "../../../../../../domains/og-image/renderOgImage";

export const prerender = false;

export type Params = {
  creatorSlug: string;
  gameSlug: string;
  assetSlug: string;
};

export const GET: APIRoute = async (ctx) => {
  const params = ctx.params as Params;

  const { asset, game, creator } = await DLAstro.getAssetWithGameAndCreator({
    id: `${params.creatorSlug}/${params.gameSlug}/${params.assetSlug}` as any,
  });

  const backgroundImage = await getImage({
    src: game.data.image as any,
    format: "png",
    quality: "low",
  });

  return await renderOgImage({
    title: asset.data.name,
    description: asset.data.description || `${game.data.name}`,
    accentColor: game.data.theme?.accentColor,
    footerItems: [`By ${creator.data.name}`],
    ctx: ctx,
    src: backgroundImage.src,
  });
};
