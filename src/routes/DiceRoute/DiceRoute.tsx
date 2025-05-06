import { useEffect, useState } from "react";
import {
  diceCommandList,
  type DiceCommandsType,
} from "../../components/client/DiceRoller/DiceCommands";
import { DiceRoller } from "../../components/client/DiceRoller/DiceRoller";
import { UI } from "../../components/ui/ui";
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
    <UI.Container
      maxWidth={"600px"}
      onContextMenu={(e) => {
        // Prevent the context menu from opening when right-clicking around dice
        e.preventDefault();
      }}
    >
      <UI.Card className="p-0">
        <div className="flex flex-col gap-4 bg-(--gray-1)">
          <div className="px-6 pt-6">
            <UI.Heading>Dice Roller</UI.Heading>
          </div>
          <DiceRoller button={false} theme={themeProps} roll={toRoll} />
        </div>
      </UI.Card>
    </UI.Container>
  );
}
