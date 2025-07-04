import {
  ExternalLinkIcon,
  GitHubLogoIcon,
  HamburgerMenuIcon,
} from "@radix-ui/react-icons";
import { useForm } from "@tanstack/react-form";
import type { CollectionEntry } from "astro:content";
import clsx from "clsx";
import { Copy, DownloadCloudIcon, Heart, Search } from "lucide-react";
import React from "react";
import { Card } from "../../components/client/AppCard/AppCard";
import {
  getMdxComponents,
  MDXProseWrapper,
} from "../../components/client/MDX/MDX";
import { Footer } from "../../components/server/Footer/Footer";
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

import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";

export function ResourceRoute(props: {
  origin: string;
  pathname: string;
  creator: CollectionEntry<"creators">;
  resource: CollectionEntry<"resources">;
  locales: Array<string>;
  image?: React.ReactNode;
  doc: DocType;
  theme: ThemeType;
  content: string | undefined;
  children: any;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const campaignManager = useCampaign({
    id: "",
  });
  const ogImageUrl = AppUrl.ogImage({
    origin: props.origin,
    pathname: props.pathname,
  });

  const chapterSearchForm = useForm({
    defaultValues: {
      query: "",
      debouncedQuery: "",
      searchResults: null as Array<{ id: string; title: string }> | null,
    },
  });

  function getSearchResults(params: { searchQuery: string | null }) {
    const searchQuery = params.searchQuery;
    if (!searchQuery) {
      return null;
    }
    // Use the search index from props.doc.indexes
    const matchingPageIds = new Set(
      props.doc.indexes
        .filter((idx) => {
          const pageTitle = idx.pageTitle?.toLowerCase() || "";
          const sectionTitle = idx.sectionTitle?.toLowerCase() || "";
          return (
            pageTitle.includes(searchQuery) ||
            sectionTitle.includes(searchQuery)
          );
        })
        .map((idx) => idx.pageId),
    );
    // Collect all matching chapters (from categories and root)
    const allChapters: Array<{ id: string; title: string }> = [];
    Object.values(props.doc.sidebar.categories).forEach((items) => {
      items.forEach((item) => {
        if (matchingPageIds.has(item.id)) {
          allChapters.push(item);
        }
      });
    });
    props.doc.sidebar.root.forEach((item) => {
      if (matchingPageIds.has(item.id)) {
        allChapters.push(item);
      }
    });
    // Remove duplicates by id
    const uniqueChapters = Array.from(
      new Map(allChapters.map((item) => [item.id, item])).values(),
    );
    // Set the search results and the debounced query
    return uniqueChapters;
  }

  const MDXContent = evaluateMdxSync({
    mdx: props.content || "",
  });

  function handleCopyMarkdown() {
    if (props.content) {
      navigator.clipboard.writeText(props.content);
      toast.success("Copied to clipboard!");
    }
  }

  function handleDownloadMarkdown() {
    if (props.content && props.doc.currentPage) {
      const blob = new Blob([props.content], { type: "text/markdown" });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `${props.doc.currentPage.title} - ${props.resource.data.name}.md`;
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
      URL.revokeObjectURL(url);
      toast.success("Downloaded!");
    }
  }

  return (
    <UI.Theme {...props.theme} hasBackground={false}>
      <Toaster />
      <CampaignContext.Provider value={campaignManager}>
        <div>
          <div className="flex flex-row gap-9">
            <div className="hidden w-[300px] flex-shrink-0 flex-grow basis-[300px] lg:flex">
              <div
                className="sticky top-6"
                style={{ maxHeight: "calc(100vh - 32px)" }}
              >
                <div className="relative h-full overflow-y-scroll pb-[10rem]">
                  {renderSidebar({ withImage: true })}
                </div>
              </div>
            </div>
            <div className="flex flex-col">
              <div className="block w-full">
                <div className="flex flex-col">
                  <div className="mb-6">{renderPatreonBanner()}</div>

                  <div className="mb-2 flex flex-row items-center justify-between gap-2">
                    <MDXProseWrapper>
                      <h1
                        style={{
                          marginBottom: "0 !important",
                        }}
                      >
                        {props.doc.currentPage?.title || ""}
                      </h1>
                    </MDXProseWrapper>
                  </div>
                  <UI.Separator
                    size="4"
                    className="mt-0 mb-3 flex w-full opacity-60"
                    color="gray"
                  />
                  <div className="mb-6 flex flex-col gap-2 sm:flex-row">
                    <UI.Button
                      variant="soft"
                      color="gray"
                      size="1"
                      radius="full"
                      onClick={handleCopyMarkdown}
                      className="flex items-center gap-2"
                    >
                      <Copy size={"1em"} />
                      Copy as Markdown
                    </UI.Button>
                    <UI.Button
                      variant="soft"
                      color="gray"
                      size="1"
                      radius="full"
                      onClick={handleDownloadMarkdown}
                      className="flex items-center gap-2"
                    >
                      <DownloadCloudIcon size={"1em"} />
                      Download as Markdown
                    </UI.Button>
                    <UI.Link
                      href={AppUrl.githubResource({
                        id: props.resource.id,
                        page: props.doc.currentPage?.gitHubId || "",
                      })}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 no-underline"
                    >
                      <UI.Button
                        variant="soft"
                        color="gray"
                        size="1"
                        radius="full"
                        className="flex items-center gap-2"
                      >
                        <GitHubLogoIcon width={"1.2em"} height={"1.2em"} />
                        Edit on GitHub
                      </UI.Button>
                    </UI.Link>
                  </div>
                </div>
                {props.children}
                {MDXContent && (
                  <MDXProseWrapper>
                    <MDXContent
                      components={{
                        ...getMdxComponents({}),
                      }}
                    />
                  </MDXProseWrapper>
                )}
                {renderPreviousAndNextButtons()}
                {renderEditButton()}
              </div>
              <Footer ogImageUrl={ogImageUrl} />
            </div>
          </div>
        </div>
        <UI.Dialog.Root
          open={mobileMenuOpen}
          onOpenChange={(open) => {
            return setMobileMenuOpen(open);
          }}
        >
          <UI.Portal>
            <UI.Theme {...props.theme} hasBackground={false}>
              <div className="fixed right-0 bottom-0 left-0 w-full bg-black lg:hidden">
                <UI.Dialog.Trigger
                  onClick={() => {
                    return setMobileMenuOpen((prev) => !prev);
                  }}
                >
                  <UI.Button
                    variant="solid"
                    size="3"
                    radius="full"
                    color="gray"
                    highContrast
                    className="fixed right-4 bottom-4 lg:hidden"
                  >
                    <HamburgerMenuIcon width={"1.5rem"} height={"1.5rem"} />
                    Chapters
                  </UI.Button>
                </UI.Dialog.Trigger>
              </div>
            </UI.Theme>
          </UI.Portal>

          <UI.Dialog.Content size={"3"}>
            <div className="flex flex-col gap-3">
              <UI.Dialog.Title className="hidden">Menu</UI.Dialog.Title>
              <UI.Dialog.Description className="hidden">
                Menu
              </UI.Dialog.Description>
              <div>{renderSidebar({ withImage: false })}</div>
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

  function renderPatreonBanner() {
    return (
      <UI.Card size="2" variant="ghost">
        <div className="flex flex-col items-center justify-between gap-4 p-4 sm:flex-row">
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center">
            <div className="relative">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#FF424D]/10">
                <motion.span
                  className="absolute top-[-4px] right-[-4px] inline-flex h-[8px] w-[8px] rounded-full bg-[#FF424D]"
                  animate={{
                    scale: [1, 2, 2],
                    opacity: [1, 0, 0],
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    times: [0, 0.75, 1],
                    ease: [[0, 0, 0.2, 1], "linear"],
                  }}
                />
                <Heart className="h-5 w-5 text-[#FF424D]" />
              </div>
            </div>
            <div className="flex flex-col text-center sm:text-left">
              <UI.Text weight="medium" color="gray">
                Support Keeper
              </UI.Text>
              <UI.Text size="2" color="gray">
                Get exclusive content and help fund development.
              </UI.Text>
            </div>
          </div>
          <UI.Button
            asChild
            color="red"
            variant="solid"
            className="w-full sm:w-auto"
          >
            <UI.Link
              href={AppUrl.patreon()}
              target="_blank"
              underline="none"
              color="red"
            >
              Become a Patron
            </UI.Link>
          </UI.Button>
        </div>
      </UI.Card>
    );
  }

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
        {props.doc.previousPage && (
          <UI.Tooltip content={props.doc.previousPage.title}>
            <UI.Link
              className="w-full no-underline sm:w-[33%]"
              href={AppUrl.resourcePage({
                id: props.resource.id,
                page: props.doc.previousPage.id,
              })}
              size="4"
            >
              <div
                className="flex flex-col gap-2 rounded-md border p-4"
                style={
                  {
                    "--border": Colors.getDarkColor(props.theme.accentColor, 7),
                  } as React.CSSProperties
                }
              >
                <UI.Text size="2" color="gray" className="">
                  Previous
                </UI.Text>

                <UI.Text truncate>{props.doc.previousPage.title}</UI.Text>
              </div>
            </UI.Link>
          </UI.Tooltip>
        )}
        {props.doc.nextPage && (
          <UI.Tooltip content={props.doc.nextPage.title}>
            <UI.Link
              className="w-full no-underline sm:w-[33%]"
              href={AppUrl.resourcePage({
                id: props.resource.id,
                page: props.doc.nextPage.id,
              })}
              size="4"
            >
              <div
                className="flex flex-col gap-2 rounded-md border p-4 text-right"
                style={
                  {
                    "--border": Colors.getDarkColor(props.theme.accentColor, 7),
                  } as React.CSSProperties
                }
              >
                <UI.Text size="2" color="gray" className="">
                  Next
                </UI.Text>

                <UI.Text truncate>{props.doc.nextPage.title}</UI.Text>
              </div>
            </UI.Link>
          </UI.Tooltip>
        )}
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
      <UI.Card variant="surface" className="flex flex-col gap-4">
        <div className="flex flex-col gap-5">
          {props.image && p.withImage && (
            <div className="">
              <UI.Inset
                clip="padding-box"
                side="top"
                pb="current"
                className="rounded-md"
                style={{ marginBottom: "-1rem" }}
              >
                {props.image}
              </UI.Inset>
            </div>
          )}

          <div>
            <UI.Text size="5" weight={"bold"} className="block leading-normal">
              {props.resource.data.name}
            </UI.Text>
            <UI.Link
              href={AppUrl.creator({
                id: props.creator.id,
              })}
              color="gray"
              className="hover:text-(--accent-12)"
            >
              <UI.Text size={"2"} className="block">
                By {props.creator.data.name}
              </UI.Text>
            </UI.Link>
          </div>

          <div>
            <UI.Heading size="3" className="mb-2">
              Locales
            </UI.Heading>
            {renderLocalesDropdown()}
          </div>

          <div>
            {props.resource.data.links &&
              Object.keys(props.resource.data.links).length > 0 && (
                <>
                  <UI.Heading size="3" className="mb-2">
                    Links
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
          </div>
          <div className="flex flex-col gap-2">
            <UI.Heading size="3" className="">
              Chapters
            </UI.Heading>
            <chapterSearchForm.Field
              name="query"
              validators={{
                onChangeAsyncDebounceMs: 200,
                onChangeAsync: () => {
                  chapterSearchForm.setFieldValue(
                    "debouncedQuery",
                    chapterSearchForm.getFieldValue("query"),
                  );
                },
              }}
            >
              {(field) => (
                <UI.TextField.Root
                  size="2"
                  className={`mb-2 w-full bg-transparent hover:bg-(--accent-3) dark:hover:bg-(--accent-6)`}
                  color="gray"
                  placeholder="Search chapters..."
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  autoComplete="off"
                >
                  <UI.TextField.Slot>
                    <Search height="16" width="16" />
                  </UI.TextField.Slot>
                </UI.TextField.Root>
              )}
            </chapterSearchForm.Field>
            <chapterSearchForm.Subscribe
              selector={(s) => s.values.debouncedQuery}
            >
              {(debouncedQuery) => {
                const searchResults = getSearchResults({
                  searchQuery: debouncedQuery,
                });

                return (
                  <>
                    {searchResults ? (
                      <>
                        {searchResults.length === 0 && (
                          <UI.Text size="2" color="gray">
                            No results found.
                          </UI.Text>
                        )}
                        <div className="flex flex-col">
                          {searchResults.map((item) => {
                            const itemPatname = AppUrl.resourcePage({
                              id: props.resource.id,
                              page: item.id,
                            });
                            const isFirstPage =
                              !props.doc.previousPage &&
                              props.doc.currentPage?.id === item.id;
                            const isCurrent =
                              itemPatname === props.pathname || isFirstPage;
                            // Find the page object for this item
                            const page =
                              props.doc.pages.find((p) => p.id === item.id) ||
                              null;
                            return (
                              <div key={item.id} className="flex flex-col">
                                {renderLink({
                                  isCurrent: isCurrent,
                                  href: itemPatname,
                                  title: item.title,
                                })}
                                {renderToc({
                                  page: page,
                                  query: debouncedQuery,
                                })}
                              </div>
                            );
                          })}
                        </div>
                      </>
                    ) : (
                      <>
                        {Object.keys(props.doc.sidebar.categories).map(
                          (category) => {
                            const filteredCategoryItems =
                              props.doc.sidebar.categories[category];
                            if (
                              !filteredCategoryItems ||
                              filteredCategoryItems.length === 0
                            )
                              return null;
                            return (
                              <React.Fragment key={category}>
                                <UI.Heading size="3">{category}</UI.Heading>
                                <div className="flex flex-col">
                                  {filteredCategoryItems.map((item) => {
                                    const itemPatname = AppUrl.resourcePage({
                                      id: props.resource.id,
                                      page: item.id,
                                    });
                                    const isFirstPage =
                                      !props.doc.previousPage &&
                                      props.doc.currentPage?.id === item.id;
                                    const isCurrent =
                                      itemPatname === props.pathname ||
                                      isFirstPage;
                                    return (
                                      <React.Fragment key={item.id}>
                                        {renderLink({
                                          isCurrent,
                                          href: itemPatname,
                                          title: item.title,
                                        })}
                                        {isCurrent &&
                                          renderToc({
                                            page: props.doc.currentPage,
                                            query: null,
                                          })}
                                      </React.Fragment>
                                    );
                                  })}
                                </div>
                              </React.Fragment>
                            );
                          },
                        )}

                        {props.doc.sidebar.root.length > 0 && (
                          <div className="flex flex-col">
                            {props.doc.sidebar.root.map((item) => {
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
                                <div key={item.id} className="flex flex-col">
                                  {renderLink({
                                    isCurrent: isCurrent,
                                    href: itemPatname,
                                    title: item.title,
                                  })}
                                  {isCurrent &&
                                    renderToc({
                                      page: props.doc.currentPage,
                                      query: null,
                                    })}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </>
                    )}
                  </>
                );
              }}
            </chapterSearchForm.Subscribe>
          </div>
        </div>
      </UI.Card>
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
          variant="surface"
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

  function renderToc(params: {
    page: DocType["pages"][number] | null;
    query: string | null;
  }) {
    const searchQuery = params?.query;

    if (!params.page) {
      return null;
    }

    const filteredToc = params.page.toc.filter((tocElement) => {
      if (!searchQuery) {
        return true;
      }
      const title = tocElement.title.toLowerCase();
      return title.includes(searchQuery);
    });

    if (filteredToc.length === 0) {
      return null;
    }

    return (
      <>
        {filteredToc.map((tocElement) => {
          let href = `#${tocElement.id}`;
          if (searchQuery) {
            href = AppUrl.resourcePage({
              id: props.resource.id,
              page: params.page!.id,
              hash: tocElement.id,
            });
          }
          return (
            <React.Fragment key={tocElement.id}>
              {renderLink({
                href: href,
                title: tocElement.title,
                // Toc can't be current
                isCurrent: false,
                // To prevent highlighting in search results
                isToc: searchQuery ? false : true,
                level: tocElement.level,
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
              "border-l-solid flex max-w-[300px] border-l-[2px] border-l-(--border-item-light) py-[.25rem] hover:border-l-(--border-current) dark:border-l-(--border-item-dark)",
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
                "--border-item-light":
                  p.isCurrent || p.isToc
                    ? Colors.getDarkColor(props.theme.accentColor, 9)
                    : Colors.getDarkColor("gray", 11),
                "--border-item-dark":
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
