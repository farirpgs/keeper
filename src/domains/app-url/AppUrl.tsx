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
  }) {
    const [creatorSegment, resourceSegment, languageSegment] =
      props.id.split("/");

    const pageSegment = props.page ? `${props.page}/` : "";
    if (languageSegment) {
      return `/resources/${creatorSegment}/${resourceSegment}.${languageSegment}/${pageSegment}`;
    }
    return `/resources/${props.id}/${pageSegment}`;
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
    return `https://github.com/farirpgs/keeper/tree/main/src/content/resources/${props.id}/index.mdx#${props.page}/`;
  },
};
