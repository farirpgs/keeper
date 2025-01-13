import {
  Badge,
  Box,
  Button,
  Dialog,
  Flex,
  Text,
  Theme,
  Tooltip,
} from "@radix-ui/themes";
import clsx from "clsx";
import { CircleOff, Dices, XIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { ThemeType } from "../../../domains/utils/getTheme";
import {
  diceCommandList,
  DiceCommands,
  type DiceCommandsType,
} from "./DiceCommands";
import { DiceIcons } from "./DiceIcons";

export function DiceRoller(props: { theme?: ThemeType; button?: boolean }) {
  const renderButton = props.button ?? true;
  const [open, setOpen] = useState(false);
  const [results, setResults] = useState<
    Array<{
      value: string;
      command: DiceCommandsType;
    }>
  >([]);
  const [animatedResultIndexes, setAnimatedResultIndexes] = useState<
    Array<number>
  >([]);

  const [selectedResultIndexes, setSelectedResultIndexes] = useState<
    Array<number>
  >([]);

  const selectedResults = results.filter((_, index) =>
    selectedResultIndexes.includes(index),
  );

  const resultsToUse = selectedResults.length > 0 ? selectedResults : results;
  const totalResult = resultsToUse.reduce((acc, result) => {
    if (!result.value) return acc;

    if (isNaN(parseInt(result.value))) {
      return acc;
    }

    return acc + parseInt(result.value);
  }, 0);
  const highestResult = resultsToUse.reduce((acc, result) => {
    if (!result.value) return acc;

    if (isNaN(parseInt(result.value))) {
      return acc;
    }

    return Math.max(acc, parseInt(result.value));
  }, -Infinity);
  const lowestResult = resultsToUse.reduce((acc, result) => {
    if (!result.value) return acc;

    if (isNaN(parseInt(result.value))) {
      return acc;
    }

    return Math.min(acc, parseInt(result.value));
  }, Infinity);
  const isAnimating = animatedResultIndexes.length > 0;

  function handleDiceClick(diceCommand: DiceCommandsType) {
    const result = DiceCommands[diceCommand].roll();
    setResults((prev) => {
      return [
        ...prev,
        {
          value: result,
          command: diceCommand,
        },
      ];
    });
  }

  function handleRerollIndex(index: number) {
    setResults((prev) => {
      return [
        ...prev.slice(0, index),
        {
          value: DiceCommands[prev[index].command].roll(),
          command: prev[index].command,
        },
        ...prev.slice(index + 1),
      ];
    });
  }

  function handleAddIndexSelectedResult(index: number) {
    setSelectedResultIndexes((prev) => {
      if (prev.includes(index)) {
        return prev.filter((i) => i !== index);
      } else {
        return [...prev, index];
      }
    });
  }

  function handleReroll() {
    setResults((prev) => {
      return prev.map((result) => {
        return {
          value: DiceCommands[result.command].roll(),
          command: result.command,
        };
      });
    });
    setSelectedResultIndexes([]);
  }

  function handleClear() {
    setResults([]);
    setSelectedResultIndexes([]);
  }

  function handleCloseModal() {
    setResults([]);
    setSelectedResultIndexes([]);
    setOpen(false);
  }

  function addAnimatedResultIndex(index: number) {
    setAnimatedResultIndexes((prev) => {
      return [...prev, index];
    });
  }

  function removeAnimatedResultIndex(index: number) {
    setAnimatedResultIndexes((prev) => {
      return prev.filter((i) => i !== index);
    });
  }

  return (
    <Theme {...props.theme} hasBackground={false} asChild>
      {renderButton ? (
        <div>
          <Dialog.Root
            open={open}
            onOpenChange={(isOpen) => {
              if (!isOpen) {
                handleCloseModal();
              }
            }}
          >
            <Tooltip content="Dice Roller">
              <Dialog.Trigger
                onClick={() => {
                  return setOpen(true);
                }}
              >
                <Button
                  radius="full"
                  size="3"
                  variant="ghost"
                  className="m-0"
                  aria-label="Dice Roller"
                >
                  <Dices />
                </Button>
              </Dialog.Trigger>
            </Tooltip>

            <Dialog.Content size={"4"}>
              <Dialog.Title className="relative">
                Dice Roller {renderCloseButton()}
              </Dialog.Title>
              <Dialog.Description size="2" mb="4">
                Click on a dice to roll it.
              </Dialog.Description>

              {renderDialogContent()}
            </Dialog.Content>
          </Dialog.Root>
        </div>
      ) : (
        <div>{renderDialogContent()}</div>
      )}
    </Theme>
  );

  function renderDialogContent() {
    return (
      <Flex direction="column" gap="4" align={"center"}>
        <Flex direction={"column"} gap="8">
          <Flex>{renderDice()}</Flex>
          <Flex
            direction={"column"}
            gap="4"
            align={"center"}
            justify={"between"}
          >
            <Flex gap="2" justify="center" align="center" direction={"column"}>
              {renderResultsStats()}
            </Flex>
            <Flex direction="row" gap="5" wrap={"wrap"} justify={"center"}>
              {renderResults()}
            </Flex>
            <Flex gap="2" justify="center" align="center">
              {renderResultsMenu()}
            </Flex>
            <Flex gap="2" justify="center" align="center" direction={"column"}>
              {renderResultsText()}
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    );
  }

  function renderResults() {
    return (
      <Flex direction="row" gap="2" wrap={"wrap"} justify={"center"}>
        {results.length === 0 && (
          <Text color="gray">
            <CircleOff size="6rem" className="text-[--accent-5]"></CircleOff>
          </Text>
        )}
        {results.map((result, index) => {
          const Icon = DiceIcons[result.command];
          const selected = selectedResultIndexes.includes(index);
          return (
            <Button
              key={index}
              size="3"
              className="flex h-auto flex-col items-center justify-center gap-2 p-4 font-mono"
              variant={selected ? "surface" : "outline"}
              color={selected ? undefined : "gray"}
              onClick={() => {
                handleRerollIndex(index);
              }}
              onContextMenu={(e) => {
                e.preventDefault();
                handleAddIndexSelectedResult(index);
              }}
            >
              <Text>
                <AnimatedResult
                  watch={result}
                  result={result.value}
                  animate={true}
                  onAnimatingChange={(animating) => {
                    if (animating) {
                      addAnimatedResultIndex(index);
                    } else {
                      removeAnimatedResultIndex(index);
                    }
                  }}
                ></AnimatedResult>
              </Text>
              <div>
                <Icon className="h-auto w-6"></Icon>
              </div>
            </Button>
          );
        })}
      </Flex>
    );
  }

  function renderResultsText() {
    return (
      <Text color="gray" size={"1"} className="text-center text-[--accent-11]">
        Click on a result to reroll it.
        <br />
        Right click on a result to add it to highlight it.
      </Text>
    );
  }

  function renderResultsStats() {
    return (
      <Flex gap="2">
        <Badge
          size="2"
          className={clsx("transition-all", {
            "opacity-35": results.length === 0,
          })}
          color={selectedResultIndexes.length > 0 ? undefined : "gray"}
          variant={selectedResultIndexes.length > 0 ? "surface" : "outline"}
        >
          Total: {isAnimating || totalResult === 0 ? "-" : totalResult}
        </Badge>
        <Badge
          size="2"
          className={clsx("transition-all", {
            "opacity-35": results.length === 0,
          })}
          color={selectedResultIndexes.length > 0 ? undefined : "gray"}
          variant={selectedResultIndexes.length > 0 ? "surface" : "outline"}
        >
          Highest:{" "}
          {isAnimating || highestResult === -Infinity ? "-" : highestResult}
        </Badge>
        <Badge
          size="2"
          className={clsx("transition-all", {
            "opacity-35": results.length === 0,
          })}
          color={selectedResultIndexes.length > 0 ? undefined : "gray"}
          variant={selectedResultIndexes.length > 0 ? "surface" : "outline"}
        >
          Lowest:{" "}
          {isAnimating || lowestResult === Infinity ? "-" : lowestResult}
        </Badge>
      </Flex>
    );
  }

  function renderResultsMenu() {
    return (
      <Flex gap="2">
        <Button
          variant="solid"
          disabled={results.length === 0}
          onClick={() => {
            return handleReroll();
          }}
        >
          Reroll all
        </Button>
        <Button
          variant="soft"
          disabled={results.length === 0}
          onClick={() => {
            return handleClear();
          }}
        >
          Clear all
        </Button>
      </Flex>
    );
  }

  function renderDice() {
    return (
      <Box>
        <Flex
          direction="row"
          gap="2"
          wrap={"wrap"}
          justify={"center"}
          align={"center"}
        >
          {diceCommandList.map((diceCommand) => {
            const Icon = DiceIcons[diceCommand];
            return (
              <Button
                key={diceCommand}
                size={"1"}
                variant="soft"
                className="h-auto py-3"
                onClick={() => handleDiceClick(diceCommand)}
              >
                <Flex direction="column" gap="2" align="center">
                  <Icon className="h-auto w-8"></Icon>
                  <Text size="2">{DiceCommands[diceCommand].label}</Text>
                </Flex>
              </Button>
            );
          })}
        </Flex>
      </Box>
    );
  }

  function renderCloseButton() {
    return (
      <Flex gap="3" justify="end" className="absolute right-0 top-0">
        <Dialog.Close>
          <Button
            variant="ghost"
            color="gray"
            onClick={() => {
              handleCloseModal();
            }}
          >
            <XIcon></XIcon>
          </Button>
        </Dialog.Close>
      </Flex>
    );
  }
}

function AnimatedResult(props: {
  watch: any;
  result: string;
  animate: boolean;
  possibleResults?: Array<string>;
  onAnimatingChange?: (animating: boolean) => void;
}) {
  const possibleResults = props.possibleResults || [
    "▁",
    "▂",
    "▃",
    "▄",
    "▅",
    "▆",
    "▇",
    "█",
    "▇",
    "▆",
    "▅",
    "▄",
    "▃",
    "▁",
  ];
  const [animating, setAnimating] = useState(false);
  const defaultResult = props.animate ? possibleResults[0] : props.result;
  const [visibleResult, setVisibleResult] = useState(defaultResult);
  const loadingIndexRef = useRef(0);

  useEffect(() => {
    props.onAnimatingChange?.(animating);
  }, [animating]);

  useEffect(() => {
    let timeout: any;
    let count = 0;

    function animate() {
      setAnimating(true);
      timeout = setTimeout(() => {
        if (count >= 15) {
          setVisibleResult(props.result);
          setAnimating(false);
          return;
        } else {
          count++;
          setVisibleResult(possibleResults[loadingIndexRef.current]);
          loadingIndexRef.current =
            loadingIndexRef.current + 1 >= possibleResults.length
              ? 0
              : loadingIndexRef.current + 1;

          animate();
        }
      }, 50);
    }

    if (props.animate) {
      animate();
    } else {
      setVisibleResult(props.result);
    }

    return () => clearTimeout(timeout);
  }, [props.watch]);

  return <>{visibleResult}</>;
}
