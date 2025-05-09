import {
  EyeClosedIcon,
  EyeOpenIcon,
  HamburgerMenuIcon,
} from "@radix-ui/react-icons";
import type { CollectionEntry } from "astro:content";
import clsx from "clsx";
import { Check, FilePlus2, RefreshCw, Smartphone } from "lucide-react";
import { useEffect, useState } from "react";
import { NothingToShowHere } from "../../components/client/NothingToShowHere/NothingToShowHere";
import { getSurfaceStyle } from "../../components/client/Surface/getSurfaceStyle";
import { GameWarningBanner } from "../../components/server/GameWarningBanner/GameWarningBanner";
import { UI } from "../../components/ui/ui";
import {
  CampaignContext,
  useCampaign,
} from "../../domains/campaign/useCampaign";
import { getLogger } from "../../domains/utils/getLogger";
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
    <UI.Theme {...props.theme} hasBackground={false}>
      <div className="flex flex-col gap-5">
        <GameWarningBanner></GameWarningBanner>
        <div className="hidden lg:block">
          {id && (
            <Game
              id={id}
              game={props.game}
              creator={props.creator}
              assets={props.assets}
            ></Game>
          )}
        </div>
        <div className="lg:hidden">
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
        </div>
      </div>
    </UI.Theme>
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
        <div className="flex flex-col gap-4">
          <div className="flex flex-row items-center gap-4">
            <UI.TextField.Root
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
            <div className="flex flex-row items-center gap-2">
              <UI.Tooltip
                content={
                  <>
                    {props.game.data.name} / {selectedCampaignAsset?.data.name}
                  </>
                }
              >
                <UI.Badge variant="soft" size="3">
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
                </UI.Badge>
              </UI.Tooltip>
            </div>
          </div>
          <div className="flex flex-row gap-9">
            <div
              className="flex max-w-[272px] min-w-[272px] flex-col gap-4 rounded-(--radius-2) p-4"
              style={{
                ...getSurfaceStyle(),
              }}
            >
              <UI.Tabs.Root value={tab}>
                <UI.Tabs.List size="2" justify={"center"}>
                  <UI.Tabs.Trigger
                    value="library"
                    className=""
                    onClick={() => setTab("library")}
                  >
                    Library
                  </UI.Tabs.Trigger>
                  <UI.Tabs.Trigger
                    value="assets"
                    className=""
                    onClick={() => setTab("assets")}
                  >
                    My Assets
                  </UI.Tabs.Trigger>
                </UI.Tabs.List>

                <div className="mt-2 pt-3">
                  <UI.Tabs.Content value="library">
                    <div className="flex flex-col gap-2 px-2">
                      {props.assets.map((asset, i) => {
                        const isAdding = addingAssetId === asset.id;
                        return (
                          <div key={i}>
                            <UI.Tooltip
                              content={`Add a new "${asset.data.name} ${asset.data.version}" to my assets`}
                            >
                              <UI.Button
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
                              </UI.Button>
                            </UI.Tooltip>
                          </div>
                        );
                      })}
                    </div>
                  </UI.Tabs.Content>
                  <UI.Tabs.Content value="assets">
                    <div className="flex flex-col gap-2 px-2">
                      {campaignAssetIds.length === 0 && (
                        <>
                          <NothingToShowHere
                            description={
                              <>
                                You don't have any assets yet.{" "}
                                <UI.Link
                                  onClick={() => setTab("library")}
                                  className=""
                                >
                                  Click here
                                </UI.Link>{" "}
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
                          <div key={assetId} className="flex gap-2">
                            <UI.Button
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
                              <UI.Text truncate>
                                {assetName || asset.data.name}
                              </UI.Text>
                              <UI.DropdownMenu.Root>
                                <UI.DropdownMenu.Trigger className="ml-auto">
                                  <UI.Button
                                    asChild
                                    variant="ghost"
                                    className="cursor-auto transition-all duration-75"
                                  >
                                    <span>
                                      <HamburgerMenuIcon />
                                      <UI.DropdownMenu.TriggerIcon />
                                    </span>
                                  </UI.Button>
                                </UI.DropdownMenu.Trigger>
                                <UI.DropdownMenu.Content>
                                  <UI.DropdownMenu.Item
                                    color="gray"
                                    className={clsx(isFirst && "hidden")}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleMoveAssetUp({ id: assetId });
                                    }}
                                  >
                                    Move Up
                                  </UI.DropdownMenu.Item>
                                  <UI.DropdownMenu.Item
                                    color="gray"
                                    className={clsx(isLast && "hidden")}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleMoveAssetDown({ id: assetId });
                                    }}
                                  >
                                    Move Down
                                  </UI.DropdownMenu.Item>
                                  {(!isFirst || !isLast) && (
                                    <UI.DropdownMenu.Separator />
                                  )}
                                  <UI.DropdownMenu.Item
                                    color="red"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleRemoveAsset({ id: assetId });
                                    }}
                                  >
                                    Delete
                                  </UI.DropdownMenu.Item>
                                </UI.DropdownMenu.Content>
                              </UI.DropdownMenu.Root>
                            </UI.Button>
                          </div>
                        );
                      })}
                    </div>
                  </UI.Tabs.Content>
                </div>
              </UI.Tabs.Root>
            </div>
            <div className="flex flex-grow flex-col gap-4">
              <UI.Skeleton loading={campaignManager.loading} height={"60vh"}>
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
              </UI.Skeleton>
            </div>
          </div>
        </div>
      </form>
    </CampaignContext.Provider>
  );
}
