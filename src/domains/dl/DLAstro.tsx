import { getCollection, getEntry, type CollectionEntry } from "astro:content";

export const DLAstro = {
  // CREATOR
  async getAllCreators() {
    const creators = await getCollection("creators");
    return { creators };
  },
  async getCreator(props: {
    id: CollectionEntry<"creators">["id"];
    includeGames?: boolean;
    includeResources?: boolean;
  }) {
    const creator = await getEntry("creators", props.id);

    if (!creator) {
      throw new Error("DLAstro.getCreator: Creator not found");
    }

    let games: Array<CollectionEntry<"games">> = [];
    let resources: Array<CollectionEntry<"resources">> = [];
    if (props.includeGames) {
      games = await getCollection("games", (item) => {
        return item.data.creator.id === creator.id;
      });
    }
    if (props.includeResources) {
      resources = await getCollection("resources", (item) => {
        const isTranslation = item.id.split("/").length === 3;

        if (isTranslation) {
          return false;
        }

        return item.data.creator.id === creator.id;
      });
    }

    return { creator, games, resources };
  },

  // GAMES
  async getAllGames() {
    const games = await getCollection("games");
    return { games };
  },
  async getGame(props: {
    id: CollectionEntry<"games">["id"];
    includeCreator?: boolean;
  }) {
    const game = await getEntry("games", props.id);

    if (!game) {
      throw new Error("DLAstro.getGame: Game not found");
    }

    if (props.includeCreator) {
      const creator = await getEntry("creators", game.data.creator.id);
      return { game, creator };
    }

    return { game };
  },
  async getAllGamesWithCreator(props: { includeAssets?: boolean }) {
    const games = await getCollection("games");

    const gamesWithCreators = await Promise.all(
      games.map(async (game) => {
        const creator = await getEntry("creators", game.data.creator.id);

        if (!creator) {
          throw new Error("DLAstro.getAllGamesWithCreator: Creator not found");
        }

        const assets = props.includeAssets
          ? await getCollection("assets", (item) => {
              return item.data.game.id === game.id;
            })
          : [];

        return {
          game,
          creator,
          assets,
        };
      }),
    );

    return { games: gamesWithCreators };
  },
  // ASSET
  async getAssetWithGameAndCreator(props: {
    id: CollectionEntry<"assets">["id"];
  }) {
    const asset = await getEntry("assets", props.id);

    if (!asset) {
      throw new Error("DLAstro.getAssetWithGameAndCreator: Asset not found");
    }

    const game = await getEntry(asset.data.game);
    const creator = await getEntry(game.data.creator);
    return {
      asset: asset!,
      game: game!,
      creator: creator!,
    };
  },
  async getAssetsForGame(props: { id: CollectionEntry<"games">["id"] }) {
    const assets = await getCollection("assets", ({ data }) => {
      return data.game.id === props.id;
    });

    return { assets };
  },
  // RESOURCE
  async getResource(props: {
    id: CollectionEntry<"resources">["id"];
    includeCreator?: boolean;
  }) {
    const [creatorId, resourceId, locale] = props.id.split("/");
    const idWithoutLocale = [creatorId, resourceId].join("/");
    const currentLocale = locale || "en";
    const resource = await getEntry("resources", props.id);
    const translations = await getCollection("resources", (element) => {
      return element.id.startsWith(idWithoutLocale);
    });

    if (!resource) {
      throw new Error("DLAstro.getResource: Resource not found");
    }

    const locales = translations
      .map((element) => {
        const language = element.id
          .replace(idWithoutLocale, "")
          .replace("/", "");
        return language || "en";
      })
      .sort((a, b) => {
        if (a === "en") {
          return -1;
        }
        if (b === "en") {
          return 1;
        }

        return a.localeCompare(b);
      });

    resource.data._locale = currentLocale;
    resource.data._idWithoutLocale = idWithoutLocale;

    if (props.includeCreator) {
      const creator = await getEntry("creators", resource.data.creator.id);
      return { resource, creator, locales };
    }

    return { resource, locales };
  },
  async getAllResourcesWithCreator(props: { includeTranslations?: boolean }) {
    const resources = await getCollection("resources", (resource) => {
      const isTranslation = resource.id.split("/").length === 3;

      if (isTranslation && !props.includeTranslations) {
        return false;
      }

      return true;
    });

    const resourcesWithCreators = await Promise.all(
      resources.map(async (resource) => {
        const creator = await getEntry("creators", resource.data.creator.id);

        if (!creator) {
          throw new Error(
            "DLAstro.getAllResourcesWithCreator: Creator not found",
          );
        }

        return {
          resource,
          creator,
        };
      }),
    );

    return { resources: resourcesWithCreators };
  },
};
