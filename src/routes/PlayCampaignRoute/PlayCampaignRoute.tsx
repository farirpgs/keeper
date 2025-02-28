import { Check, FilePlus2, RefreshCw, Smartphone } from "lucide-react";

import {
  Badge,
  Box,
  Button,
  DropdownMenu,
  Flex,
  Link,
  Skeleton,
  Tabs,
  Text,
  TextField,
  Theme,
  Tooltip,
} from "@radix-ui/themes";
import type { CollectionEntry } from "astro:content";
import { useEffect, useState } from "react";
import { getLogger } from "../../domains/utils/getLogger";

import {
  EyeClosedIcon,
  EyeOpenIcon,
  HamburgerMenuIcon,
} from "@radix-ui/react-icons";
import clsx from "clsx";
import { NothingToShowHere } from "../../components/client/NothingToShowHere/NothingToShowHere";
import { getSurfaceStyle } from "../../components/client/Surface/getSurfaceStyle";
import { GameWarningBanner } from "../../components/server/GameWarningBanner/GameWarningBanner";
import {
  CampaignContext,
  useCampaign,
} from "../../domains/campaign/useCampaign";
import type { ThemeType } from "../../domains/utils/getTheme";
import { wait } from "../../domains/utils/wait";
import { GameAsset } from "./components/GameAsset";

const logger = getLogger("PlayCreatorGamePage");

export function PlayCampaignRoute(props: {
  game: CollectionEntry<"games">;
  creator: CollectionEntry<"creators">;
  assets: Array<CollectionEntry<"assets">>;
  theme: ThemeType;
}) {
  const [id, setId] = useState<string>();

  useEffect(() => {
    const idFromParams = new URLSearchParams(window.location.search).get("id");

    if (!idFromParams) {
      throw logger.error("No id provided");
    }

    setId(idFromParams);
  }, []);

  return (
    <Theme {...props.theme} hasBackground={false}>
      <Flex gap="5" direction="column">
        <GameWarningBanner></GameWarningBanner>
        <Box className="hidden lg:block">
          {id && (
            <Game
              id={id}
              game={props.game}
              creator={props.creator}
              assets={props.assets}
            ></Game>
          )}
        </Box>
        <Box className="lg:hidden">
          <NothingToShowHere
            icon={Smartphone}
            title={"Open on Desktop"}
            description={
              <>
                This page is not meant to be viewed on mobile. Please make your
                window bigger or open it in a desktop browser.
              </>
            }
          ></NothingToShowHere>
        </Box>
      </Flex>
    </Theme>
  );
}

const possibleTabs = {
  assets: "My Assets",
  library: "Library",
} as const;
type TabType = [keyof typeof possibleTabs][0];

