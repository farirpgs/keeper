import { getCollection, getEntry, type CollectionEntry } from "astro:content";

export const DLAstro = {
  // CREATOR
  async getAllCreators() {
    const creators = await getCollection("creators");
    return { creators };
  },
  async getCreator(props: {
    slug: CollectionEntry<"creators">["id"];
    includeGames?: boolean;
    includeResources?: boolean;
  }) {
    const creator = await getEntry("creators", props.slug);

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
    slug: CollectionEntry<"games">["id"];
    includeCreator?: boolean;
  }) {
    const game = await getEntry("games", props.slug);

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
    slug: CollectionEntry<"assets">["id"];
  }) {
    const asset = await getEntry("assets", props.slug);

    const game = await getEntry(asset.data.game);
    const creator = await getEntry(game.data.creator);
    return {
      asset: asset!,
      game: game!,
      creator: creator!,
    };
  },
  async getAssetsForGame(props: { slug: CollectionEntry<"games">["id"] }) {
    const assets = await getCollection("assets", ({ data }) => {
      return data.game.id === props.slug;
    });

    return { assets };
  },
  // RESOURCE
  async getResource(props: {
    slug: CollectionEntry<"resources">["id"];
    includeCreator?: boolean;
  }) {
    const [creatorSlug, resourceSlug, locale] = props.slug.split("/");
    const slugWithoutLocale = [creatorSlug, resourceSlug].join("/");
    const currentLocale = locale || "en";
    const resource = await getEntry("resources", props.slug);
    const translations = await getCollection("resources", (element) => {
      return element.id.startsWith(slugWithoutLocale);
    });

    const locales = translations
      .map((element) => {
        const language = element.id
          .replace(slugWithoutLocale, "")
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
    resource.data._slugWithoutLocale = slugWithoutLocale;

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

        return {
          resource,
          creator,
        };
      }),
    );

    return { resources: resourcesWithCreators };
  },
};
