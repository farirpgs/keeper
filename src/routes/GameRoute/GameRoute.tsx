import { ExternalLinkIcon } from "@radix-ui/react-icons";
import type { CollectionEntry } from "astro:content";
import clsx from "clsx";
import { MDXH1, MDXH4, MDXWrapper } from "../../components/client/MDX/MDX";
import { UI } from "../../components/ui/ui";
import { AppUrl } from "../../domains/app-url/AppUrl";
import {
  CampaignContext,
  useCampaign,
} from "../../domains/campaign/useCampaign";
import type { ThemeType } from "../../domains/utils/getTheme";
import { CreateNewCampaignButton } from "./components/CreateNewCampaignButton";

export function GameRoute(props: {
  game: CollectionEntry<"games">;
  creator: CollectionEntry<"creators">;
  assets: Array<CollectionEntry<"assets">>;
  currentAsset?: CollectionEntry<"assets">;
  children: React.ReactNode;
  gameCover?: React.ReactNode;
  theme: ThemeType;
}) {
  const campaignManager = useCampaign({
    id: "",
    readonly: true,
  });

  return (
    <UI.Theme {...props.theme} hasBackground={false}>
      <CampaignContext.Provider value={campaignManager}>
        <UI.Flex direction="column" gap="9">
          <UI.Flex
            direction={{
              initial: "column-reverse",
              md: "row",
            }}
            gap="9"
          >
            <UI.Box
              width={{
                initial: "auto",
                md: "60%",
              }}
            >
              <UI.Flex direction="column" gap="4">
                <MDXH1 className="mt-0 mb-0">{props.game.data.name}</MDXH1>
                <MDXH4 color="gray" className="mt-0 mb-0" size="6">
                  <UI.Link
                    href={AppUrl.creator({
                      id: props.creator.id,
                    })}
                    color="gray"
                    className="hover:text-(--accent-12)"
                  >
                    By {props.creator.data.name}
                  </UI.Link>
                </MDXH4>

                <MDXWrapper>{props.children}</MDXWrapper>
              </UI.Flex>
            </UI.Box>
            <UI.Box
              width={{
                initial: "auto",
                md: "40%",
              }}
            >
              <UI.Box className={"sticky top-8 rounded-lg"}>
                <UI.Flex direction={"column"} gap="4">
                  <UI.Card>
                    <UI.Flex gap="4" direction="column">
                      {props.gameCover}
                      <CreateNewCampaignButton gameId={props.game.id} />
                      <UI.Card variant="surface">
                        <UI.Flex gap="4" direction={"column"}>
                          <UI.Text
                            size="4"
                            className={clsx(
                              "font-bold",
                              "pointer-events-none w-full text-center transition-all",
                            )}
                            color="gray"
                          >
                            Include assets
                          </UI.Text>

                          <UI.Flex
                            gap="2"
                            direction="row"
                            justify={"center"}
                            wrap={"wrap"}
                          >
                            {props.assets.map((asset) => (
                              <UI.Box key={asset.id}>
                                <a href={AppUrl.asset({ id: asset.id })}>
                                  <UI.Button
                                    size="2"
                                    className={clsx(
                                      "font-bold",
                                      "transition-all",
                                    )}
                                    color="gray"
                                    variant="soft"
                                  >
                                    <ExternalLinkIcon></ExternalLinkIcon>
                                    {asset.data.name}
                                  </UI.Button>
                                </a>
                              </UI.Box>
                            ))}
                          </UI.Flex>
                        </UI.Flex>
                      </UI.Card>
                    </UI.Flex>
                  </UI.Card>
                </UI.Flex>
              </UI.Box>
            </UI.Box>
          </UI.Flex>
        </UI.Flex>
      </CampaignContext.Provider>
    </UI.Theme>
  );
}