function Game(props: {
  id: string;
  game: CollectionEntry<"games">;
  creator: CollectionEntry<"creators">;
  assets: Array<CollectionEntry<"assets">>;
}) {
  const [tab, setTab] = useState<TabType>("assets");
  const [addingAssetId, setAddingAssetId] = useState<string>();
  const [selectAssetId, setSelectAssetId] = useState<string>();
  const campaignManager = useCampaign({
    id: props.id,
    onLoadCampaign: (campaign) => {
      const hasAssets = Object.keys(campaign.assets).length > 0;
      setTab(hasAssets ? "assets" : "library");
    },
  });
  const campaignAssets = campaignManager.campaign?.assets || {};
  const campaignAssetIds = Object.keys(campaignAssets);
  const selectedAssetSlug =
    campaignAssets[campaignManager.selectedAssetId!]?.slug;
  const selectedCampaignAsset = props.assets.find(
    (asset) => asset.id === selectedAssetSlug,
  );

  useEffect(() => {
    // Wait for the current asset to save before loading the next one
    if (campaignManager.dirty) {
      return;
    }
    if (selectAssetId) {
      campaignManager.setSelectedAssetId(selectAssetId);
      setSelectAssetId(undefined);
    }
  }, [campaignManager.dirty, selectAssetId]);

  async function handleAddAsset(p: { asset: CollectionEntry<"assets"> }) {
    setAddingAssetId(p.asset.id);
    await wait();
    campaignManager.addAsset({ slug: p.asset.id });
    setTab("assets");
    setAddingAssetId(undefined);
  }

  function handleLoadAsset(p: { id: string }) {
    setSelectAssetId(p.id);
  }

  function handleRemoveAsset(p: { id: string }) {
    campaignManager.removeAsset({ id: p.id });
  }

  function handleMoveAssetUp(p: { id: string }) {
    campaignManager.moveAssetUp({ id: p.id });
  }

  function handleMoveAssetDown(p: { id: string }) {
    campaignManager.moveAssetDown({ id: p.id });
  }

  return (
    <CampaignContext.Provider value={campaignManager}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
        }}
        ref={campaignManager.formRef}
      >
        <Flex direction={"column"} gap="4">
          <Flex direction="row" gap="4" align="center">
            <TextField.Root
              size="3"
              color="gray"
              placeholder={"Enter campaign name..."}
              className={clsx(
                "h-[4rem] w-full text-[2rem] shadow-none",
                "[&>input]:h-[4rem]",
              )}
              autoComplete="off"
              value={campaignManager.campaign?.name || ""}
              onChange={(e) => {
                campaignManager.setCampaignName({ name: e.target.value });
              }}
            />
            <Flex direction="row" gap="2" align="center">
              <Tooltip
                content={
                  <>
                    {props.game.data.name} / {selectedCampaignAsset?.data.name}
                  </>
                }
              >
                <Badge variant="soft" size="3">
                  {campaignManager.dirty ? (
                    <>
                      <RefreshCw size="15"></RefreshCw>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Check size="15"></Check>
                      Saved
                    </>
                  )}
                </Badge>
              </Tooltip>
            </Flex>
          </Flex>
          <Flex direction="row" gap="9">
            <Flex
              direction="column"
              gap="4"
              style={{
                ...getSurfaceStyle(),
              }}
              className="max-w-[272px] min-w-[272px] rounded-(--radius-2) p-4"
            >
              <Tabs.Root value={tab}>
                <Tabs.List size="2" justify={"center"}>
                  <Tabs.Trigger
                    value="library"
                    className=""
                    onClick={() => setTab("library")}
                  >
                    Library
                  </Tabs.Trigger>
                  <Tabs.Trigger
                    value="assets"
                    className=""
                    onClick={() => setTab("assets")}
                  >
                    My Assets
                  </Tabs.Trigger>
                </Tabs.List>

                <Box pt="3" mt="2">
                  <Tabs.Content value="library">
                    <Flex direction="column" gap="2" px="2">
                      {props.assets.map((asset, i) => {
                        const isAdding = addingAssetId === asset.id;
                        return (
                          <div key={i}>
                            <Tooltip
                              content={`Add a new "${asset.data.name} ${asset.data.version}" to my assets`}
                            >
                              <Button
                                size="2"
                                loading={isAdding}
                                color="gray"
                                variant="outline"
                                className="w-full text-left"
                                onClick={() => {
                                  handleAddAsset({ asset: asset });
                                }}
                              >
                                <FilePlus2 size="15"></FilePlus2>
                                {asset.data.name} {asset.data.version}
                              </Button>
                            </Tooltip>
                          </div>
                        );
                      })}
                    </Flex>
                  </Tabs.Content>
                  <Tabs.Content value="assets">
                    <Flex direction="column" gap="2" px="2">
                      {campaignAssetIds.length === 0 && (
                        <>
                          <NothingToShowHere
                            description={
                              <>
                                You don't have any assets yet.{" "}
                                <Link
                                  onClick={() => setTab("library")}
                                  className=""
                                >
                                  Click here
                                </Link>{" "}
                                to add one from the game's library.
                              </>
                            }
                          ></NothingToShowHere>
                        </>
                      )}
                      {campaignAssetIds.map((assetId, i) => {
                        const id = campaignAssets[assetId].slug;
                        const asset = props.assets.find(
                          (asset) => asset.id === id,
                        )!;
                        const isSelected =
                          assetId === campaignManager.selectedAssetId;
                        const isFirst = i === 0;
                        const isLast = i === campaignAssetIds.length - 1;
                        const assetName = campaignAssets[assetId].state["name"];

                        return (
                          <Flex key={assetId} gap="2">
                            <Button
                              size="2"
                              color={isSelected ? undefined : "gray"}
                              variant={"soft"}
                              className="w-full justify-start text-left"
                              loading={selectAssetId === assetId}
                              onClick={() => {
                                handleLoadAsset({ id: assetId });
                              }}
                            >
                              {isSelected ? <EyeOpenIcon /> : <EyeClosedIcon />}
                              <Text truncate>
                                {assetName || asset.data.name}
                              </Text>
                              <DropdownMenu.Root>
                                <DropdownMenu.Trigger className="ml-auto">
                                  <Button
                                    asChild
                                    variant="ghost"
                                    className="cursor-auto transition-all duration-75"
                                  >
                                    <span>
                                      <HamburgerMenuIcon />
                                      <DropdownMenu.TriggerIcon />
                                    </span>
                                  </Button>
                                </DropdownMenu.Trigger>
                                <DropdownMenu.Content>
                                  <DropdownMenu.Item
                                    color="gray"
                                    className={clsx(isFirst && "hidden")}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleMoveAssetUp({ id: assetId });
                                    }}
                                  >
                                    Move Up
                                  </DropdownMenu.Item>
                                  <DropdownMenu.Item
                                    color="gray"
                                    className={clsx(isLast && "hidden")}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleMoveAssetDown({ id: assetId });
                                    }}
                                  >
                                    Move Down
                                  </DropdownMenu.Item>
                                  {(!isFirst || !isLast) && (
                                    <DropdownMenu.Separator />
                                  )}
                                  <DropdownMenu.Item
                                    color="red"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleRemoveAsset({ id: assetId });
                                    }}
                                  >
                                    Delete
                                  </DropdownMenu.Item>
                                </DropdownMenu.Content>
                              </DropdownMenu.Root>
                            </Button>
                          </Flex>
                        );
                      })}
                    </Flex>
                  </Tabs.Content>
                </Box>
              </Tabs.Root>
            </Flex>
            <Flex direction="column" gap="4" flexGrow={"1"}>
              <Skeleton loading={campaignManager.loading} height={"60vh"}>
                {selectedCampaignAsset ? (
                  <>
                    <GameAsset
                      id={campaignManager.selectedAssetId}
                      asset={selectedCampaignAsset}
                    ></GameAsset>
                  </>
                ) : (
                  <>
                    <NothingToShowHere
                      icon
                      title={"No asset selected"}
                      description={<>Select an asset to view it.</>}
                    ></NothingToShowHere>
                  </>
                )}
              </Skeleton>
            </Flex>
          </Flex>
        </Flex>
      </form>
    </CampaignContext.Provider>
  );
}
