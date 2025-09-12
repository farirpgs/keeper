import { Link, SegmentedControl, Text, Theme } from "@radix-ui/themes";
import { Computer, Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import type { ThemeType } from "../../../domains/utils/getTheme";
import { MDXDivider } from "../../client/MDX/mdx-components/ui/MDXDivider";
import { UI } from "../../ui/ui";

type ThemeColorSchemeType = "system" | "dark" | "light";

export function Footer(props: {
  ogImageUrl?: string;
  theme?: ThemeType;
  size?: UI.ContainerProps["size"];
  maxWidth?: UI.ContainerProps["maxWidth"];
  fluid?: boolean; // when true, use parent column width instead of centered container
}) {
  const [themeColorScheme, setThemeColorScheme] =
    useState<ThemeColorSchemeType>("system");

  const links: Record<string, Record<string, string>> = {
    Community: {
      Discord: "https://link.farirpgs.com/discord",
      Bluesky: "https://bsky.app/profile/keeper.farirpgs.com",
      Threads: "https://link.farirpgs.com/threads",
      GitHub: "https://github.com/farirpgs/keeper",
    },
    Miscellaneous: {
      Contact: "https://farirpgs.com/contact",
    },
  };
  if (props.ogImageUrl) {
    links.Miscellaneous["Social Media Image"] = props.ogImageUrl;
  }

  useEffect(function initializeTheme() {
    const storedTheme =
      (localStorage.getItem("keeper-theme") as ThemeColorSchemeType) ||
      "system";
    setThemeColorScheme(storedTheme);
  }, []);

  useEffect(() => {
    function handleAstroNavigation() {
      // get theme
      let theme = undefined;
      if (
        typeof localStorage !== "undefined" &&
        localStorage.getItem("keeper-theme")
      ) {
        theme = localStorage.getItem("keeper-theme");
      } else {
        if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
          theme = "dark";
        } else {
          theme = "light";
        }
      }
      // update html
      if (theme === "light") {
        document.documentElement.classList.add("light");
        document.documentElement.classList.remove("dark");
      } else {
        document.documentElement.classList.add("dark");
        document.documentElement.classList.remove("light");
      }
    }

    document.addEventListener("astro:after-swap", handleAstroNavigation);
    return () =>
      document.removeEventListener("astro:after-swap", handleAstroNavigation);
  }, []);

  useEffect(
    function watchThemeChanges() {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

      function onSystemThemeChange() {
        if (themeColorScheme === "system") {
          handleThemeChange("system");
        }
      }

      mediaQuery.addEventListener("change", onSystemThemeChange);

      return function cleanup() {
        mediaQuery.removeEventListener("change", onSystemThemeChange);
      };
    },
    [themeColorScheme],
  );

  function handleThemeChange(value: ThemeColorSchemeType) {
    const element = document.documentElement;
    setThemeColorScheme(value);

    if (value === "system") {
      element.classList.remove("dark", "light");
      localStorage.removeItem("keeper-theme");
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";
      element.classList.add(systemTheme);
    } else if (value === "light") {
      element.classList.remove("dark");
      element.classList.add("light");
      localStorage.setItem("keeper-theme", "light");
    } else {
      element.classList.remove("light");
      element.classList.add("dark");
      localStorage.setItem("keeper-theme", "dark");
    }
  }

  const Wrapper = ({ children }: { children: any }) => {
    if (props.fluid) {
      return <div className="px-6 md:px-9">{children}</div>;
    }
    return (
      <UI.Container
        px={{ initial: "6", md: "9" }}
        size={props.size || "4"}
        maxWidth={props.maxWidth || undefined}
      >
        {children}
      </UI.Container>
    );
  };

  return (
    <Theme
      {...props.theme}
      hasBackground={false}
      className="min-h-0"
    >
      <Wrapper>
        <div className="my-[10rem]">
          <MDXDivider />
        </div>
        {/* Tinylytics centered at top of footer */}
        <div
          className="mb-6 flex w-full justify-center px-4 md:px-0"
          style={{ fontFamily: "var(--default-font-family)" }}
        >
          <div
            aria-label="Page analytics and like"
            className="inline-flex items-center gap-2 rounded-full border border-black/10 dark:border-white/10 bg-white/80 dark:bg-neutral-900/80 backdrop-blur px-3.5 py-2 shadow-lg"
          >
            <span
              className="views-chip inline-flex items-center rounded-full border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/10 px-3 py-1.5 text-xs leading-none text-neutral-800 dark:text-neutral-200"
            >
              <span className="tinylytics_hits tabular-nums">–</span>
            </span>
            <button
              className="tinylytics_kudos tabular-nums cursor-pointer relative inline-flex items-center rounded-full bg-gradient-to-r from-rose-500 to-orange-500 px-3 py-1.5 text-white text-xs leading-none font-medium shadow hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-neutral-900"
              type="button"
              aria-label="Like this page"
            >
              -
            </button>
          </div>
        </div>
        <div className="flex items-start justify-between gap-9">
          {Object.entries(links).map(([category, links]) => (
            <div className="flex flex-col items-start gap-2" key={category}>
              <Text className="font-bold">{category}</Text>
              {Object.entries(links).map(([link, linkUrl]) => (
                <Text key={link}>
                  <Link href={linkUrl}>{link}</Link>
                </Text>
              ))}
            </div>
          ))}
        </div>

        <div className="my-[5rem] flex flex-col items-center justify-center gap-3 text-center md:flex-row md:items-center md:justify-between md:gap-2 md:text-left">
          <div className="flex flex-wrap items-center justify-center gap-2">
            <a href="https://www.netlify.com" target="_blank">
              <img
                src="https://www.netlify.com/v3/img/components/netlify-color-accent.svg"
                alt="Deploys by Netlify"
                className="h-6 w-auto"
              />
            </a>
            <Text>
              This site is powered by{" "}
              <Link href="https://www.netlify.com" target="_blank">
                Netlify
              </Link>
            </Text>
          </div>
          <div className="flex justify-center">{renderThemeToggleButton()}</div>
        </div>

        
      </Wrapper>
    </Theme>
  );

  function renderThemeToggleButton() {
    return (
      <SegmentedControl.Root
        defaultValue="system"
        size="2"
        value={themeColorScheme}
      >
        <SegmentedControl.Item
          value="system"
          onClick={() => handleThemeChange("system")}
        >
          <Computer className="h-[1rem] w-[1rem]"></Computer>
        </SegmentedControl.Item>

        <SegmentedControl.Item
          value="light"
          onClick={() => handleThemeChange("light")}
        >
          <Sun className="h-[1rem] w-[1rem]"></Sun>
        </SegmentedControl.Item>

        <SegmentedControl.Item
          value="dark"
          onClick={() => handleThemeChange("dark")}
        >
          <Moon className="h-[1rem] w-[1rem]"></Moon>
        </SegmentedControl.Item>
      </SegmentedControl.Root>
    );
  }
}
