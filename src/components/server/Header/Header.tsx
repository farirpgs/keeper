import {
  DiscordLogoIcon,
  GitHubLogoIcon,
  HamburgerMenuIcon,
  MagnifyingGlassIcon,
} from "@radix-ui/react-icons";
import {
  Button,
  Card,
  Container,
  Dialog,
  DropdownMenu,
  Flex,
  Link,
  Popover,
  Text,
  TextField,
  Theme,
  Tooltip,
} from "@radix-ui/themes";
import confetti from "canvas-confetti";
import {
  BookIcon,
  Dice6,
  Dices,
  Map,
  PartyPopperIcon,
  XIcon,
} from "lucide-react";
import { useState, type JSX } from "react";
import { AppUrl } from "../../../domains/app-url/AppUrl";
import type { ThemeType } from "../../../domains/utils/getTheme";
import { wait } from "../../../domains/utils/wait";
import { getSurfaceStyle } from "../../client/Surface/getSurfaceStyle";
import { NameLogo } from "./Logo";

const fontFamily =
  "-apple-system, BlinkMacSystemFont, 'Segoe UI (Custom)', Roboto, 'Helvetica Neue', 'Open Sans (Custom)', system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji'";

export function Header(props: { theme: ThemeType; pathname: string }) {
  const [open, setOpen] = useState(false);

  const shouldShowSearch = !props.pathname.startsWith("/search");

  return (
    <Theme {...props.theme} hasBackground={false} className="min-h-0">
      <div
        style={getSurfaceStyle()}
        className="mb-6 rounded-(--radius-2) px-6 py-5 print:hidden"
      >
        <Container>
          <div className="flex flex-row">
            <div className="flex flex-1 flex-row items-center gap-4">
              {renderLogo()}
              {shouldShowSearch && (
                <div className="hidden md:flex">
                  <TextField.Root
                    variant="soft"
                    className="bg-transparent hover:bg-(--accent-3) dark:hover:bg-(--accent-6)"
                    color="gray"
                    placeholder="Search resources..."
                    onClick={(e) => {
                      location.href = AppUrl.search({});
                    }}
                  >
                    <TextField.Slot>
                      <MagnifyingGlassIcon height="16" width="16" />
                    </TextField.Slot>
                  </TextField.Root>
                </div>
              )}
            </div>
            <div className="hidden flex-row gap-3 md:flex">
              {renderNavButton({
                href: AppUrl.dice(),
                label: "Dice",
                icon: <Dices className="h-[1.5rem] w-[1.5rem]" />,
              })}
              {renderNavButton({
                href: AppUrl.github(),
                icon: <GitHubLogoIcon className="h-[24px] w-[24px]" />,
                label: "GitHub",
                external: true,
              })}
              {renderNavButton({
                href: AppUrl.discord(),
                icon: <DiscordLogoIcon className="h-[24px] w-[24px]" />,
                label: "Discord",
                external: true,
              })}

              {renderSupportButton()}
              {renderNavButton({
                label: "Resources",
                popoverContent: (
                  <div className="flex w-full flex-col gap-4 p-1">
                    {renderCardLink({
                      icon: <Dice6 className="h-[1rem] w-[1rem]" />,
                      title: "Campaigns",
                      description: "Manage your campaigns.",
                      href: AppUrl.campaigns(),
                    })}

                    {renderCardLink({
                      icon: <BookIcon className="h-[1rem] w-[1rem]" />,
                      title: "Resources",
                      description: "Free TTRPG resources.",
                      href: AppUrl.search({ type: "resources" }),
                    })}
                    {renderCardLink({
                      icon: <Map className="h-[1rem] w-[1rem]" />,
                      title: "Games",
                      description: "Sheets for your games",
                      href: AppUrl.search({ type: "games" }),
                    })}
                  </div>
                ),
              })}

              {renderNavButton({
                href: AppUrl.docs(),
                label: "Docs",
                external: true,
              })}
              {renderNavButton({
                href: AppUrl.feedback(),
                label: "Feedback",
                external: true,
              })}
            </div>
            {renderMobileMenuButton()}
          </div>
        </Container>
      </div>
    </Theme>
  );

  function renderCardLink(params: {
    title: string;
    description: string;
    href: string;
    icon?: JSX.Element;
  }) {
    return (
      <Card asChild>
        <Link href={params.href} className="flex flex-col no-underline">
          <div className="flex flex-row items-center gap-1">
            <div>{params.icon}</div>
            <Text as="div" size="2" weight="bold" className="">
              {params.title}
            </Text>
          </div>
          <Text as="div" color="gray" size="2">
            {params.description}
          </Text>
        </Link>
      </Card>
    );
  }

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

  function renderNavButton(params: {
    href?: string;
    icon?: JSX.Element;
    label: string;
    external?: boolean;
    popoverContent?: JSX.Element;
  }) {
    const external = params.external === undefined ? false : params.external;
    const button = params.icon ? (
      <Button
        radius={params.icon ? "full" : undefined}
        variant="soft"
        className="bg-transparent hover:bg-(--accent-3) dark:hover:bg-(--accent-6)"
        color="gray"
        highContrast
        style={{ fontFamily }}
      >
        {params.icon}
      </Button>
    ) : (
      <Button
        radius={params.icon ? "full" : undefined}
        variant="soft"
        className="bg-transparent hover:bg-(--accent-3) dark:hover:bg-(--accent-6)"
        color="gray"
        highContrast
        style={{ fontFamily }}
      >
        {params.label}
      </Button>
    );

    if (params.href && params.icon) {
      return (
        <Tooltip content={params.label}>
          <Link
            href={params.href}
            aria-label={params.label}
            target={external ? "_blank" : undefined}
            rel={external ? "noreferrer" : undefined}
          >
            {button}
          </Link>
        </Tooltip>
      );
    }

    if (params.href && !params.icon) {
      return (
        <Link
          href={params.href}
          aria-label={params.label}
          target={external ? "_blank" : undefined}
          rel={external ? "noreferrer" : undefined}
        >
          {button}
        </Link>
      );
    }

    if (params.href && params.icon) {
      return (
        <Link
          href={params.href}
          aria-label={params.label}
          target={external ? "_blank" : undefined}
          rel={external ? "noreferrer" : undefined}
        >
          {button}
        </Link>
      );
    }

    if (params.popoverContent) {
      return (
        <Popover.Root>
          <Popover.Trigger>{button}</Popover.Trigger>
          <Popover.Content width="500px">
            {params.popoverContent}
          </Popover.Content>
        </Popover.Root>
      );
    }
  }

  function renderMobileMenuButton() {
    const links: Record<string, Array<{ title: string; href: string }>> = {
      "": [
        {
          title: "Home",
          href: AppUrl.home(),
        },
      ],

      Resources: [
        {
          title: "Search",
          href: AppUrl.search({ type: "all" }),
        },
        {
          title: "Dice Roller",
          href: AppUrl.dice(),
        },
        {
          title: "Campaigns",
          href: AppUrl.campaigns(),
        },
      ],
      Community: [
        {
          title: "Documentation",
          href: AppUrl.docs(),
        },
        {
          title: "Feedback",
          href: AppUrl.feedback(),
        },
        {
          title: "Discord",
          href: AppUrl.discord(),
        },
        {
          title: "GitHub",
          href: AppUrl.github(),
        },
      ],
    };
    return (
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <div className="block md:hidden">
          <Tooltip content="Menu">
            <Dialog.Trigger>
              <Button
                radius="full"
                size="3"
                variant="soft"
                color="gray"
                highContrast
                className="bg-transparent hover:bg-(--accent-3) dark:hover:bg-(--accent-6)"
                aria-label="Menu"
              >
                <HamburgerMenuIcon className="h-[24px] w-[24px]" />
              </Button>
            </Dialog.Trigger>
          </Tooltip>
        </div>
        <Dialog.Content size="3">
          <Dialog.Title className="relative">
            <div className="px-3">Menu</div>
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
          <Dialog.Description className="hidden">
            Site Navigation
          </Dialog.Description>

          <Flex direction="column">
            {Object.entries(links).map(([key, value]) => (
              <div key={key} className="flex flex-col">
                {key && (
                  <Text size="3" weight="bold" className="px-3 py-2">
                    {key}
                  </Text>
                )}
                {value.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    color="gray"
                    highContrast
                    size={"3"}
                    className="block rounded-3xl px-3 py-2 no-underline hover:bg-(--accent-3)"
                    target={item.href.startsWith("http") ? "_blank" : undefined}
                    rel={
                      item.href.startsWith("http") ? "noreferrer" : undefined
                    }
                  >
                    {item.title}
                  </Link>
                ))}
              </div>
            ))}
          </Flex>
        </Dialog.Content>
      </Dialog.Root>
    );
  }

  function renderSupportButton() {
    return (
      <DropdownMenu.Root>
        <Tooltip content="Oh?">
          <DropdownMenu.Trigger>
            <Button
              radius="full"
              size="2"
              variant="soft"
              className="bg-transparent hover:bg-(--accent-3) dark:hover:bg-(--accent-6)"
              color="gray"
              // className={clsx([
              //   "relative",
              //   "before:absolute before:inset-0 before:rounded-[inherit] before:bg-[linear-gradient(45deg,transparent_25%,theme(colors.white/.5)_50%,transparent_75%,transparent_100%)] before:bg-[length:250%_250%,100%_100%] before:bg-[position:200%_0,0_0] before:bg-no-repeat before:[transition:background-position_0s_ease] hover:before:bg-[position:-100%_0,0_0] hover:before:duration-[1500ms]",
              // ])}
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

  function renderSupportMenuItem(params: { href: string; label: string }) {
    return (
      <DropdownMenu.Item
        onClick={async function handleClick() {
          await shootConfetti({ numberOfTimes: 2 });
          window.open(params.href, "_blank");
        }}
      >
        {params.label}
      </DropdownMenu.Item>
    );
  }

  async function shootConfetti(params: { numberOfTimes: number }) {
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

    for (let i = 0; i < params.numberOfTimes; i++) {
      shoot();
      await wait(100);
      shoot();
      await wait(200);
      shoot();
      await wait(500);
    }
  }
}
