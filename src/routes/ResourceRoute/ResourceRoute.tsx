import {
  ExternalLinkIcon,
  GitHubLogoIcon,
  HamburgerMenuIcon,
} from "@radix-ui/react-icons";
import type { CollectionEntry } from "astro:content";
import clsx from "clsx";
import React from "react";
import { Card } from "../../components/client/AppCard/AppCard";
import {
  getMdxComponents,
  MDXH1,
  MDXH4,
  MDXWrapper,
} from "../../components/client/MDX/MDX";
import { UI } from "../../components/ui/ui";
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
    <UI.Theme {...props.theme} hasBackground={false}>
      <CampaignContext.Provider value={campaignManager}>
        <div className="flex gap-9">
          <div className="hidden flex-shrink-0 flex-grow basis-[300px] lg:flex">
            <div
              className="sticky top-6 overflow-y-auto px-2 pb-[40vh]"
              style={{
                maxHeight: "calc(100vh - 32px)",
              }}
            >
              {renderSidebar({
                withImage: true,
              })}
            </div>
          </div>
          <div className="block w-full">
            <div>
              <MDXH1 className="">{props.doc.currentPage?.title || ""}</MDXH1>
              <MDXH4 color="gray" className="mb-5" size="6">
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
        <UI.Dialog.Root
          open={mobileMenuOpen}
          onOpenChange={(open) => {
            return setMobileMenuOpen(open);
          }}
        >
          <div className="fixed right-0 bottom-0 left-0 w-full bg-black lg:hidden">
            <UI.Dialog.Trigger
              onClick={() => {
                return setMobileMenuOpen((prev) => !prev);
              }}
            >
              <UI.IconButton
                variant="solid"
                size="4"
                radius="full"
                className="fixed right-4 bottom-4 h-[4rem] w-[4rem] lg:hidden"
              >
                <HamburgerMenuIcon
                  width={"2rem"}
                  height={"2rem"}
                ></HamburgerMenuIcon>
              </UI.IconButton>
            </UI.Dialog.Trigger>
          </div>

          <UI.Dialog.Content size={"3"}>
            <div className="flex flex-col gap-3">
              <UI.Dialog.Title className="hidden">Menu</UI.Dialog.Title>
              <UI.Dialog.Description className="hidden">
                Menu
              </UI.Dialog.Description>
              <div>
                {renderSidebar({
                  withImage: false,
                })}
              </div>
              <div className="flex justify-end">
                <UI.Dialog.Close>
                  <UI.Button
                    variant="soft"
                    color="gray"
                    onClick={() => {
                      return setMobileMenuOpen((prev) => !prev);
                    }}
                  >
                    Close
                  </UI.Button>
                </UI.Dialog.Close>
              </div>
            </div>
          </UI.Dialog.Content>
        </UI.Dialog.Root>
      </CampaignContext.Provider>
    </UI.Theme>
  );

  function renderPreviousAndNextButtons() {
    return (
      <div
        className="mt-[3rem] flex flex-col gap-3 sm:flex-row"
        style={{
          justifyContent:
            props.doc.previousPage && props.doc.nextPage
              ? "space-between"
              : props.doc.previousPage
                ? "flex-start"
                : "flex-end",
        }}
      >
        {props.doc.previousPage &&
          renderNavCard({
            title: props.doc.previousPage.title,
            href: AppUrl.resourcePage({
              id: props.resource.id,
              page: props.doc.previousPage.id,
            }),
            direction: "previous",
          })}
        {props.doc.nextPage &&
          renderNavCard({
            title: props.doc.nextPage.title,
            href: AppUrl.resourcePage({
              id: props.resource.id,
              page: props.doc.nextPage.id,
            }),
            direction: "next",
          })}
      </div>
    );
  }

  function renderNavCard(params: {
    title: string;
    href: string;
    direction: "previous" | "next";
  }) {
    return (
      <Card title={params.title} href={params.href}>
        <div
          className={clsx(
            "flex flex-col gap-2 rounded-md border border-(--border) p-4",
            {
              "text-right": params.direction === "next",
            },
          )}
          style={
            {
              "--border": Colors.getDarkColor(props.theme.accentColor, 7),
            } as React.CSSProperties
          }
        >
          <UI.Text size="2" color="gray" className="">
            {params.direction === "previous" ? "Previous" : "Next"}
          </UI.Text>
          <UI.Text truncate>{params.title}</UI.Text>
        </div>
      </Card>
    );
  }

  function renderEditButton() {
    return (
      <div className="mt-5">
        <div className="flex justify-end">
          <UI.Link
            href={AppUrl.githubResource({
              id: props.resource.id,
              page: props.doc.currentPage?.gitHubId || "",
            })}
          >
            <UI.Button variant="ghost" color="gray" size="4" className="m-0">
              <GitHubLogoIcon
                width={"1.5rem"}
                height={"1.5rem"}
              ></GitHubLogoIcon>
              Edit this page on GitHub
            </UI.Button>
          </UI.Link>
        </div>
      </div>
    );
  }

  function renderSidebar(p: { withImage?: boolean }) {
    return (
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-2">
          {props.image && p.withImage && (
            <div className="">
              <UI.Inset
                clip="padding-box"
                side="top"
                pb="current"
                className="rounded-md"
              >
                {props.image}
              </UI.Inset>
            </div>
          )}

          <div>
            <UI.Text size="5" weight={"bold"} className="mt-2 block">
              {props.resource.data.name}
            </UI.Text>
            <UI.Link
              href={AppUrl.creator({
                id: props.creator.id,
              })}
              color="gray"
              className="hover:text-(--accent-12)"
            >
              <UI.Text size={"3"} className="block">
                By {props.creator.data.name}
              </UI.Text>
            </UI.Link>
          </div>

          <div>{renderLocalesDropdown()}</div>
          {props.resource.data.links && (
            <UI.Card
              variant="surface"
              className="shadow-none after:block after:shadow-none"
            >
              {Object.keys(props.resource.data.links).length > 0 && (
                <>
                  <UI.Heading size="2" className="mb-2">
                    Creator Links
                  </UI.Heading>
                  <div className="flex flex-col gap-1">
                    {Object.entries(props.resource.data.links).map(
                      ([text, url]) => {
                        if (!url) {
                          return null;
                        }
                        return (
                          <UI.Link
                            key={text}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 no-underline hover:text-(--accent-11)"
                            color="gray"
                            size="2"
                          >
                            <ExternalLinkIcon />
                            <UI.Text truncate>{text}</UI.Text>
                          </UI.Link>
                        );
                      },
                    )}
                  </div>
                </>
              )}
            </UI.Card>
          )}
        </div>

        <UI.Card
          variant="surface"
          className="flex flex-col gap-2 shadow-none after:block after:shadow-none"
        >
          {Object.keys(props.doc.sidebar.categories).map((category) => {
            return (
              <React.Fragment key={category}>
                <UI.Heading size="2">{category}</UI.Heading>
                <div className="flex flex-col">
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
                </div>
              </React.Fragment>
            );
          })}
          {Object.keys(props.doc.sidebar.categories).length === 0 ? (
            <>
              <UI.Heading size="2">Chapters</UI.Heading>
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
              <div key={item.id} className="flex flex-col">
                {renderLink({
                  isCurrent: isCurrent,
                  href: itemPatname,
                  title: item.title,
                })}
                {isCurrent && renderToc()}
              </div>
            );
          })}
        </UI.Card>
      </div>
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
      <UI.Select.Root
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
        <UI.Select.Trigger
          className="w-full bg-(--color-panel)"
          variant="soft"
          color="gray"
        >
          {codeToWord[locale]}
        </UI.Select.Trigger>
        <UI.Select.Content>
          {props.locales.map((locale) => {
            return (
              <UI.Select.Item key={locale} value={locale}>
                {codeToWord[locale] || locale}
              </UI.Select.Item>
            );
          })}
        </UI.Select.Content>
      </UI.Select.Root>
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
        <UI.Link
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
          <div
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
            <UI.Text
              className={clsx({ "font-bold": p.isCurrent })}
              size="2"
              truncate
            >
              {p.title}
            </UI.Text>
          </div>
        </UI.Link>
      </>
    );
  }
}
