import { HamburgerMenuIcon } from "@radix-ui/react-icons";

import clsx from "clsx";
import { useState } from "react";
import { Colors, type ColorType } from "../../../domains/colors/colors";
import { UI } from "../../ui/ui";
import { Graphic } from "../Graphic/Graphic";

export function Card(props: {
  href?: string;
  title: string;
  subtitle?: string;
  menu?: React.ReactNode;
  badge?: React.ReactNode;
  accentColor?: ColorType;
  error?: string;
  children?: React.ReactNode;
}) {
  const [hover, setHover] = useState(false);

  const firstColor = props.accentColor
    ? Colors.getDarkColor(props.accentColor, 3)
    : undefined;
  const secondColor = props.accentColor
    ? Colors.getDarkColor(props.accentColor, 11)
    : undefined;

  const hasSideContent = props.menu || props.badge;
  function handleMouseEnter() {
    setHover(true);
  }

  function handleMouseLeave() {
    setHover(false);
  }

  return (
    <UI.Card variant="ghost" className="rounded-lg">
      <a
        style={{
          background: !props.accentColor
            ? "#000"
            : `linear-gradient(45deg, ${firstColor} 0%, ${secondColor} 100%)`,
        }}
        className={clsx(
          "relative block overflow-hidden rounded-lg transition-all",
          hover ? "brightness-[115%]" : "",
        )}
        href={props.href}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="relative flex flex-col items-start gap-2">
          <UI.AspectRatio
            ratio={630 / 500}
            className={clsx([
              "[&>img]:h-full",
              "[&>img]:w-full",
              "[&>img]:rounded-lg",
              "[&>img]:object-cover",
            ])}
          >
            <Graphic
              accentColor={props.accentColor}
              style={{
                opacity: 0.5,
              }}
            />
            {props.children}
          </UI.AspectRatio>

          <UI.Box
            position={"absolute"}
            className="bottom-0 left-0 h-[100%] w-full"
            style={{
              borderRadius: "var(--radius-2)",
              background:
                "linear-gradient(rgba(0, 0, 0, 0) 0%,rgba(0, 0, 0, 0) 50%, rgba(0, 0, 0,.2) 65%, rgba(0, 0, 0, .66) 75%, rgba(0, 0, 0, 1) 100%)",
            }}
          />
          {props.badge && (
            <UI.Box className="absolute right-4 bottom-4">{props.badge}</UI.Box>
          )}

          <UI.Box position={"absolute"} className="bottom-0 left-0 w-full">
            <div className="flex w-full items-end justify-between gap-2 px-4 py-4">
              <UI.Box
                className={clsx("flex w-full flex-col", {
                  "max-w-[75%]": hasSideContent,
                  "max-w-[100%]": !hasSideContent,
                })}
              >
                <div className="flex items-end gap-2">
                  {props.error && (
                    <UI.Badge size="2" color="red">
                      {props.error}
                    </UI.Badge>
                  )}
                  <UI.Text
                    as="div"
                    size={{
                      initial: "5",
                      lg: "5",
                    }}
                    weight="bold"
                    truncate
                    color="gray"
                    className="dark text-(--accent-a12)"
                  >
                    {props.title}
                  </UI.Text>
                </div>

                {props.subtitle && (
                  <UI.Text
                    as="div"
                    size={{
                      initial: "2",
                      lg: "2",
                    }}
                    color="gray"
                    truncate
                    className="dark text-(--accent-a11)"
                  >
                    {props.subtitle}
                  </UI.Text>
                )}
              </UI.Box>
              {props.menu && (
                <UI.DropdownMenu.Root>
                  <UI.DropdownMenu.Trigger>
                    <UI.Button
                      variant={hover ? "solid" : "outline"}
                      className="transition-all duration-75"
                    >
                      <HamburgerMenuIcon />
                      <UI.DropdownMenu.TriggerIcon />
                    </UI.Button>
                  </UI.DropdownMenu.Trigger>
                  <UI.DropdownMenu.Content>
                    {props.menu}
                  </UI.DropdownMenu.Content>
                </UI.DropdownMenu.Root>
              )}
            </div>
          </UI.Box>
        </div>
      </a>
    </UI.Card>
  );
}
