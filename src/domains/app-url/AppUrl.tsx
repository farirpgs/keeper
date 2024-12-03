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
  kofi() {
    return "https://ko-fi.com/farirpgs";
  },
  patreon() {
    return "https://www.patreon.com/bePatron?u=43408921";
  },
  creator(props: { slug: CollectionEntry<"creators">["id"] }) {
    return `/creators/${props.slug}/`;
  },
  game(props: { slug: CollectionEntry<"games">["id"] }) {
    return `/games/${props.slug}/`;
  },
  resource(props: { slug: CollectionEntry<"resources">["id"] }) {
    return `/resources/${props.slug}/`;
  },
  resourcePage(props: {
    slug: CollectionEntry<"resources">["id"];
    page: string;
  }) {
    const [creatorSegment, resourceSegment, languageSegment] =
      props.slug.split("/");

    const pageSegment = props.page ? `${props.page}/` : "";
    if (languageSegment) {
      return `/resources/${creatorSegment}/${resourceSegment}.${languageSegment}/${pageSegment}`;
    }
    return `/resources/${props.slug}/${pageSegment}`;
  },
  asset(props: { slug: CollectionEntry<"assets">["id"] }) {
    return `/games/${props.slug}/`;
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
  githubResource(props: {
    slug: CollectionEntry<"resources">["id"];
    page: string;
  }) {
    return `https://github.com/farirpgs/keeper/tree/main/src/content/resources/${props.slug}/index.mdx#${props.page}/`;
  },
};
