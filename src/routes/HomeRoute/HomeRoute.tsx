import { Box, Button, Container, Flex, Grid, Text } from "@radix-ui/themes";
import type { CollectionEntry } from "astro:content";
import { Card } from "../../components/client/Card/Card";
import { MDXH1, MDXH2 } from "../../components/client/MDX/MDX";
import { AppUrl } from "../../domains/app-url/AppUrl";
import { Colors, type ColorType } from "../../domains/colors/colors";
import { getRandomElement } from "../../domains/utils/random";
import { Blinker } from "./components/Blinker";

export function HomeRoute(props: {
  topGames: Array<{
    game: CollectionEntry<"games">;
    creator: CollectionEntry<"creators">;
    assets: Array<CollectionEntry<"assets">>;
  }>;
  topResources: Array<{
    resource: CollectionEntry<"resources">;
    creator: CollectionEntry<"creators">;
  }>;
}) {
  return (
    <>
      {renderHeader()}
      {renderResources()}
      {renderGames()}
    </>
  );

  function renderHeader() {
    return (
      <Container size="4">
        <Flex
          direction={{
            initial: "column",
            md: "row",
          }}
          gap="3"
          className="my-3 lg:my-9"
          align={"center"}
        >
          <Box
            width={{
              initial: "100%",
              md: "70%",
            }}
          >
            <Flex align="start" justify="center" gap="4" direction={"column"}>
              <MDXH1 className="xs:text-[3rem] text-[2rem] leading-[normal] md:text-[4rem]">
                The best TTRPG
                <br />
                <Blinker
                  texts={[
                    "resource collection",
                    "dice roller",
                    "character keeper",
                  ]}
                />
              </MDXH1>
              <Text
                color="gray"
                size={{
                  initial: "3",
                  md: "4",
                }}
                mb="5"
              >
                Roll dice, store characters, and design your own worlds.
                <br /> Accessible, fast, and free.
              </Text>
              <Flex gap="4" className="flex-col md:flex-row">
                <a href="#get-started">
                  <Button size="4" radius="full" className="">
                    Get Started
                  </Button>
                </a>
                <a href={AppUrl.search({})}>
                  <Button size="4" radius="full" variant="outline" className="">
                    Search for content
                  </Button>
                </a>
              </Flex>
            </Flex>
          </Box>
          <Flex
            width={"40%"}
            justify="center"
            align={"center"}
            className="relative hidden md:flex"
          >
            <Box
              className="animate-blur absolute z-[-1] hidden h-[calc(100%+4rem)] w-[calc(100%+4rem)] rounded-lg opacity-60 dark:block"
              style={{
                backgroundImage:
                  "linear-gradient(to right top, var(--accent-10), var(--accent-7), var(--accent-8), var(--accent-9), var(--accent-11))",
              }}
            />
            <img
              loading={"eager"}
              src={"/keeper/logo (bg-black).svg"}
              alt="Keeper"
              width={1000}
              className={"rounded-2xl"}
            />
          </Flex>
        </Flex>
      </Container>
    );
  }

  function renderResources() {
    return (
      <>
        <Box pt="4" id="get-started">
          <MDXH2>Resources</MDXH2>
          <Text color="gray" size="3" mb="4">
            Explore list of free and open resources to use in your games or to
            use to make your own.
          </Text>
        </Box>
        <Grid
          columns={{
            sm: "2",
            md: "3",
          }}
          gap="6"
          width="auto"
        >
          {props.topResources.map((item) => {
            return (
              <Card
                key={item.resource.id}
                href={AppUrl.resource({
                  id: item.resource.id,
                })}
                title={item.resource.data.name}
                subtitle={item.creator.data.name}
                accentColor={
                  item.resource.data.image === undefined
                    ? getRandomElement<ColorType>(
                        Colors.getAccentColors() as any,
                        item.resource.data.name,
                      )
                    : undefined
                }
              >
                {item.resource.data.image ? (
                  <img
                    loading={"eager"}
                    src={item.resource.data._optimizedImageSrc}
                    alt={item.resource.data.name}
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

        <a
          href={AppUrl.search({
            type: "resources",
          })}
          className="flex justify-center align-middle"
        >
          <Button size="4" className="">
            View all
          </Button>
        </a>
      </>
    );
  }

  function renderGames() {
    return (
      <>
        <Flex pt="4" id="get-started" gap="2" direction="column">
          <MDXH2>Games</MDXH2>
          <Text color="gray" size="3" mb="4">
            Play free TTRPGs and campaigns made using templates from the
            community.
          </Text>
        </Flex>
        <Grid
          columns={{
            sm: "2",
            md: "3",
          }}
          gap="6"
          width="auto"
        >
          {props.topGames.map((item) => {
            return (
              <Card
                key={item.game.id}
                href={AppUrl.game({
                  id: item.game.id,
                })}
                title={item.game.data.name}
                subtitle={item.creator.data.name}
                accentColor={
                  item.game.data.image === undefined
                    ? getRandomElement<ColorType>(
                        Colors.getAccentColors() as any,
                        item.game.data.name,
                      )
                    : undefined
                }
              >
                {item.game.data.image ? (
                  <img
                    loading={"eager"}
                    src={item.game.data._optimizedImageSrc}
                    alt={item.game.data.name}
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
        <a
          href={AppUrl.search({
            type: "games",
          })}
          className="flex justify-center align-middle"
        >
          <Button size="4" className="">
            View all
          </Button>
        </a>
      </>
    );
  }
}
