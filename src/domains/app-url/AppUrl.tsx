import type { CollectionEntry } from "astro:content";
import type { SearchType } from "../../routes/SearchRoute/SearchRoute";

export const AppUrl = {
  home() {
    return "/";
  },
  campaigns() {
    return "/campaigns/";
  },
  dice() {
    return "/dice/";
  },
  docs() {
    return "/docs/";
  },
  feedback() {
    return "https://farirpgs.canny.io/keeper-feedback";
  },
  kofi() {
    return "https://ko-fi.com/farirpgs";
  },
  patreon() {
    return "https://www.patreon.com/bePatron?u=43408921";
  },
  discord() {
    return "https://link.farirpgs.com/discord";
  },
  creator(props: { id: CollectionEntry<"creators">["id"] }) {
    return `/creators/${props.id}/`;
  },
  game(props: { id: CollectionEntry<"games">["id"] }) {
    return `/games/${props.id}/`;
  },
  resource(props: { id: CollectionEntry<"resources">["id"] }) {
    return `/resources/${props.id}/`;
  },
  resourcePage(props: {
    id: CollectionEntry<"resources">["id"];
    page: string;
    hash?: string;
  }) {
    const hash = props.hash ? `#${props.hash}` : "";
    const [creatorSegment, resourceSegment, languageSegment] =
      props.id.split("/");

    const pageSegment = props.page ? `${props.page}/` : "";
    if (languageSegment) {
      return `/resources/${creatorSegment}/${resourceSegment}.${languageSegment}/${pageSegment}${hash}`;
    }
    return `/resources/${props.id}/${pageSegment}${hash}`;
  },
  asset(props: { id: CollectionEntry<"assets">["id"] }) {
    return `/games/${props.id}/`;
  },
  search(props: { query?: string; type?: SearchType }) {
    const searchParams = new URLSearchParams();
    if (props.query) {
      searchParams.set("query", props.query);
    }
    if (props.type) {
      searchParams.set("type", props.type);
    }
    return `/search/?${searchParams.toString()}`;
  },
  github() {
    return `https://github.com/farirpgs/keeper`;
  },
  githubResource(props: {
    id: CollectionEntry<"resources">["id"];
    page: string;
  }) {
    const [creatorSegment, resourceSegment, languageSegment] =
      props.id.split("/");
    let filePath;
    if (languageSegment && languageSegment !== "en") {
      // Non-English locale: point to .../{locale}.mdx
      filePath = `${creatorSegment}/${resourceSegment}/${languageSegment}.mdx`;
    } else {
      // English or no locale: point to .../index.mdx
      filePath = `${creatorSegment}/${resourceSegment}/index.mdx`;
    }
    const hash = props.page ? `#${props.page}` : "";
    return `https://github.com/farirpgs/keeper/blob/main/src/content/resources/${filePath}${hash}`;
  },
};
