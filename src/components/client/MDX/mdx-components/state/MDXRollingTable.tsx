import { Box, Card, Flex, IconButton, Text } from "@radix-ui/themes";
import clsx from "clsx";
import { Dices } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { z } from "zod";
import {
  CampaignContext,
  CampaignState,
} from "../../../../../domains/campaign/useCampaign";
import { wait } from "../../../../../domains/utils/wait";
import { MDXLabel } from "../ui/MDXLabel";
import { useName } from "./MDXList";

const propsSchema = z
  .object({
    name: z.string(),
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

export type Props = z.infer<typeof propsSchema>;

export function MDXRollingTable(p: Props) {
  const props = propsSchema.parse(p);
  const campaignManager = useContext(CampaignContext);
  const name = useName({
    name: props.name,
  });
  const [rolling, setRolling] = useState(false);
  const [rollHistory, setRollHistory] = useState<Array<string>>(() => {
    return campaignManager.getCurrentFormValue({ name: name }) || [];
  });

  async function handleRollOnTable() {
    setRolling(true);
    await wait(150);

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
    if (rollHistory.length > 3) {
      setRollHistory((prev) => prev.slice(0, 3));
    }
  }, [rollHistory]);

  // rollHistory, but add empty elements if dont match 3 elements

  const derp = [...rollHistory];

  const numberOfMissingItems = 3 - derp.length;
  if (numberOfMissingItems > 0) {
    for (let i = 0; i < numberOfMissingItems; i++) {
      derp.push("");
    }
  }

  return (
    <Box mdx-type="rolling-table">
      <Card>
        <Flex direction={"column"} gap="2">
          <Flex gap="2" align="center">
            <IconButton
              variant="outline"
              loading={rolling}
              onClick={() => {
                handleRollOnTable();
              }}
            >
              <Dices></Dices>
            </IconButton>
            <MDXLabel>{props.name}</MDXLabel>
          </Flex>
          {rollHistory.length > 0 && (
            <Box>
              {derp.map((item, index) => {
                const isLatest = index === 0;
                return (
                  <Text
                    as="div"
                    size="2"
                    key={index}
                    className={clsx(
                      isLatest && "font-bold text-[--accent-11]",
                      !isLatest && "text-[--gray-11]",
                    )}
                  >
                    {index + 1}
                    {". "}
                    {item}
                  </Text>
                );
              })}
            </Box>
          )}
        </Flex>
      </Card>
      <CampaignState name={name} value={rollHistory} />
    </Box>
  );
}