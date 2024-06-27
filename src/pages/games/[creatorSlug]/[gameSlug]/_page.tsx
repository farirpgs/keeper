import { Box, Button, Card, Flex, Link, Text, Theme } from "@radix-ui/themes";
import type { CollectionEntry } from "astro:content";
import {
  MDXH1,
  MDXH2,
  MDXWrapper,
} from "../../../../components/client/MDX/MDX";
import {
  CampaignContext,
  useCampaign,
} from "../../../../domains/campaign/useCampaign";
import { CreateNewCampaignButton } from "./_components/CreateNewCampaignButton";

import { ExternalLinkIcon } from "@radix-ui/react-icons";
import clsx from "clsx";
import { AppUrl } from "../../../../domains/app-url/AppUrl";
import type { ThemeType } from "../../../../domains/utils/getTheme";

export function Page(props: {
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
    <Theme {...props.theme} hasBackground={false}>
      <CampaignContext.Provider value={campaignManager}>
        <Flex direction="column" gap="9">
          <Flex
            direction={{
              initial: "column-reverse",
              md: "row",
            }}
            gap="9"
          >
            <Box
              width={{
                initial: "auto",
                md: "60%",
              }}
            >
              <Flex direction="column" gap="4">
                <MDXH1>{props.game.data.name}</MDXH1>
                <MDXH2 className="mt-[-.5rem]">
                  <Link
                    href={AppUrl.creator({
                      slug: props.creator.slug,
                    })}
                    color="gray"
                    className="hover:text-[--accent-12]"
                  >
                    By {props.creator.data.name}
                  </Link>
                </MDXH2>

                <MDXWrapper>{props.children}</MDXWrapper>
              </Flex>
            </Box>
            <Box
              width={{
                initial: "auto",
                md: "40%",
              }}
            >
              <Box className={"sticky top-8 rounded-lg"}>
                <Flex direction={"column"} gap="4">
                  <Card>
                    <Flex gap="4" direction="column">
                      {props.gameCover}
                      <CreateNewCampaignButton gameSlug={props.game.slug} />
                      <Text align="center"> — OR — </Text>
                      <Card variant="surface">
                        <Flex gap="4" direction={"column"}>
                          <Button
                            size="4"
                            className={clsx(
                              "font-bold",
                              "pointer-events-none w-full transition-all",
                            )}
                            color="gray"
                            variant="ghost"
                          >
                            Preview an asset
                          </Button>

                          <Flex
                            gap="2"
                            direction="row"
                            justify={"center"}
                            wrap={"wrap"}
                          >
                            {props.assets.map((asset) => (
                              <Box key={asset.slug}>
                                <a href={AppUrl.asset({ slug: asset.slug })}>
                                  <Button
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
                                  </Button>
                                </a>
                              </Box>
                            ))}
                          </Flex>
                        </Flex>
                      </Card>
                    </Flex>
                  </Card>
                </Flex>
              </Box>
            </Box>
          </Flex>
        </Flex>
      </CampaignContext.Provider>
    </Theme>
  );
}
