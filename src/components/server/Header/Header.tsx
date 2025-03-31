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
  Container,
  Dialog,
  DropdownMenu,
  Flex,
  Grid,
  Link,
  Theme,
  Tooltip,
} from "@radix-ui/themes";
import confetti from "canvas-confetti";
import clsx from "clsx";
import { PartyPopperIcon, SquareLibrary, XIcon } from "lucide-react";
import { useEffect, useState, type JSX } from "react";
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

  useEffect(() => {
    const handleAstroNavigation = () => {
      const isDark = localStorage.getItem("theme") === "dark";
      document.documentElement.classList.toggle("dark", isDark);
      document.documentElement.classList.toggle("light", !isDark);
    };

    document.addEventListener("astro:after-swap", handleAstroNavigation);
    return () =>
      document.removeEventListener("astro:after-swap", handleAstroNavigation);
  }, []);

  const handleThemeButtonClick = () => {
    const element = document.documentElement;
    const isDark = element.classList.toggle("dark");
    element.classList.toggle("light", !isDark);
    localStorage.setItem("theme", isDark ? "dark" : "light");
  };

  return (
    <Theme {...props.theme} hasBackground={false} className="min-h-0">
      <div
        style={getSurfaceStyle()}
        className="mb-9 rounded-(--radius-2) px-6 py-5 print:hidden"
      >
        <Container>
          <Grid
            justify="between"
            align="center"
            columns="3"
            className="items-center"
          >
            <Flex justify="start">{renderLogo()}</Flex>
            <Flex gap="4" justify="center">
              {renderNavButton({
                href: AppUrl.campaigns(),
                icon: <SquareLibrary />,
                label: "My Campaigns",
              })}
            </Flex>
            <Flex justify="end" gap="2" align="center">
              <Box className="hidden sm:inline-block">
                <DiceRoller theme={props.theme} />
              </Box>
              {renderNavButton({
                href: AppUrl.docs(),
                icon: <ReaderIcon className="h-[24px] w-[24px]" />,
                label: "Documentation",
                external: true,
              })}
              {renderNavButton({
                href: AppUrl.github(),
                icon: <GitHubLogoIcon className="h-[24px] w-[24px]" />,
                label: "GitHub",
                external: true,
              })}
              {renderNavButton({
                href: AppUrl.search({}),
                icon: <MagnifyingGlassIcon className="h-[24px] w-[24px]" />,
                label: "Search",
              })}
              {renderThemeToggleButton()}
              <Box className="hidden sm:inline-block">
                {renderSupportButton()}
              </Box>
              {renderMenuDialog()}
            </Flex>
          </Grid>
        </Container>
      </div>
    </Theme>
  );

  function renderLogo() {
    return (
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
    );
  }

  function renderNavButton(p: {
    href: string;
    icon: JSX.Element;
    label: string;
    external?: boolean;
  }) {
    const external = p.external === undefined ? false : p.external;
    return (
      <Tooltip content={p.label}>
        <Link
          href={p.href}
          aria-label={p.label}
          target={external ? "_blank" : undefined}
          rel={external ? "noreferrer" : undefined}
        >
          <Button
            radius="full"
            size="3"
            variant="ghost"
            className="m-0 hidden md:inline-block"
            style={{ fontFamily }}
          >
            {p.icon}
          </Button>
        </Link>
      </Tooltip>
    );
  }

  function renderThemeToggleButton() {
    return (
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
    );
  }

  function renderMenuDialog() {
    return (
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Tooltip content="Menu">
          <Dialog.Trigger>
            <Button
              radius="full"
              size="3"
              variant="ghost"
              className="m-0 inline-flex lg:hidden"
              aria-label="Menu"
            >
              <HamburgerMenuIcon className="h-[24px] w-[24px]" />
            </Button>
          </Dialog.Trigger>
        </Tooltip>
        <Dialog.Content size="3">
          <Dialog.Title className="relative">
            Menu
            <Flex gap="3" justify="end" className="absolute top-0 right-0">
              <Dialog.Close>
                <Button
                  variant="ghost"
                  color="gray"
                  onClick={() => setOpen(false)}
                >
                  <XIcon />
                </Button>
              </Dialog.Close>
            </Flex>
          </Dialog.Title>
          <Flex direction="column">
            {renderMenuLink({
              href: AppUrl.campaigns(),
              label: "My Campaigns",
            })}
            {renderMenuLink({ href: AppUrl.dice(), label: "Dice Roller" })}
            {renderMenuLink({
              href: AppUrl.github(),
              label: "GitHub",
              external: true,
            })}
            {renderMenuLink({ href: AppUrl.docs(), label: "Documentation" })}
            {renderMenuLink({ href: AppUrl.search({}), label: "Search" })}
            {renderMenuLink({
              href: AppUrl.patreon(),
              label: "Support on Patreon",
            })}
            {renderMenuLink({ href: AppUrl.kofi(), label: "Buy a Coffee" })}
          </Flex>
        </Dialog.Content>
      </Dialog.Root>
    );
  }

  function renderMenuLink(p: {
    href: string;
    label: string;
    external?: boolean;
  }) {
    const external = p.external === undefined ? false : p.external;
    return (
      <Link
        href={p.href}
        color="gray"
        target={external ? "_blank" : undefined}
        rel={external ? "noreferrer" : undefined}
      >
        {p.label}
      </Link>
    );
  }

  function renderSupportButton() {
    return (
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
              <PartyPopperIcon className="h-[24px] w-[24px]" />
            </Button>
          </DropdownMenu.Trigger>
        </Tooltip>
        <DropdownMenu.Content>
          {renderSupportMenuItem({
            href: AppUrl.patreon(),
            label: "Support on Patreon",
          })}
          {renderSupportMenuItem({
            href: AppUrl.kofi(),
            label: "Buy a Coffee",
          })}
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    );
  }

  function renderSupportMenuItem(p: { href: string; label: string }) {
    return (
      <DropdownMenu.Item
        onClick={async function handleClick() {
          await shootConfetti({ numberOfTimes: 2 });
          window.open(p.href, "_blank");
        }}
      >
        {p.label}
      </DropdownMenu.Item>
    );
  }

  async function shootConfetti(p: { numberOfTimes: number }) {
    const scalar = 5;
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
      confetti({ ...defaults, particleCount: 30 });
      confetti({ ...defaults, particleCount: 5 });
      confetti({
        ...defaults,
        particleCount: 15,
        scalar: scalar / 2,
        shapes: ["circle"],
      });
    }

    for (let i = 0; i < p.numberOfTimes; i++) {
      shoot();
      await wait(100);
      shoot();
      await wait(200);
      shoot();
      await wait(500);
    }
  }
}
