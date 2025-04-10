import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import {
  Badge,
  Flex,
  Grid,
  SegmentedControl,
  Skeleton,
  TextField,
} from "@radix-ui/themes";
import { useEffect, useRef, useState } from "react";
import { Card } from "../../components/client/Card/Card";
import { MDXH1, MDXH2 } from "../../components/client/MDX/MDX";
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
  const queryString = new URLSearchParams(window.location.search);
  const queryParam = queryString?.get("query") as string;
  const typeParam = queryString?.get("type") as SearchType;
  const shouldSetTypeParam =
    typeParam && Object.keys(searchTypes).includes(typeParam);

  const [query, setQuery] = useState<string>(queryParam || "");
  const [type, setType] = useState<SearchType>(
    shouldSetTypeParam ? typeParam : "all",
  );

  const [results, setResults] = useState<Array<SearchIndexType>>([]);
  const [searching, setSearching] = useState<boolean | null>(null);
  const timeout = useRef<Timer | null>(null);
  const shouldDisplayFilters = !typeParam;

  useEffect(() => {
    if (timeout.current) {
      clearTimeout(timeout.current);
    }

    const timeOutTime = searching === null ? 0 : 200;
    setSearching(true);
    timeout.current = setTimeout(() => {
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
      const shuffledResults = shuffleWithSeed(
        newResults,
        currentDateOfTheMonth,
      );
      const resourcesAndThenGames = [...shuffledResults].sort((a, b) => {
        if (a.type === b.type) {
          return 0;
        }
        return a.type === "resources" ? -1 : 1;
      });

      const sortedResults = resourcesAndThenGames.sort((a, b) => {
        return b.weight - a.weight;
      });

      setResults(sortedResults);
      setSearching(false);
    }, timeOutTime);

    return () => {
      if (timeout.current) {
        clearTimeout(timeout.current);
      }
    };
  }, [query, type]);

  return (
    <>
      <MDXH1>
        {<>Search</>}
        {type === "all" ? "" : ` ${searchTypes[type]}`}
      </MDXH1>

      <Flex direction={{ initial: "column", sm: "row" }} gap="4">
        <TextField.Root
          placeholder="Search..."
          size="3"
          color="gray"
          variant="soft"
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoComplete="off"
          className="w-full"
        >
          <TextField.Slot>
            <MagnifyingGlassIcon height="16" width="16" />
          </TextField.Slot>
        </TextField.Root>
        {shouldDisplayFilters && (
          <SegmentedControl.Root value={type} size={"3"}>
            {Object.keys(searchTypes).map((key) => {
              return (
                <SegmentedControl.Item
                  key={key}
                  value={key}
                  onClick={() => {
                    setQuery((prev) => {
                      return prev;
                    });
                    return setType(key as SearchType);
                  }}
                >
                  {(searchTypes as any)[key]}
                </SegmentedControl.Item>
              );
            })}
          </SegmentedControl.Root>
        )}
      </Flex>
      {searching !== null && (
        <Skeleton loading={searching} height={"30vh"}></Skeleton>
      )}

      {searching === false && (
        <>
          <MDXH2 color="gray">
            {results.length} result{results.length === 1 ? "" : "s"}
          </MDXH2>

          <Grid
            columns={{
              sm: "2",
              md: "3",
            }}
            gap="6"
            width="auto"
          >
            {results.map((item) => {
              return (
                <Card
                  key={item.href}
                  href={item.href}
                  title={item.title}
                  subtitle={item.subTitle}
                  accentColor={"gold"}
                  badge={
                    <>
                      <Badge
                        size="1"
                        variant={
                          item.type === "resources" ? "surface" : "surface"
                        }
                        color="gray"
                        highContrast={true}
                      >
                        {item.type === "games" ? "Game" : "Resource"}
                      </Badge>
                    </>
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
          </Grid>
        </>
      )}
    </>
  );
}
