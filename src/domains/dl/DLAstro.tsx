import { getCollection, getEntry } from "astro:content";

export const DLAstro = {
  async getAllGames() {
    const games = await getCollection("games");
    return games;
  },
  async getAllCreatorsWithTheirGames() {
    const creators = await getCollection("creators");

    return Promise.all(
      creators.map(async (creator) => {
        const games = await getCollection("games", (game) => {
          const [gameCreatorSlug] = game.id.split("/");
          return gameCreatorSlug === creator.slug;
        });
        const gamesWithCreator = await Promise.all(
          games.map(async (game) => {
            const [creatorSlug] = game.id.split("/");
            const creator = await getEntry("creators", creatorSlug);
            return {
              game,
              creator: creator!,
            };
          }),
        );

        return {
          creator,
          games: gamesWithCreator,
        };
      }),
    );
  },
  async getAllGamesWithCreators() {
    const games = await this.getAllGames();
    const gamesWithCreators = await Promise.all(
      games.map(async (game) => {
        const [creatorSlug] = game.id.split("/");
        const creator = await getEntry("creators", creatorSlug);
        return {
          game,
          creator: creator!,
        };
      }),
    );

    return gamesWithCreators;
  },
  async getAllGamesWithCreatorsAndAssets() {
    const gamesWithCreators = await this.getAllGamesWithCreators();
    const gamesWithCreatorsAndSheets = await Promise.all(
      gamesWithCreators.map(async (gameWithCreator) => {
        const assets = await this.getAssetsForGame({
          slug: gameWithCreator.game.slug,
        });
        return {
          game: gameWithCreator.game,
          creator: gameWithCreator.creator!,
          assets: assets,
        };
      }),
    );

    return gamesWithCreatorsAndSheets;
  },
  async getGameWithCreator(props: { slug: string }) {
    const game = await getEntry("games", props.slug);

    if (!game) {
      return null;
    }
    const [creatorSlug] = game.id.split("/");
    const creator = await getEntry("creators", creatorSlug);
    return {
      game,
      creator,
    };
  },
  async getAssetsForGame(props: { slug: string }) {
    const assets = await getCollection("assets");
    const assetsForGame = assets.filter((sheet) => {
      return sheet.slug.startsWith(props.slug);
    });

    return assetsForGame;
  },
};