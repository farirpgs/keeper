import type { CollectionEntry } from "astro:content";
import { Card } from "../../components/client/AppCard/AppCard";
import {
  MDXH1,
  MDXH2,
  MDXWrapper,
  getMdxComponents,
} from "../../components/client/MDX/MDX";
import { UI } from "../../components/ui/ui";
import { AppUrl } from "../../domains/app-url/AppUrl";
import { type ColorType, Colors } from "../../domains/colors/colors";
import { evaluateMdxSync } from "../../domains/mdx/evaluateMdx";
import { getRandomElement } from "../../domains/utils/random";

export function CreatorRoute(props: {
  creator: CollectionEntry<"creators">;
  games: Array<CollectionEntry<"games">>;
  resources: Array<CollectionEntry<"resources">>;
}) {
  const Content = evaluateMdxSync({
    mdx: props.creator.body!,
  });

  return (
    <UI.Flex direction="column" gap="5">
      <MDXH1>{props.creator.data.name}</MDXH1>

      <MDXWrapper>
        <Content
          components={{
            ...getMdxComponents({}),
          }}
        />
      </MDXWrapper>
      {renderResources()}
      {renderGames()}
    </UI.Flex>
  );

  function renderResources() {
    return (
      <>
        {props.resources.length > 0 && (
          <>
            <MDXH2>Resources</MDXH2>
            <UI.Grid
              columns={{
                sm: "2",
                md: "3",
              }}
              gap="6"
              width="auto"
            >
              {props.resources.map((resource) => (
                <Card
                  key={resource.id}
                  href={AppUrl.resource({ id: resource.id })}
                  title={resource.data.name}
                  subtitle={props.creator.data.name}
                  accentColor={
                    resource.data.image === undefined
                      ? getRandomElement<ColorType>(
                          Colors.getAccentColors() as any,
                          resource.data.name,
                        )
                      : undefined
                  }
                >
                  {resource.data.image && (
                    <img
                      loading={"eager"}
                      src={resource.data._optimizedImageSrc}
                      alt={resource.data.name}
                      style={{
                        position: "absolute",
                        objectFit: "cover",
                        objectPosition: "left",
                        width: "100%",
                        height: "100%",
                      }}
                    />
                  )}
                </Card>
              ))}
            </UI.Grid>
          </>
        )}
      </>
    );
  }

  function renderGames() {
    return (
      <>
        {props.games.length > 0 && (
          <>
            <MDXH2>Games</MDXH2>
            <UI.Grid
              columns={{
                sm: "2",
                lg: "3",
              }}
              gap="6"
              width="auto"
            >
              {props.games.map((game) => (
                <Card
                  key={game.id}
                  href={AppUrl.game({ id: game.id })}
                  title={game.data.name}
                  subtitle={props.creator.data.name}
                  accentColor={
                    game.data.image === undefined
                      ? getRandomElement<ColorType>(
                          Colors.getAccentColors() as any,
                          game.data.name,
                        )
                      : undefined
                  }
                >
                  {game.data.image && (
                    <img
                      loading={"eager"}
                      src={game.data._optimizedImageSrc}
                      alt={game.data.name}
                      style={{
                        position: "absolute",
                        objectFit: "cover",
                        objectPosition: "left",
                        width: "100%",
                        height: "100%",
                      }}
                    />
                  )}
                </Card>
              ))}
            </UI.Grid>
          </>
        )}
      </>
    );
  }
}
