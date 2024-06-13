import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import {
  AspectRatio,
  Button,
  Card,
  DropdownMenu,
  Flex,
  Grid,
  Skeleton,
  Text,
  Theme,
} from "@radix-ui/themes";
import type { CollectionEntry } from "astro:content";
import { useEffect, useState } from "react";
import { ClientDL } from "../../domains/ClientDL";
import { DLStorage } from "../../domains/DLStorage";
import { getLogger } from "../../domains/getLogger";
import type { GameType } from "../../domains/keeperSchema";

const logger = getLogger("GamesPage");

export function GamesPage(props: {}) {
  const [games, setGames] = useState<Record<string, GameType>>({});

  const gamesList = Object.entries(games).map(([id, game]) => ({
    id,
    ...game,
  }));

  useEffect(() => {
    const games = DLStorage.getStorage().games;
    setGames(games);
  }, []);

  function handleDelete(gameId: string) {
    DLStorage.removeGame(gameId);
    setGames(DLStorage.getStorage().games);
  }

  return (
    <Theme
      accentColor="gold"
      radius="full"
      appearance="dark"
      panelBackground="translucent"
      hasBackground={false}
    >
      <Grid
        columns={{
          sm: "2",
          lg: "3",
        }}
        gap="6"
        width="auto"
      >
        {gamesList?.map((game) => (
          <GameCard
            key={game.id}
            name={game.gameState.name}
            id={game.id}
            slug={game.slug}
            onDelete={handleDelete}
          ></GameCard>
        ))}
      </Grid>
    </Theme>
  );
}

function GameCard(props: {
  id: string;
  slug: string;
  name: string;
  onDelete: (id: string) => void;
}) {
  const [gameWithCreator, setGameWithCreator] = useState<{
    game: CollectionEntry<"games">;
    creator: CollectionEntry<"creators">;
  }>();

  function handleDelete() {
    props.onDelete(props.id);
  }

  useEffect(() => {
    let ignore = false;
    main();
    async function main() {
      if (!props.id || !props.slug) {
        return;
      }
      try {
        logger.log("Fetching game card");
        const result = await ClientDL.getGameWithCreator({
          slug: props.slug,
        });

        logger.log("Setting states");

        if (ignore) {
          return;
        }
        setGameWithCreator(result);
      } catch (error) {
        logger.error("Failed to load game", { error });
      }
    }

    return () => {
      ignore = true;
    };
  }, [props.id, props.slug]);

  return (
    <Skeleton loading={!gameWithCreator}>
      <Card className="hover:bg-[--accent-4]">
        <a href={`/play/${props.slug}?id=${props.id}`}>
          <Flex gap="2" align="start" direction={"column"}>
            <AspectRatio ratio={4 / 3}>
              {gameWithCreator && (
                <img
                  src={gameWithCreator.game.data.image}
                  alt={gameWithCreator.game.data.name}
                  style={{
                    objectFit: "cover",
                    width: "100%",
                    height: "100%",
                  }}
                />
              )}
            </AspectRatio>
            <Flex gap="2" justify={"between"} width={"100%"}>
              <Text as="div" size="6" weight="bold">
                {props.name || gameWithCreator?.game.data.name}
              </Text>
              <DropdownMenu.Root>
                <DropdownMenu.Trigger>
                  <Button variant="soft">
                    <HamburgerMenuIcon />
                    <DropdownMenu.TriggerIcon />
                  </Button>
                </DropdownMenu.Trigger>
                <DropdownMenu.Content>
                  <DropdownMenu.Item color="red" onClick={handleDelete}>
                    Delete
                  </DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu.Root>
            </Flex>
          </Flex>
        </a>
      </Card>
    </Skeleton>
  );
}