import type { APIRoute } from "astro";
import { getImage } from "astro:assets";
import type { CollectionEntry } from "astro:content";
import { DLAstro } from "../../../../../domains/dl/DLAstro";
import { DocParser } from "../../../../../domains/document/DocParser";
import { renderOgImage } from "../../../../../domains/og-image/renderOgImage";

export const prerender = false;

export type Params = {
  creatorSlug: CollectionEntry<"creators">["id"];
  resourceSlug: string;
};

export const GET: APIRoute = async (ctx) => {
  const params = ctx.params as Params;

  const { creator, resource } = await DLAstro.getResource({
    slug: `${params.creatorSlug}/${params.resourceSlug}` as any,
    includeCreator: true,
  });

  const parser = new DocParser({
    markdown: resource.body!,
  });
  const doc = parser.getDoc();

  const backgroundImage = await getImage({
    src: resource.data.image as any,
    format: "png",
    quality: "low",
  });

  return await renderOgImage({
    ctx: ctx,
    title: doc.currentPage?.title || "",
    description: resource.data.name,
    footerItems: [`By ${creator!.data.name}`],
    src: backgroundImage.src,
    accentColor: resource.data.theme?.accentColor,
  });
};
