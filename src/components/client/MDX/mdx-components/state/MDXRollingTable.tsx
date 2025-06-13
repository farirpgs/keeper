import clsx from "clsx";
import { Dices } from "lucide-react";
import { useEffect, useState } from "react";
import { z } from "zod";
import {
  CampaignState,
  useCampaignManager,
} from "../../../../../domains/campaign/useCampaign";
import { wait } from "../../../../../domains/utils/wait";
import { UI } from "../../../../ui/ui";
import { MDXLabel } from "../ui/MDXLabel";
import { useName } from "./MDXList";

const propsSchema = z
  .object({
    name: z.string(),
    label: z.string().optional(),
    items: z.array(z.string()).optional(),
    groups: z
      .array(z.object({ name: z.string(), items: z.array(z.string()) }))
      .optional(),
  })
  .refine((data) => {
    if (data.items && data.groups) {
      throw new Error("Cannot define both items and groups");
    }
    if (!data.items && !data.groups) {
      throw new Error("Must define either items or groups");
    }
    return true;
  });

type Props = z.input<typeof propsSchema>;

const MAX_HISTORY = 5;

export function MDXRollingTable(p: Props) {
  const props = propsSchema.parse(p);
  const campaignManager = useCampaignManager();
  const name = useName({
    name: props.name,
  });
  const [rolling, setRolling] = useState(false);
  const [rollHistory, setRollHistory] = useState<Array<string>>(() => {
    return campaignManager.getCurrentFormValue({ name: name }) || [];
  });

  async function handleRollOnTable() {
    setRolling(true);
    await wait(50);

    if (props.items) {
      const randomIndex = Math.floor(Math.random() * props.items.length);
      const randomItem = props.items[randomIndex];
      setRollHistory((prev) => {
        return [randomItem, ...prev];
      });
    } else if (props.groups) {
      const newValue: Array<string> = [];
      for (const group of props.groups) {
        const randomIndex = Math.floor(Math.random() * group.items.length);
        const randomItem = group.items[randomIndex];
        newValue.push(randomItem);
      }
      setRollHistory((prev) => {
        return [newValue.join(" — "), ...prev];
      });
    } else {
      throw new Error("Invalid state");
    }

    setRolling(false);
  }

  useEffect(() => {
    if (rollHistory.length > MAX_HISTORY) {
      setRollHistory((prev) => prev.slice(0, MAX_HISTORY));
    }
  }, [rollHistory]);

  const maxRollHistory = [...rollHistory];

  const numberOfMissingItems = MAX_HISTORY - maxRollHistory.length;
  if (numberOfMissingItems > 0) {
    for (let i = 0; i < numberOfMissingItems; i++) {
      maxRollHistory.push("");
    }
  }

  return (
    <div mdx-type="rolling-table">
      <UI.Card>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <UI.IconButton
              variant="outline"
              loading={rolling}
              onClick={() => {
                handleRollOnTable();
              }}
            >
              <Dices></Dices>
            </UI.IconButton>
            <MDXLabel>{props.label || props.name}</MDXLabel>{" "}
          </div>
          {rollHistory.length > 0 && (
            <div>
              {maxRollHistory.map((item, index) => {
                const isLatest = index === 0;
                return (
                  <UI.Text
                    as="div"
                    size="2"
                    key={index}
                    className={clsx(
                      isLatest && "font-bold text-(--accent-11)",
                      !isLatest && "text-([)--gray-9)",
                    )}
                  >
                    {index + 1}
                    {". "}
                    {item}
                  </UI.Text>
                );
              })}
            </div>
          )}
          {rollHistory.length === 0 && (
            <UI.Text size="1">Click on the dice to roll on the table</UI.Text>
          )}
        </div>
      </UI.Card>
      <CampaignState name={name} value={rollHistory} />
    </div>
  );
}
