import {
  Badge,
  Box,
  Button,
  Card,
  Dialog,
  Flex,
  Heading,
  SegmentedControl,
  Text,
  Theme,
  Tooltip,
} from "@radix-ui/themes";
import clsx from "clsx";
import { CircleOff, XIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { ThemeType } from "../../../domains/utils/getTheme";
import { DiceCommands, type DiceCommandsType } from "./DiceCommands";
import { DiceIcons } from "./DiceIcons";

export function DiceRoller(props: {
  theme?: ThemeType;
  button?: boolean;
  children?: React.ReactNode;
}) {
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

  const categories = ["standard", "misc"] as const;
  type CategoryType = (typeof categories)[number];

  const [category, setCategory] = useState<CategoryType>("standard");

  function handleCategoryChange(params: { value: CategoryType }) {
    setCategory(params.value);
  }

  const selectedResults = results.filter((_, index) =>
    selectedResultIndexes.includes(index),
  );

  const resultsToUse = selectedResults.length > 0 ? selectedResults : results;

  const totalResult = resultsToUse.reduce((acc, result) => {
    if (!result.value) return acc;

    if (isNaN(parseInt(result.value))) {
      return acc;
    }

    if (acc === -Infinity) {
      return parseInt(result.value);
    }

    return acc + parseInt(result.value);
  }, -Infinity);

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
      <div className="min-h-auto">
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
                  {props.children}
                </Dialog.Trigger>
              </Tooltip>

              <Dialog.Content
                size={"4"}
                className="bg-gray-50 p-0 dark:bg-gray-900"
              >
                <div className="px-6 pt-6 pb-4">
                  <Dialog.Title className="relative m-0">
                    <Heading size="7" className="m-0">
                      Dice Roller
                    </Heading>
                    {renderCloseButton()}
                  </Dialog.Title>
                  <Dialog.Description size="2" mb="4" className="hidden">
                    Click on a dice to roll it.
                  </Dialog.Description>
                </div>
                <div>{renderDialogContent()}</div>
              </Dialog.Content>
            </Dialog.Root>
          </div>
        ) : (
          <div>{renderDialogContent()}</div>
        )}
      </div>
    </Theme>
  );

  function renderDialogContent() {
    return (
      <div
        className="flex w-full flex-col items-center gap-4"
        onContextMenu={(e) => {
          e.preventDefault();
        }}
      >
        <div className="flex w-full flex-col gap-4">
          <div className="w-full px-6">
            <SegmentedControl.Root
              value={category}
              onValueChange={(value) => {
                return handleCategoryChange({ value: value as CategoryType });
              }}
              className="w-full"
            >
              {categories.map((cat) => {
                return (
                  <SegmentedControl.Item
                    key={cat}
                    value={cat}
                    className="cursor-auto"
                  >
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </SegmentedControl.Item>
                );
              })}
            </SegmentedControl.Root>
          </div>
          <div className="px-6">{renderDice()}</div>
        </div>
        <div className="flex w-full flex-col gap-4 rounded-sm bg-white p-6 dark:bg-gray-800">
          <Heading size="5" className="">
            Result
          </Heading>
          <Card className="flex min-h-[150px] items-center justify-center bg-gray-50 p-3 dark:bg-gray-900">
            {renderResults()}
          </Card>
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="w-full">{renderResultsStats()}</div>
            <div className="w-full">{renderResultActions()}</div>
            <div className="w-full">{renderResultsText()}</div>
          </div>
        </div>
      </div>
    );
  }

  function renderResults() {
    return (
      <Flex direction="row" gap="2" wrap={"wrap"} justify={"center"}>
        {results.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-2 text-center">
            <Text color="gray" className="">
              <CircleOff size="4rem" className="text-(--accent-5)"></CircleOff>
            </Text>
            <Text color="gray" className="" size="3">
              Click on a dice to roll it.
            </Text>
          </div>
        )}
        {results.map((result, index) => {
          const Icon = DiceIcons[result.command];
          const selected = selectedResultIndexes.includes(index);
          return (
            <Button
              key={index}
              size="3"
              className="flex h-auto flex-col items-center justify-center gap-2 p-4 font-mono"
              variant={selected ? "classic" : "surface"}
              // color={selected ? undefined : "gray"}
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
      <div className="flex w-full flex-col justify-center">
        <Text
          color="gray"
          size={"1"}
          className="text-center text-(--accent-11)"
        >
          Click on a result to reroll it.
          <br />
          Right click on a result to highlight it.
        </Text>
      </div>
    );
  }

  function renderResultsStats() {
    return (
      <div className="flex w-full justify-center gap-2">
        <Badge
          size="2"
          className={clsx("block flex-grow p-3 text-center", {})}
          color={selectedResultIndexes.length > 0 ? undefined : "gray"}
          variant={selectedResultIndexes.length > 0 ? "soft" : "soft"}
        >
          <div>
            <Text size="2">Total</Text>
          </div>
          <div>
            <Text size="3" weight={"bold"}>
              {isAnimating || totalResult === -Infinity ? "-" : totalResult}
            </Text>
          </div>
        </Badge>
        <Badge
          size="2"
          className={clsx("block flex-grow p-3 text-center", {})}
          color={selectedResultIndexes.length > 0 ? undefined : "gray"}
          variant={selectedResultIndexes.length > 0 ? "soft" : "soft"}
        >
          <div>
            <Text size="2">Highest</Text>
          </div>
          <div>
            <Text size="3" weight={"bold"}>
              {isAnimating || highestResult === -Infinity ? "-" : highestResult}
            </Text>
          </div>
        </Badge>
        <Badge
          size="2"
          className={clsx("block flex-grow p-3 text-center", {})}
          color={selectedResultIndexes.length > 0 ? undefined : "gray"}
          variant={selectedResultIndexes.length > 0 ? "soft" : "soft"}
        >
          <div>
            <Text size="2">Lowest</Text>
          </div>
          <div>
            <Text size="3" weight={"bold"}>
              {isAnimating || lowestResult === Infinity ? "-" : lowestResult}
            </Text>
          </div>
        </Badge>
      </div>
    );
  }

  function renderResultActions() {
    return (
      <div className="flex flex-row justify-center gap-2">
        <Button
          variant="solid"
          size="3"
          disabled={results.length === 0}
          onClick={() => {
            return handleReroll();
          }}
        >
          Reroll all
        </Button>
        <Button
          variant="outline"
          size="3"
          disabled={results.length === 0}
          onClick={() => {
            return handleClear();
          }}
        >
          Clear all
        </Button>
      </div>
    );
  }

  function renderDice() {
    const filteredDiceCommands: Array<DiceCommandsType> = [];

    if (category === "standard") {
      filteredDiceCommands.push("d4", "d6", "d8", "d10", "d12", "d20");
    } else if (category === "misc") {
      filteredDiceCommands.push("_4dF", "dF");
      filteredDiceCommands.push("coin");
    }

    return (
      <Box>
        <Flex
          direction="row"
          gap="3"
          wrap={"wrap"}
          justify={"center"}
          align={"center"}
        >
          {filteredDiceCommands.map((diceCommand) => {
            const Icon = DiceIcons[diceCommand];
            return (
              <Button
                key={diceCommand}
                size={"2"}
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
      <Flex gap="3" justify="end" className="absolute top-0 right-0">
        <Dialog.Close>
          <Button
            variant="ghost"
            color="gray"
            className="p-0"
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
