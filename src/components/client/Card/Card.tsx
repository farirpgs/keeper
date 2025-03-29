import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import {
  AspectRatio,
  Badge,
  Box,
  Button,
  DropdownMenu,
  Flex,
  Card as RadixCard,
  Text,
} from "@radix-ui/themes";
import clsx from "clsx";
import { useState } from "react";
import { Colors, type ColorType } from "../../../domains/colors/colors";
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
    <RadixCard variant="ghost" className="rounded-lg">
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
        <Flex gap="2" align="start" direction={"column"} position={"relative"}>
          <AspectRatio
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
          </AspectRatio>

          <Box
            position={"absolute"}
            className="bottom-0 left-0 h-[100%] w-full"
            style={{
              borderRadius: "var(--radius-2)",
              background:
                "linear-gradient(rgba(0, 0, 0, 0) 0%,rgba(0, 0, 0, 0) 50%, rgba(0, 0, 0,.2) 65%, rgba(0, 0, 0, .66) 75%, rgba(0, 0, 0, 1) 100%)",
            }}
          />
          {props.badge && (
            <Box className="absolute top-4 right-4">{props.badge}</Box>
          )}

          <Box position={"absolute"} className="bottom-0 left-0 w-full">
            <Flex
              gap="2"
              justify={"between"}
              align={"end"}
              width={"100%"}
              className="px-4 py-4"
            >
              <Box
                className={clsx("w-full", {
                  "max-w-[75%]": hasSideContent,
                  "max-w-[100%]": !hasSideContent,
                })}
              >
                <Flex gap="2" align="end">
                  {props.error && (
                    <Badge size="2" color="red">
                      {props.error}
                    </Badge>
                  )}
                  <Text
                    as="div"
                    size={{
                      initial: "4",
                      lg: "6",
                    }}
                    weight="bold"
                    truncate
                    color="gray"
                    className="dark text-(--accent-a12)"
                  >
                    {props.title}
                  </Text>
                </Flex>

                {props.subtitle && (
                  <Text
                    as="div"
                    size={{
                      initial: "2",
                      lg: "5",
                    }}
                    color="gray"
                    truncate
                    className="dark text-(--accent-a11)"
                  >
                    {props.subtitle}
                  </Text>
                )}
              </Box>
              {props.menu && (
                <DropdownMenu.Root>
                  <DropdownMenu.Trigger>
                    <Button
                      variant={hover ? "solid" : "outline"}
                      className="transition-all duration-75"
                    >
                      <HamburgerMenuIcon />
                      <DropdownMenu.TriggerIcon />
                    </Button>
                  </DropdownMenu.Trigger>
                  <DropdownMenu.Content>{props.menu}</DropdownMenu.Content>
                </DropdownMenu.Root>
              )}
            </Flex>
          </Box>
        </Flex>
      </a>
    </RadixCard>
  );
}
