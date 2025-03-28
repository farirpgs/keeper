import { InfoCircledIcon } from "@radix-ui/react-icons";
import {
  Box,
  Callout,
  Card,
  Container,
  Flex,
  Link,
  Theme,
} from "@radix-ui/themes";
import type { CollectionEntry } from "astro:content";
import { Smartphone } from "lucide-react";
import {
  MDXH1,
  MDXH5,
  MDXSheetWrapper,
  getMdxComponents,
} from "../../components/client/MDX/MDX";
import { NothingToShowHere } from "../../components/client/NothingToShowHere/NothingToShowHere";
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
    <Theme {...props.theme} hasBackground={false}>
      <CampaignContext.Provider value={campaignManager}>
        <Card className="mx-auto max-w-[800px] p-6">
          <Box className="hidden lg:block">{renderContent()}</Box>
          <Box className="lg:hidden">
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
          </Box>
        </Card>
      </CampaignContext.Provider>
    </Theme>
  );

  function renderContent() {
    return (
      <Flex direction="column" gap="4">
        <Callout.Root color="blue">
          <Callout.Icon>
            <InfoCircledIcon />
          </Callout.Icon>
          <Callout.Text>
            This sheet is <b>read-only</b>. If you want to make changes, you can
            create a new campaign.
          </Callout.Text>
        </Callout.Root>
        <MDXH1>{props.currentAsset?.data.name}</MDXH1>
        <MDXH5 className="mt-[-0.5rem]">
          <Link
            href={AppUrl.game({
              id: props.game.id,
            })}
            color="gray"
            className="hover:text-(--accent-12)"
          >
            For {props.game.data.name}
          </Link>
        </MDXH5>
        <Container size={"1"}>
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
        </Container>
      </Flex>
    );
  }
}
