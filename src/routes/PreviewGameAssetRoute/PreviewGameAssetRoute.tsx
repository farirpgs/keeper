import { InfoCircledIcon } from "@radix-ui/react-icons";
import type { CollectionEntry } from "astro:content";
import { Smartphone } from "lucide-react";
import {
  MDXH1,
  MDXH5,
  MDXSheetWrapper,
  getMdxComponents,
} from "../../components/client/MDX/MDX";
import { NothingToShowHere } from "../../components/client/NothingToShowHere/NothingToShowHere";
import { UI } from "../../components/ui/ui";
import { AppUrl } from "../../domains/app-url/AppUrl";
import {
  CampaignContext,
  useCampaign,
} from "../../domains/campaign/useCampaign";
import { evaluateMdxSync } from "../../domains/mdx/evaluateMdx";
import type { ThemeType } from "../../domains/utils/getTheme";

export function PreviewGameAssetRoute(props: {
  game: CollectionEntry<"games">;
  creator: CollectionEntry<"creators">;
  assets: Array<CollectionEntry<"assets">>;
  currentAsset?: CollectionEntry<"assets">;
  gameCover?: React.ReactNode;
  theme: ThemeType;
}) {
  const campaignManager = useCampaign({
    id: "",
    readonly: true,
  });
  const MDXContent = props.currentAsset
    ? evaluateMdxSync({
        mdx: props.currentAsset.body!,
      })
    : null;

  return (
    <UI.Theme {...props.theme} hasBackground={false}>
      <CampaignContext.Provider value={campaignManager}>
        <UI.Card className="mx-auto max-w-[800px] p-6">
          <UI.Box className="hidden lg:block">{renderContent()}</UI.Box>
          <UI.Box className="lg:hidden">
            <NothingToShowHere
              icon={Smartphone}
              title={"Open on Desktop"}
              description={
                <>
                  This page is not meant to be viewed on mobile. Please make
                  your window bigger or open it in a desktop browser.
                </>
              }
            ></NothingToShowHere>
          </UI.Box>
        </UI.Card>
      </CampaignContext.Provider>
    </UI.Theme>
  );

  function renderContent() {
    return (
      <UI.Flex direction="column" gap="4">
        <UI.Callout.Root color="blue">
          <UI.Callout.Icon>
            <InfoCircledIcon />
          </UI.Callout.Icon>
          <UI.Callout.Text>
            This sheet is <b>read-only</b>. If you want to make changes, you can
            create a new campaign.
          </UI.Callout.Text>
        </UI.Callout.Root>
        <MDXH1>{props.currentAsset?.data.name}</MDXH1>
        <MDXH5 className="mt-[-0.5rem]">
          <UI.Link
            href={AppUrl.game({
              id: props.game.id,
            })}
            color="gray"
            className="hover:text-(--accent-12)"
          >
            For {props.game.data.name}
          </UI.Link>
        </MDXH5>
        <UI.Container size={"1"}>
          {MDXContent && (
            <MDXSheetWrapper>
              <MDXContent
                components={{
                  ...getMdxComponents({
                    allowH1s: false,
                  }),
                }}
              ></MDXContent>
            </MDXSheetWrapper>
          )}
        </UI.Container>
      </UI.Flex>
    );
  }
}
