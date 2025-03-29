import {
  GitHubLogoIcon,
  HamburgerMenuIcon,
  MagnifyingGlassIcon,
  MoonIcon,
  ReaderIcon,
  SunIcon,
} from "@radix-ui/react-icons";
import {
  Box,
  Button,
  Dialog,
  DropdownMenu,
  Flex,
  Grid,
  Link,
  Theme,
  Tooltip,
  VisuallyHidden,
} from "@radix-ui/themes";
import confetti from "canvas-confetti";
import clsx from "clsx";
import { PartyPopperIcon, SquareLibrary, XIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { AppUrl } from "../../../domains/app-url/AppUrl";
import type { ThemeType } from "../../../domains/utils/getTheme";
import { wait } from "../../../domains/utils/wait";
import { DiceRoller } from "../../client/DiceRoller/DiceRoller";
import { getSurfaceStyle } from "../../client/Surface/getSurfaceStyle";
import { NameLogo } from "./Logo";

const fontFamily =
  "-apple-system, BlinkMacSystemFont, 'Segoe UI (Custom)', Roboto, 'Helvetica Neue', 'Open Sans (Custom)', system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji'";

export function Header(props: { theme?: ThemeType }) {
  const [open, setOpen] = useState(false);

  function handleThemeButtonClick() {
    const element = document.documentElement;
    element.classList.toggle("dark");
    element.classList.toggle("light");

    const isDark = element.classList.contains("dark");

    localStorage.setItem("theme", isDark ? "dark" : "light");
  }

  useEffect(() => {
    document.addEventListener("astro:after-swap", handleAstroNavigation);

    return () => {
      document.removeEventListener("astro:after-swap", handleAstroNavigation);
    };

    function handleAstroNavigation() {
      if (localStorage.getItem("theme") === "dark") {
        document.documentElement.classList.toggle("dark", true);
        document.documentElement.classList.toggle("light", true);
      }
    }
  }, []);

  return (
    <Theme {...props.theme} hasBackground={false} className="min-h-0">
      <Grid
        justify={"between"}
        align={"center"}
        columns="3"
        className="my-9 mb-[3rem] items-center rounded-(--radius-2) border-t border-r border-b border-l border-(--accent-4) px-6 py-5 print:hidden"
        style={{
          ...getSurfaceStyle(),
        }}
      >
        <Flex justify={"start"}>
          <Link
            href={AppUrl.home()}
            highContrast
            aria-label="Home"
            onContextMenu={(e) => {
              e.preventDefault();
              window.open("/keeper-logo.svg", "_blank");
            }}
          >
            <NameLogo className="h-[1.25rem] fill-[currentColor]" />
          </Link>
        </Flex>
        <Flex gap="4" justify="center">
          <a href={AppUrl.campaigns()}>
            <Button
              radius="full"
              size="3"
              variant="ghost"
              className="m-0 hidden lg:flex"
            >
              <SquareLibrary />

              <span
                style={{
                  fontFamily,
                }}
              >
                My Campaigns
              </span>
              <VisuallyHidden> My Campaigns </VisuallyHidden>
            </Button>
          </a>
        </Flex>
        <Flex justify={"end"} gap="2" align={"center"}>
          <Box className="hidden sm:inline-block">
            <DiceRoller theme={props.theme} />
          </Box>

          <Tooltip content="Documentation">
            <Link href={AppUrl.docs()} aria-label="Documentation">
              <Button
                radius="full"
                size="3"
                variant="ghost"
                className="m-0 hidden md:inline-block"
                style={{
                  fontFamily,
                }}
              >
                <ReaderIcon className="h-[24px] w-[24px]" />
              </Button>
            </Link>
          </Tooltip>
          <Tooltip content="GitHub">
            <Link
              href={AppUrl.github()}
              aria-label="GitHub"
              target="_blank"
              rel="noreferrer"
            >
              <Button
                radius="full"
                size="3"
                variant="ghost"
                className="m-0 hidden md:inline-block"
                style={{
                  fontFamily,
                }}
              >
                <GitHubLogoIcon className="h-[24px] w-[24px]" />
              </Button>
            </Link>
          </Tooltip>
          <Tooltip content="Search">
            <Link
              href={AppUrl.search({})}
              aria-label="Search"
              className="hidden lg:inline-flex"
            >
              <Button radius="full" size="3" variant="ghost" className="m-0">
                <MagnifyingGlassIcon className="h-[24px] w-[24px]" />
              </Button>
            </Link>
          </Tooltip>

          <Tooltip content="Change Theme">
            <Button
              radius="full"
              size="3"
              id="themeToggle"
              onClick={handleThemeButtonClick}
              variant="ghost"
              className="m-0"
              aria-label="Change Theme"
            >
              <SunIcon className="sun h-[24px] w-[24px]" />
              <MoonIcon className="moon h-[24px] w-[24px]" />
            </Button>
          </Tooltip>
          <Box className="hidden sm:inline-block">{renderSupportButton()}</Box>

          <Dialog.Root
            open={open}
            onOpenChange={(open) => {
              setOpen(open);
            }}
          >
            <Tooltip content="Menu">
              <Dialog.Trigger
                onClick={() => {
                  return setOpen((prev) => !prev);
                }}
              >
                <Button
                  radius="full"
                  size="3"
                  id="themeToggle"
                  variant="ghost"
                  className="m-0 inline-flex lg:hidden"
                  aria-label="Menu"
                >
                  <HamburgerMenuIcon className="h-[24px] w-[24px]" />
                </Button>
              </Dialog.Trigger>
            </Tooltip>

            <Dialog.Content size={"3"}>
              <Dialog.Content size={"4"}>
                <Dialog.Title className="relative">
                  Menu
                  <Flex
                    gap="3"
                    justify="end"
                    className="absolute top-0 right-0"
                  >
                    <Dialog.Close>
                      <Button
                        variant="ghost"
                        color="gray"
                        onClick={() => {
                          return setOpen((prev) => !prev);
                        }}
                      >
                        <XIcon></XIcon>
                      </Button>
                    </Dialog.Close>
                  </Flex>
                </Dialog.Title>
                <Flex direction="column">
                  <Link href={AppUrl.campaigns()} color="gray">
                    My Campaigns
                  </Link>
                  <Link href={AppUrl.dice()} color="gray">
                    Dice Roller
                  </Link>
                  <Link
                    href={AppUrl.github()}
                    color="gray"
                    target="_blank"
                    rel="noreferrer"
                  >
                    GitHub
                  </Link>
                  <Link href={AppUrl.docs()} color="gray">
                    Documentation
                  </Link>
                  <Link href={AppUrl.search({})} color="gray">
                    Search
                  </Link>
                  <Link href={AppUrl.patreon()} color="gray">
                    Support on Patreon
                  </Link>
                  <Link href={AppUrl.kofi()} color="gray">
                    Buy a Coffee
                  </Link>
                </Flex>
              </Dialog.Content>
            </Dialog.Content>
          </Dialog.Root>
        </Flex>
      </Grid>
    </Theme>
  );

  function renderSupportButton() {
    return (
      <>
        <DropdownMenu.Root>
          <Tooltip content="Oh?">
            <DropdownMenu.Trigger>
              <Button
                radius="full"
                size="3"
                variant="solid"
                className={clsx([
                  "relative",
                  "before:absolute before:inset-0 before:rounded-[inherit] before:bg-[linear-gradient(45deg,transparent_25%,theme(colors.white/.5)_50%,transparent_75%,transparent_100%)] before:bg-[length:250%_250%,100%_100%] before:bg-[position:200%_0,0_0] before:bg-no-repeat before:[transition:background-position_0s_ease] hover:before:bg-[position:-100%_0,0_0] hover:before:duration-[1500ms]",
                ])}
                aria-label="Oh?"
              >
                <PartyPopperIcon className="h-[24px] w-[24px]"></PartyPopperIcon>
              </Button>
            </DropdownMenu.Trigger>
          </Tooltip>
          <DropdownMenu.Content>
            <DropdownMenu.Item
              onClick={async () => {
                await shootConfetti(2);
                window.open(AppUrl.patreon(), "_blank");
              }}
            >
              Support on Patreon
            </DropdownMenu.Item>
            <DropdownMenu.Item
              onClick={async () => {
                await shootConfetti(2);
                window.open(AppUrl.kofi(), "_blank");
              }}
            >
              Buy a Coffee
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </>
    );
  }
}

async function shootConfetti(numberOfTimes: number) {
  var scalar = 5;

  const unicorn = confetti.shapeFromText({ text: "☕", scalar });

  const defaults = {
    spread: 360,
    ticks: 60,
    gravity: 0,
    decay: 0.96,
    startVelocity: 20,
    shapes: [unicorn],
    scalar,
  };

  function shoot() {
    confetti({
      ...defaults,
      particleCount: 30,
    });

    confetti({
      ...defaults,
      particleCount: 5,
    });

    confetti({
      ...defaults,
      particleCount: 15,
      scalar: scalar / 2,
      shapes: ["circle"],
    });
  }

  for (let i = 0; i < numberOfTimes; i++) {
    shoot();
    await wait(100);
    shoot();
    await wait(200);
    shoot();
    await wait(500);
  }
}
