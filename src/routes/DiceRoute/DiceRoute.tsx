import { Card, Container, Heading } from "@radix-ui/themes";
import { useEffect, useState } from "react";
import {
  diceCommandList,
  type DiceCommandsType,
} from "../../components/client/DiceRoller/DiceCommands";
import { DiceRoller } from "../../components/client/DiceRoller/DiceRoller";
import { getTheme } from "../../domains/utils/getTheme";

const themeProps = getTheme({});

export function DiceRoute() {
  const [toRoll, setToRoll] = useState<Array<DiceCommandsType>>([]);

  useEffect(() => {
    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.search);
    const dice = params.get("roll");

    if (dice) {
      const rolls = dice
        .split(",")
        .map((r) => r.trim())
        .filter((r) => {
          return diceCommandList.includes(r as DiceCommandsType);
        }) as Array<DiceCommandsType>;

      setToRoll(rolls);
    }
  }, []);

  return (
    <Container
      maxWidth={"600px"}
      onContextMenu={(e) => {
        // Prevent the context menu from opening when right-clicking around dice
        e.preventDefault();
      }}
    >
      <Card className="p-0">
        <div className="flex flex-col gap-4 bg-(--gray-1)">
          <div className="px-6 pt-6">
            <Heading>Dice Roller</Heading>
          </div>
          <DiceRoller button={false} theme={themeProps} roll={toRoll} />
        </div>
      </Card>
    </Container>
  );
}
