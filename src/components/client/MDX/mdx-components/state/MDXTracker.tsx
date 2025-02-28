import { CircleIcon, MinusIcon, PlusIcon } from "@radix-ui/react-icons";
import { Box, Flex, IconButton, Text } from "@radix-ui/themes";
import clsx from "clsx";
import { CircleCheckBig } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { z } from "zod";
import {
  CampaignContext,
  CampaignState,
} from "../../../../../domains/campaign/useCampaign";
import { parseProps } from "../../../../../domains/utils/parseProps";
import { useName } from "./MDXList";

const propsSchema = z.object({
  name: z.string(),
  min: z.number().optional().default(1),
  max: z.number().optional(),
  asClock: z.boolean().optional(),
  children: z.any().optional(),
});

type Props = z.input<typeof propsSchema>;

export function MDXTracker(p: Props) {
  const props = parseProps({
    props: p,
    schema: propsSchema,
    componentName: "MDXTracker",
  });
  const name = useName({ name: props.name });
  const campaignManager = useContext(CampaignContext);
  const [values, setValues] = useState<Array<boolean>>(() => {
    return campaignManager.getCurrentFormValue({ name: name }) || [];
  });

  const canAddItem = props.max ? values.length < props.max : true;
  const canRemoveItem = values.length > props.min;

  useEffect(() => {
    const numberOfMissingItems =
      values.length < props.min ? props.min - values.length : 0;

    for (const _i of Array(numberOfMissingItems).keys()) {
      setValues((prev) => {
        return [...prev, false];
      });
    }
  }, []);

  function handleAddItem() {
    if (canAddItem) {
      setValues((prev) => {
        return [...prev, false];
      });
    }
  }

  function handleRemoveItem() {
    if (canRemoveItem) {
      setValues((prev) => {
        return prev.slice(0, prev.length - 1);
      });
    }
  }

  return (
    <Text data-mdx-type="text-field" as="label" size="2">
      <Flex gap="2" align={"center"}>
        <IconButton
          size="1"
          variant="ghost"
          color="gray"
          disabled={!canRemoveItem || campaignManager.readonly}
          onClick={handleRemoveItem}
        >
          <MinusIcon></MinusIcon>
        </IconButton>
        {values.map((value, i) => {
          return (
            <Box key={i}>
              <IconButton
                radius="full"
                color="gray"
                name={name + i.toString()}
                variant={value ? "soft" : "soft"}
                className={clsx(
                  {
                    "bg-(--accent-7)": value,
                    "bg-(--accent-4)": !value,
                  },
                  "hover:bg-(--accent-5)",
                )}
                key={i}
                disabled={campaignManager.readonly}
                onClick={(e) => {
                  if (campaignManager.readonly) {
                    return;
                  }

                  setValues((prev) => {
                    const copy = [...prev];
                    copy[i] = !copy[i];
                    return copy;
                  });
                }}
              >
                {value ? (
                  <CircleCheckBig
                    width={"1.5rem"}
                    height={"1.5rem"}
                  ></CircleCheckBig>
                ) : (
                  <CircleIcon width={"1.5rem"} height={"1.5rem"} />
                )}
              </IconButton>
            </Box>
          );
        })}
        <IconButton
          size="1"
          variant="ghost"
          color="gray"
          disabled={!canAddItem || campaignManager.readonly}
          onClick={handleAddItem}
        >
          <PlusIcon></PlusIcon>
        </IconButton>
      </Flex>

      <CampaignState name={name} value={values}></CampaignState>
    </Text>
  );
}
