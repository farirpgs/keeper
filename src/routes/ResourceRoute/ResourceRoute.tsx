import { GitHubLogoIcon, HamburgerMenuIcon } from "@radix-ui/react-icons";
import {
  Box,
  Button,
  Dialog,
  Flex,
  Heading,
  IconButton,
  Inset,
  Link,
  Select,
  Text,
  Theme,
  Tooltip,
} from "@radix-ui/themes";
import type { CollectionEntry } from "astro:content";
import clsx from "clsx";
import React from "react";
import {
  getMdxComponents,
  MDXH1,
  MDXH4,
  MDXWrapper,
} from "../../components/client/MDX/MDX";
import { AppUrl } from "../../domains/app-url/AppUrl";
import {
  CampaignContext,
  useCampaign,
} from "../../domains/campaign/useCampaign";
import { Colors } from "../../domains/colors/colors";
import type { DocType } from "../../domains/document/DocParser";
import { evaluateMdxSync } from "../../domains/mdx/evaluateMdx";
import type { ThemeType } from "../../domains/utils/getTheme";

export function ResourceRoute(props: {
  creator: CollectionEntry<"creators">;
  resource: CollectionEntry<"resources">;
  locales: Array<string>;
  image?: React.ReactNode;
  doc: DocType;
  theme: ThemeType;
  pathname: string;
  content: string | undefined;
  children: any;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const campaignManager = useCampaign({
    id: "",
  });

  const MDXContent = evaluateMdxSync({
    mdx: props.content || "",
  });

  return (
    <Theme {...props.theme} hasBackground={false}>
      <CampaignContext.Provider value={campaignManager}>
        <div className="flex gap-9">
          <div className="hidden flex-shrink-0 flex-grow basis-[300px] lg:flex">
            <Box
              className="sticky top-6 overflow-y-auto pr-2 pb-9"
              style={{
                maxHeight: "calc(100vh - 32px)",
              }}
            >
              {renderSidebar({
                withImage: true,
              })}
            </Box>
          </div>
          <div className="block w-full">
            <div>
              <MDXH1 className="">{props.doc.currentPage?.title || ""}</MDXH1>
              <MDXH4 color="gray" className="mb-8" size="6">
                {props.resource.data.name}
              </MDXH4>
              {props.children}
              {MDXContent && (
                <MDXWrapper>
                  <MDXContent
                    components={{
                      ...getMdxComponents({}),
                    }}
                  ></MDXContent>
                </MDXWrapper>
              )}
              {renderPreviousAndNextButtons()}
              {renderEditButton()}
            </div>
          </div>
        </div>
        <Dialog.Root
          open={mobileMenuOpen}
          onOpenChange={(open) => {
            return setMobileMenuOpen(open);
          }}
        >
          <Box className="fixed right-0 bottom-0 left-0 w-full bg-black lg:hidden">
            <Dialog.Trigger
              onClick={() => {
                return setMobileMenuOpen((prev) => !prev);
              }}
            >
              <IconButton
                variant="solid"
                size="4"
                radius="full"
                className="fixed right-4 bottom-4 h-[4rem] w-[4rem] lg:hidden"
              >
                <HamburgerMenuIcon
                  width={"2rem"}
                  height={"2rem"}
                ></HamburgerMenuIcon>
              </IconButton>
            </Dialog.Trigger>
          </Box>

          <Dialog.Content size={"3"}>
            <Flex gap={"3"} direction={"column"}>
              <Dialog.Title className="hidden">Menu</Dialog.Title>
              <Dialog.Description className="hidden">Menu</Dialog.Description>
              <Box>
                {renderSidebar({
                  withImage: false,
                })}
              </Box>
              <Flex justify="end">
                <Dialog.Close>
                  <Button
                    variant="soft"
                    color="gray"
                    onClick={() => {
                      return setMobileMenuOpen((prev) => !prev);
                    }}
                  >
                    Close
                  </Button>
                </Dialog.Close>
              </Flex>
            </Flex>
          </Dialog.Content>
        </Dialog.Root>
      </CampaignContext.Provider>
    </Theme>
  );

  function renderPreviousAndNextButtons() {
    return (
      <Flex
        gap="3"
        className="mt-[3rem]"
        direction={{ initial: "column", sm: "row" }}
        justify={
          props.doc.previousPage && props.doc.nextPage
            ? "between"
            : props.doc.previousPage
              ? "start"
              : "end"
        }
      >
        {props.doc.previousPage && (
          <Tooltip content={props.doc.previousPage.title}>
            <Link
              className="w-full no-underline sm:w-[33%]"
              href={AppUrl.resourcePage({
                id: props.resource.id,
                page: props.doc.previousPage.id,
              })}
              size="4"
            >
              <Flex
                gap="2"
                direction="column"
                className="rounded-md border border-(--border) p-4"
                style={
                  {
                    "--border": Colors.getDarkColor(props.theme.accentColor, 7),
                  } as React.CSSProperties
                }
              >
                <Text size="2" color="gray" className="">
                  Previous
                </Text>

                <Text truncate>{props.doc.previousPage.title}</Text>
              </Flex>
            </Link>
          </Tooltip>
        )}
        {props.doc.nextPage && (
          <Tooltip content={props.doc.nextPage.title}>
            <Link
              className="w-full no-underline sm:w-[33%]"
              href={AppUrl.resourcePage({
                id: props.resource.id,
                page: props.doc.nextPage.id,
              })}
              size="4"
            >
              <Flex
                gap="2"
                direction="column"
                className="rounded-md border border-(--border) p-4 text-right"
                style={
                  {
                    "--border": Colors.getDarkColor(props.theme.accentColor, 7),
                  } as React.CSSProperties
                }
              >
                <Text size="2" color="gray" className="">
                  Next
                </Text>

                <Text truncate>{props.doc.nextPage.title}</Text>
              </Flex>
            </Link>
          </Tooltip>
        )}
      </Flex>
    );
  }

  function renderEditButton() {
    return (
      <Box mt="5">
        <Flex justify={"end"}>
          <Link
            href={AppUrl.githubResource({
              id: props.resource.id,
              page: props.doc.currentPage?.gitHubId || "",
            })}
          >
            <Button variant="ghost" color="gray" size="4" className="m-0">
              <GitHubLogoIcon
                width={"1.5rem"}
                height={"1.5rem"}
              ></GitHubLogoIcon>
              Edit this page on GitHub
            </Button>
          </Link>
        </Flex>
      </Box>
    );
  }

  function renderSidebar(p: { withImage?: boolean }) {
    return (
      <Flex direction="column" gap="3">
        <Flex direction={"column"} gap="2">
          {props.image && p.withImage && (
            <Box className="">
              <Inset
                clip="padding-box"
                side="top"
                pb="current"
                className="rounded-md"
              >
                {props.image}
              </Inset>
            </Box>
          )}

          <Box>
            <Text size="5" weight={"bold"} className="mt-2 block">
              {props.resource.data.name}
            </Text>
            <Link
              href={AppUrl.creator({
                id: props.creator.id,
              })}
              color="gray"
              className="hover:text-(--accent-12)"
            >
              <Text size={"3"} className="block">
                By {props.creator.data.name}
              </Text>
            </Link>
          </Box>
        </Flex>
        <Box>{renderLocalesDropdown()}</Box>

        <Box>
          {Object.keys(props.doc.sidebar.categories).map((category) => {
            return (
              <React.Fragment key={category}>
                <Heading size="2" className="mt-3 mb-2 uppercase" color="gray">
                  {category}
                </Heading>
                <Flex direction="column">
                  {props.doc.sidebar.categories[category].map((item) => {
                    const itemPatname = AppUrl.resourcePage({
                      id: props.resource.id,
                      page: item.id,
                    });
                    const isFirstPage =
                      !props.doc.previousPage &&
                      props.doc.currentPage?.id === item.id;
                    const isCurrent =
                      itemPatname === props.pathname || isFirstPage;

                    return (
                      <React.Fragment key={item.id}>
                        {renderLink({
                          isCurrent,
                          href: itemPatname,
                          title: item.title,
                        })}
                        {isCurrent && renderToc()}
                      </React.Fragment>
                    );
                  })}
                </Flex>
              </React.Fragment>
            );
          })}
          {Object.keys(props.doc.sidebar.categories).length === 0 ? (
            <>
              <Heading size="2" className="mt-3 mb-2 uppercase" color="gray">
                Chapters
              </Heading>
            </>
          ) : (
            <></>
          )}
          {props.doc.sidebar.root.map((item) => {
            const itemPatname = AppUrl.resourcePage({
              id: props.resource.id,
              page: item.id,
            });
            const isFirstPage =
              !props.doc.previousPage && props.doc.currentPage?.id === item.id;
            const isCurrent = itemPatname === props.pathname || isFirstPage;

            return (
              <Flex key={item.id} direction="column">
                {renderLink({
                  isCurrent: isCurrent,
                  href: itemPatname,
                  title: item.title,
                })}
                {isCurrent && renderToc()}
              </Flex>
            );
          })}
        </Box>
      </Flex>
    );
  }

  function renderLocalesDropdown() {
    const codeToWord: Record<string, string> = {
      en: "English",
      zh: "中文",
      es: "Español",
      fr: "Français",
      de: "Deutsch",
      ru: "Русский",
      ja: "日本語",
      ko: "한국어",
      "pt-br": "Português (Brasil)",
      it: "Italiano",
      pl: "Polski",
      ua: "Українська",
    };
    const locale = props.resource.data._locale || "en";

    return (
      <Select.Root
        value={locale}
        size={"2"}
        onValueChange={(newLocale) => {
          location.href = AppUrl.resourcePage({
            id: [
              props.resource.data._idWithoutLocale,
              newLocale === "en" ? "" : newLocale,
            ].join("/") as CollectionEntry<"resources">["id"],
            page: "",
          });
        }}
      >
        <Select.Trigger className="w-full" variant="surface">
          {codeToWord[locale]}
        </Select.Trigger>
        <Select.Content>
          {props.locales.map((locale) => {
            return (
              <Select.Item key={locale} value={locale}>
                {codeToWord[locale]}
              </Select.Item>
            );
          })}
        </Select.Content>
      </Select.Root>
    );
  }

  function renderToc() {
    return (
      <>
        {props.doc.currentPage?.toc.map((toc) => {
          return (
            <React.Fragment key={toc.id}>
              {renderLink({
                href: `#${toc.id}`,
                title: toc.title,
                isCurrent: false,
                isToc: true,
                level: toc.level,
              })}
            </React.Fragment>
          );
        })}
      </>
    );
  }

  function renderLink(p: {
    href: string;
    title: string;
    isCurrent: boolean;
    isToc?: boolean;
    level?: number;
  }) {
    const linkColor =
      p.isCurrent && !p.isToc
        ? "var(--accent-11)"
        : p.isToc
          ? "var(--gray-11)"
          : "var(--gray-12)";

    const level = p.level ? p.level : 1;

    return (
      <>
        <Link
          href={p.href}
          style={
            {
              color: linkColor,
            } as React.CSSProperties
          }
          onClick={() => {
            setMobileMenuOpen(false);
          }}
        >
          <Flex
            className={clsx(
              "border-l-solid flex max-w-[300px] border-l-[2px] border-l-(--border-item) py-[.25rem] hover:border-l-(--border-current)",
              {
                "m-[0px]": p.isCurrent,
              },
            )}
            style={
              {
                paddingLeft: `${level * 0.75}rem`,
                "--border-current": Colors.getDarkColor(
                  props.theme.accentColor,
                  9,
                ),
                "--border-item":
                  p.isCurrent || p.isToc
                    ? Colors.getDarkColor(props.theme.accentColor, 9)
                    : Colors.getDarkColor("gray", 7),
              } as React.CSSProperties
            }
          >
            <Text
              className={clsx({ "font-bold": p.isCurrent })}
              size="2"
              truncate
            >
              {p.title}
            </Text>
          </Flex>
        </Link>
      </>
    );
  }
}
