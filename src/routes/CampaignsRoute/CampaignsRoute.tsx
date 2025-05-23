import { DropdownMenu } from "@radix-ui/themes";
import type { CollectionEntry } from "astro:content";
import { useEffect, useState } from "react";
import { Card } from "../../components/client/AppCard/AppCard";
import { NothingToShowHere } from "../../components/client/NothingToShowHere/NothingToShowHere";
import { UI } from "../../components/ui/ui";

import { MDXH1 } from "../../components/client/MDX/MDX";
import { GameWarningBanner } from "../../components/server/GameWarningBanner/GameWarningBanner";
import { DLClient } from "../../domains/dl/DLClient";
import { DLStorage, type CampaignType } from "../../domains/dl/DLStorage";
import { getLogger } from "../../domains/utils/getLogger";
import type { ThemeType } from "../../domains/utils/getTheme";
import type { GameImagesType } from "../../pages/campaigns/index.astro";

const logger = getLogger("GamesPage");

export function CampaignsRoute(props: {
  theme: ThemeType;

  gameImages: GameImagesType;
}) {
  const [campaigns, setCampaigns] = useState<Record<string, CampaignType>>();
  const loading = !campaigns;
  const campaignList = Object.entries(campaigns || {}).map(([id, game]) => ({
    id,
    ...game,
  }));
  const empty = campaignList.length === 0;

  useEffect(() => {
    setCampaigns(DLStorage.getStorage().campaigns);
  }, []);

  function handleDelete(gameId: string) {
    DLStorage.removeCampaign({
      campaignId: gameId,
    });
    setCampaigns(DLStorage.getStorage().campaigns);
  }

  return (
    <UI.Theme {...props.theme} hasBackground={false}>
      <div className="flex flex-col gap-5">
        <GameWarningBanner></GameWarningBanner>
        <MDXH1>My Campaigns</MDXH1>
        <UI.Skeleton loading={loading} className="h-[50vh]">
          {!loading && (
            <>
              {empty && (
                <NothingToShowHere
                  icon
                  title={"You have no campaigns"}
                  description={
                    <>
                      Go to the <UI.Link href="/">homepage</UI.Link> and pick
                      one of the available games to get started.
                    </>
                  }
                />
              )}
              <div className="grid w-auto grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
                {campaignList?.map((campaign) => {
                  console.log("campaign", campaign);

                  return (
                    <GameCard
                      key={campaign.id}
                      name={campaign.name}
                      gameImages={props.gameImages}
                      id={campaign.id}
                      slug={campaign.slug}
                      onDelete={handleDelete}
                    ></GameCard>
                  );
                })}
              </div>
            </>
          )}
        </UI.Skeleton>
      </div>
    </UI.Theme>
  );
}

function GameCard(props: {
  id: string;
  slug: string;
  name: string;
  gameImages: GameImagesType;
  onDelete: (id: string) => void;
}) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
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
      setLoading(true);
      try {
        logger.log("Fetching game card");
        const result = await DLClient.getGameWithCreator({
          slug: props.slug,
        });

        logger.log("Setting states");

        if (ignore) {
          return;
        }
        setGameWithCreator(result);
      } catch (error) {
        if (ignore) {
          return;
        }
        setError(true);
        logger.error("Failed to get game", { error });
      } finally {
        if (ignore) {
          return;
        }
        setLoading(false);
      }
    }

    return () => {
      ignore = true;
    };
  }, [props.id, props.slug]);
  console.log("loading", loading);

  return (
    <UI.Skeleton loading={loading}>
      {!loading && (
        <>
          {!error && gameWithCreator ? (
            <Card
              href={`/play/${props.slug}?id=${props.id}`}
              title={props.name || gameWithCreator.game.data.name}
              menu={
                <>
                  <DropdownMenu.Item color="red" onClick={handleDelete}>
                    Delete
                  </DropdownMenu.Item>
                </>
              }
            >
              <img
                loading="eager"
                src={props.gameImages[gameWithCreator.game.id]}
                alt={gameWithCreator.game.data.name}
                style={{
                  position: "absolute",
                  objectFit: "cover",
                  objectPosition: "left",
                  width: "100%",
                  height: "100%",
                }}
              />
            </Card>
          ) : (
            <Card
              title={props.slug}
              error="(Not found)"
              menu={
                <>
                  <DropdownMenu.Item color="red" onClick={handleDelete}>
                    Delete
                  </DropdownMenu.Item>
                </>
              }
            ></Card>
          )}
        </>
      )}
    </UI.Skeleton>
  );
}
