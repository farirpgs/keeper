import type { APIRoute, InferGetStaticParamsType } from "astro";
import { z } from "zod";
import { DLAstro } from "../../../../domains/dl/DLAstro";

type Params = InferGetStaticParamsType<typeof getStaticPaths>;

export const GET: APIRoute = async ({ params, request }) => {
  const parsedParams = z
    .object({
      path: z.string(),
    })
    .parse(params) as Params;

  const game = await DLAstro.getGame({
    slug: parsedParams.path,
    includeCreator: true,
  });

  return new Response(JSON.stringify(game));
};

export async function getStaticPaths() {
  const { games } = await DLAstro.getAllGames();

  return games.map((game) => {
    return {
      params: {
        path: game.id,
      },
    };
  });
}
