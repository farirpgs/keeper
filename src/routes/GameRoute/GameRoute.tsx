import { ExternalLinkIcon } from "@radix-ui/react-icons";
import type { CollectionEntry } from "astro:content";
import clsx from "clsx";
import { MDXH1, MDXH4, MDXProseWrapper } from "../../components/client/MDX/MDX";
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
        <div className="flex flex-col gap-9">
          <div className="flex flex-col-reverse gap-9 md:flex-row">
            <div className="w-full md:w-[60%]">
              <div className="flex flex-col gap-4">
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

                <MDXProseWrapper>{props.children}</MDXProseWrapper>
              </div>
            </div>
            <div className="w-full md:w-[40%]">
              <div className={"sticky top-8 rounded-lg"}>
                <div className="flex flex-col gap-4">
                  <UI.Card>
                    <div className="flex flex-col gap-4">
                      {props.gameCover}
                      <CreateNewCampaignButton gameId={props.game.id} />
                      <UI.Card variant="surface">
                        <div className="flex flex-col gap-4">
                          <UI.Text
                            size="4"
                            className={clsx(
                              "font-bold",
                              "pointer-events-none w-full text-center transition-all",
                            )}
                            color="gray"
                          >
                            Included assets
                          </UI.Text>

                          {props.assets.length > 0 && (
                            <div className="flex flex-row flex-wrap justify-center gap-2">
                              {props.assets.map((asset) => (
                                <div key={asset.id}>
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
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </UI.Card>
                    </div>
                  </UI.Card>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CampaignContext.Provider>
    </UI.Theme>
  );
}
