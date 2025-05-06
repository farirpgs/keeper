import clsx from "clsx";
import { CircleOff, XIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { ThemeType } from "../../../domains/utils/getTheme";
import { UI } from "../../ui/ui";
import { DiceCommands, type DiceCommandsType } from "./DiceCommands";
import { DiceIcons } from "./DiceIcons";

export function DiceRoller(props: {
  theme?: ThemeType;
  button?: boolean;
  children?: React.ReactNode;
  roll?: Array<DiceCommandsType>;
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

  useEffect(() => {
    if (props.roll && props.roll.length > 0) {
      const toRoll = props.roll;
      setAnimatedResultIndexes((prev) => {
        return [...prev, ...toRoll.map((_, i) => i)];
      });
      setResults((prev) => {
        return [
          ...prev,
          ...toRoll.map((roll, i) => {
            return {
              value: DiceCommands[roll].roll(),
              command: roll,
            };
          }),
        ];
      });
    }
  }, [props.roll]);

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
    setAnimatedResultIndexes((prev) => {
      return [...prev, results.length];
    });
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

  function handleReroll(index: number) {
    setAnimatedResultIndexes((prev) => {
      return [...prev, index];
    });

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

  function handleSelect(index: number) {
    setSelectedResultIndexes((prev) => {
      if (prev.includes(index)) {
        return prev.filter((i) => i !== index);
      } else {
        return [...prev, index];
      }
    });
  }

  function handleRerollAll() {
    setAnimatedResultIndexes((prev) => {
      return [...prev, ...results.map((_, i) => i)];
    });
    setResults((prev) => {
      return prev.map((result, i) => {
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
    setAnimatedResultIndexes([]);
  }

  function handleCloseModal() {
    setResults([]);
    setSelectedResultIndexes([]);
    setOpen(false);
  }

  function handleOnAnimationFinish(index: number) {
    setAnimatedResultIndexes((prev) => {
      return prev.filter((i) => i !== index);
    });
  }

  return (
    <UI.Theme {...props.theme} hasBackground={false} asChild>
      <div className="min-h-auto">
        {renderButton ? (
          <div>
            <UI.Dialog.Root
              open={open}
              onOpenChange={(isOpen) => {
                if (!isOpen) {
                  handleCloseModal();
                }
              }}
            >
              <UI.Tooltip content="Dice Roller">
                <UI.Dialog.Trigger
                  onClick={() => {
                    return setOpen(true);
                  }}
                >
                  {props.children}
                </UI.Dialog.Trigger>
              </UI.Tooltip>

              <UI.Dialog.Content size={"4"} className="bg-(--gray-1) p-0">
                <div className="px-6 pt-6 pb-4">
                  <UI.Dialog.Title className="relative m-0">
                    <UI.Heading size="7" className="m-0">
                      Dice Roller
                    </UI.Heading>
                    {renderCloseButton()}
                  </UI.Dialog.Title>
                  <UI.Dialog.Description size="2" mb="4" className="hidden">
                    Click on a dice to roll it.
                  </UI.Dialog.Description>
                </div>
                <div>{renderDialogContent()}</div>
              </UI.Dialog.Content>
            </UI.Dialog.Root>
          </div>
        ) : (
          <div>{renderDialogContent()}</div>
        )}
      </div>
    </UI.Theme>
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
            <UI.SegmentedControl.Root
              value={category}
              onValueChange={(value) => {
                return handleCategoryChange({ value: value as CategoryType });
              }}
              className="w-full"
            >
              {categories.map((cat) => {
                return (
                  <UI.SegmentedControl.Item
                    key={cat}
                    value={cat}
                    className="cursor-auto"
                  >
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </UI.SegmentedControl.Item>
                );
              })}
            </UI.SegmentedControl.Root>
          </div>
          <div className="px-6">{renderDice()}</div>
        </div>
        <div className="flex w-full flex-col gap-4 rounded-sm bg-white p-6 dark:bg-black">
          <UI.Heading size="5" className="">
            Result
          </UI.Heading>
          <div className="flex min-h-[180px] items-center justify-center bg-(--gray-1) p-3">
            <div className="flex flex-col items-center justify-center gap-4">
              {renderResults()}
              {renderResultsText()}
            </div>
          </div>
          <div className="flex flex-col items-center justify-center">
            <div className="w-full">{renderResultsStats()}</div>
          </div>
          <div className="mt-2 w-full">{renderResultActions()}</div>
        </div>
      </div>
    );
  }

  function renderResults() {
    return (
      <UI.Flex direction="row" gap="2" wrap={"wrap"} justify={"center"}>
        {results.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-2 text-center">
            <UI.Text color="gray" className="">
              <CircleOff size="4rem" className=""></CircleOff>
            </UI.Text>
            <UI.Text color="gray" className="" size="3">
              Click on a dice to roll it.
            </UI.Text>
          </div>
        )}
        {results.map((result, index) => {
          const Icon = DiceIcons[result.command];
          const selected = selectedResultIndexes.includes(index);
          return (
            <UI.Button
              key={index}
              size="3"
              className="flex h-auto flex-col items-center justify-center gap-2 p-4 font-mono"
              variant={selected ? "classic" : "surface"}
              onClick={() => {
                handleReroll(index);
              }}
              onContextMenu={(e) => {
                e.preventDefault();
                handleSelect(index);
              }}
            >
              <UI.Text>
                <AnimatedResult
                  watch={result}
                  result={result.value}
                  animate={true}
                  onAnimationFinish={() => {
                    handleOnAnimationFinish(index);
                  }}
                ></AnimatedResult>
              </UI.Text>
              <div>
                <Icon className="h-auto w-6"></Icon>
              </div>
            </UI.Button>
          );
        })}
      </UI.Flex>
    );
  }

  function renderResultsText() {
    if (results.length === 0) {
      return null;
    }

    return (
      <div className="flex w-full flex-col justify-center">
        <UI.Text
          color="gray"
          size={"1"}
          className="text-center text-(--accent-11)"
        >
          Click on a card to reroll it.
          <br />
          Right click on a card to highlight it.
        </UI.Text>
      </div>
    );
  }

  function renderResultsStats() {
    return (
      <div className="flex w-full justify-center gap-2">
        <UI.Badge
          size="2"
          className={clsx("block flex-grow bg-(--gray-1) p-3 text-center", {})}
          color={selectedResultIndexes.length > 0 ? undefined : "gray"}
          variant={selectedResultIndexes.length > 0 ? "soft" : "soft"}
        >
          <div>
            <UI.Text size="2">Total</UI.Text>
          </div>
          <div>
            <UI.Text size="3" weight={"bold"}>
              {isAnimating || totalResult === -Infinity ? "-" : totalResult}
            </UI.Text>
          </div>
        </UI.Badge>
        <UI.Badge
          size="2"
          className={clsx("block flex-grow bg-(--gray-1) p-3 text-center", {})}
          color={selectedResultIndexes.length > 0 ? undefined : "gray"}
          variant={selectedResultIndexes.length > 0 ? "soft" : "soft"}
        >
          <div>
            <UI.Text size="2">Highest</UI.Text>
          </div>
          <div>
            <UI.Text size="3" weight={"bold"}>
              {isAnimating || highestResult === -Infinity ? "-" : highestResult}
            </UI.Text>
          </div>
        </UI.Badge>
        <UI.Badge
          size="2"
          className={clsx("block flex-grow bg-(--gray-1) p-3 text-center", {})}
          color={selectedResultIndexes.length > 0 ? undefined : "gray"}
          variant={selectedResultIndexes.length > 0 ? "soft" : "soft"}
        >
          <div>
            <UI.Text size="2">Lowest</UI.Text>
          </div>
          <div>
            <UI.Text size="3" weight={"bold"}>
              {isAnimating || lowestResult === Infinity ? "-" : lowestResult}
            </UI.Text>
          </div>
        </UI.Badge>
      </div>
    );
  }

  function renderResultActions() {
    return (
      <div className="flex flex-row justify-center gap-2">
        <UI.Button
          variant="solid"
          size="3"
          disabled={results.length === 0}
          onClick={() => {
            handleRerollAll();
          }}
        >
          Reroll all
        </UI.Button>
        <UI.Button
          variant="outline"
          size="3"
          disabled={results.length === 0}
          onClick={() => {
            return handleClear();
          }}
        >
          Clear all
        </UI.Button>
      </div>
    );
  }

  function renderDice() {
    const filteredDiceCommands: Array<DiceCommandsType> = [];

    if (category === "standard") {
      filteredDiceCommands.push("d4", "d6", "d8", "d10", "d12", "d20");
    } else if (category === "misc") {
      filteredDiceCommands.push("4dF", "dF");
      filteredDiceCommands.push("d100");
      filteredDiceCommands.push("coin");
    }

    return (
      <UI.Box>
        <UI.Flex
          direction="row"
          gap="3"
          wrap={"wrap"}
          justify={"center"}
          align={"center"}
        >
          {filteredDiceCommands.map((diceCommand) => {
            const Icon = DiceIcons[diceCommand];
            return (
              <UI.Button
                key={diceCommand}
                size={"2"}
                variant="soft"
                className="h-auto py-3"
                onClick={() => handleDiceClick(diceCommand)}
              >
                <UI.Flex direction="column" gap="2" align="center">
                  <Icon className="h-auto w-8"></Icon>
                  <UI.Text size="2">{DiceCommands[diceCommand].label}</UI.Text>
                </UI.Flex>
              </UI.Button>
            );
          })}
        </UI.Flex>
      </UI.Box>
    );
  }

  function renderCloseButton() {
    return (
      <UI.Flex gap="3" justify="end" className="absolute top-0 right-0">
        <UI.Dialog.Close>
          <UI.Button
            variant="ghost"
            color="gray"
            className="p-0"
            onClick={() => {
              handleCloseModal();
            }}
          >
            <XIcon></XIcon>
          </UI.Button>
        </UI.Dialog.Close>
      </UI.Flex>
    );
  }
}

function AnimatedResult(props: {
  watch: any;
  result: string;
  animate: boolean;
  possibleResults?: Array<string>;
  onAnimationFinish?(): void;
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
  const [animating, setAnimating] = useState(true);
  const defaultResult = props.animate ? possibleResults[0] : props.result;
  const [visibleResult, setVisibleResult] = useState(defaultResult);
  const loadingIndexRef = useRef(0);

  useEffect(() => {
    let timeout: any;
    let count = 0;

    function animate() {
      setAnimating(true);
      timeout = setTimeout(() => {
        if (count >= 15) {
          setVisibleResult(props.result);
          setAnimating(false);
          props.onAnimationFinish?.();
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
