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

  return (
    <Theme {...props.theme} hasBackground={false} className="min-h-0">
      <UI.Container
        px={{
          initial: "6",
          md: "9",
        }}
        size={props.size || "4"}
        maxWidth={props.maxWidth || undefined}
      >
        <div className="my-[10rem]">
          <MDXDivider />
        </div>
        <div className="flex flex-col items-start justify-between gap-9 md:flex-row">
          {Object.entries(links).map(([category, links]) => (
            <div className="flex flex-col items-start gap-2" key={category}>
              <Text className="font-bold">{category}</Text>
              {Object.entries(links).map(([link, linkUrl]) => (
                <Text key={link}>
                  <Link
                    href={linkUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {link}
                  </Link>
                </Text>
              ))}
            </div>
          ))}
        </div>

        <div className="my-[5rem] flex flex-col items-center justify-between gap-8 md:flex-row">
          <div className="flex flex-col items-center gap-5 md:flex-row md:gap-2">
            <a href="https://www.netlify.com" target="_blank">
              <img
                src="https://www.netlify.com/v3/img/components/netlify-color-accent.svg"
                alt="Deploys by Netlify"
              />
            </a>
            <Text className="text-center md:text-left">
              This site is powered by{" "}
              <Link href="https://www.netlify.com" target="_blank">
                Netlify
              </Link>
            </Text>
          </div>
          <div>{renderThemeToggleButton()}</div>
        </div>
      </UI.Container>
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
