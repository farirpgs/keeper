import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { useForm } from "@tanstack/react-form";
import { useEffect, useState } from "react";
import { Card } from "../../components/client/AppCard/AppCard";
import { MDXH1, MDXH2 } from "../../components/client/MDX/MDX";
import { UI } from "../../components/ui/ui";
import { shuffleWithSeed } from "../../domains/dl/shuffleWithSeed";

const searchTypes = {
  all: "All",
  games: "Games",
  resources: "Resources",
} as const;

export type SearchType = keyof typeof searchTypes;

const currentDateOfTheMonth = new Date().getDate();

export type SearchIndexType = {
  title: string;
  subTitle: string;
  weight: number;
  segments: Array<string>;
  imageMetaData:
    | {
        src: string;
        width: number;
        height: number;
        format:
          | "png"
          | "jpg"
          | "jpeg"
          | "tiff"
          | "webp"
          | "gif"
          | "svg"
          | "avif";
      }
    | undefined
    | null;
  imageSrc: string;
  type: SearchType;
  href: string;
};

export function SearchRoute(props: { indexes: Array<SearchIndexType> }) {
  const form = useForm({
    defaultValues: {
      query: "",
      type: "all" as SearchType,
    },
  });
  const [results, setResults] = useState<Array<SearchIndexType>>(() => {
    return getSearchResults();
  });
  const [searching, setSearching] = useState(true);

  useEffect(function initializeQueryParams() {
    const queryString = new URLSearchParams(window.location.search);
    const queryParam = queryString?.get("query") as string;
    const typeParam = queryString?.get("type") as SearchType;
    const shouldSetTypeParam =
      typeParam && Object.keys(searchTypes).includes(typeParam);

    form.setFieldValue("query", queryParam || "");
    form.setFieldValue("type", shouldSetTypeParam ? typeParam : "all");
    handleSearch();
  }, []);

  function handleSearch() {
    const sortedResults = getSearchResults();
    setResults(sortedResults);
    const queryStringParams = new URLSearchParams(window.location.search);
    const queryParam = form.getFieldValue("query");
    const typeParam = form.getFieldValue("type");
    if (queryParam) {
      queryStringParams.set("query", queryParam);
    } else {
      queryStringParams.delete("query");
    }
    if (typeParam) {
      queryStringParams.set("type", typeParam);
    } else {
      queryStringParams.delete("type");
    }
    window.history.replaceState({}, "", `?${queryStringParams.toString()}`);

    setSearching(false);
  }

  function getSearchResults() {
    const query = form.getFieldValue("query");
    const type = form.getFieldValue("type");

    const newResults = props.indexes.filter((index) => {
      const joinedSegments = index.segments.join(" ").toLowerCase();
      const queryMatch = joinedSegments.includes(query.toLowerCase());
      const typeMatch = type === "all" || index.type === type;
      if (type === "all") {
        return queryMatch;
      }
      if (query === "") {
        return typeMatch;
      }
      return queryMatch && typeMatch;
    });
    const shuffledResults = shuffleWithSeed(newResults, currentDateOfTheMonth);
    const resourcesAndThenGames = [...shuffledResults].sort((a, b) => {
      if (a.type === b.type) {
        return 0;
      }
      return a.type === "resources" ? -1 : 1;
    });
    const sortedResults = resourcesAndThenGames.sort((a, b) => {
      return b.weight - a.weight;
    });
    return sortedResults;
  }

  return (
    <>
      <form.Subscribe selector={(s) => s.values.type}>
        {(type) => {
          return (
            <MDXH1>
              {<span>Search</span>}
              {type === "all" ? "" : ` ${searchTypes[type]}`}
            </MDXH1>
          );
        }}
      </form.Subscribe>

      <div className="flex flex-col gap-4 sm:flex-row">
        <form.Field
          name="query"
          validators={{
            onChangeAsyncDebounceMs: 200,
            onChange: () => {
              setSearching(true);
            },
            onChangeAsync: () => {
              handleSearch();
            },
          }}
        >
          {(field) => {
            return (
              <UI.TextField.Root
                placeholder="Search..."
                size="3"
                color="gray"
                variant="soft"
                autoFocus
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                autoComplete="off"
                className="w-full"
              >
                <UI.TextField.Slot>
                  <MagnifyingGlassIcon height="16" width="16" />
                </UI.TextField.Slot>
              </UI.TextField.Root>
            );
          }}
        </form.Field>
        <form.Field name="type">
          {(field) => {
            return (
              <UI.SegmentedControl.Root value={field.state.value} size={"3"}>
                {Object.keys(searchTypes).map((key) => {
                  return (
                    <UI.SegmentedControl.Item
                      key={key}
                      value={key}
                      onClick={() => {
                        field.handleChange(key as SearchType);
                        handleSearch();
                      }}
                    >
                      {(searchTypes as any)[key]}
                    </UI.SegmentedControl.Item>
                  );
                })}
              </UI.SegmentedControl.Root>
            );
          }}
        </form.Field>
      </div>

      <UI.Skeleton loading={searching}>
        <MDXH2 color="gray">
          {results.length} result{results.length === 1 ? "" : "s"}
        </MDXH2>
      </UI.Skeleton>
      {searching && (
        <div className="grid w-auto grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
          {new Array(12).fill(1).map((_, index) => {
            return (
              <UI.Skeleton
                key={index}
                className="h-[250px] w-full rounded-lg"
              />
            );
          })}
        </div>
      )}
      <div className="grid w-auto grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
        {results.map((item) => {
          return (
            <Card
              key={item.href}
              href={item.href}
              title={item.title}
              subtitle={item.subTitle}
              accentColor={"gold"}
              badge={
                <UI.Badge
                  size="1"
                  variant={item.type === "resources" ? "surface" : "surface"}
                  color="gray"
                  highContrast={true}
                >
                  {item.type === "games" ? "Game" : "Resource"}
                </UI.Badge>
              }
            >
              {item.imageMetaData ? (
                <img
                  loading={"eager"}
                  src={item.imageSrc}
                  alt={item.title}
                  style={{
                    position: "absolute",
                    objectFit: "cover",
                    objectPosition: "left",
                    width: "100%",
                    height: "100%",
                  }}
                />
              ) : null}
            </Card>
          );
        })}
      </div>
    </>
  );
}
