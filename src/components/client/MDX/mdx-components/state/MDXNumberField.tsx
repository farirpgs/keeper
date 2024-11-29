import { Flex, TextField, Tooltip } from "@radix-ui/themes";
import { useContext, useState } from "react";
import { z } from "zod";
import {
  CampaignContext,
  CampaignState,
} from "../../../../../domains/campaign/useCampaign";
import { parseProps } from "../../../../../domains/utils/parseProps";
import { ConditionalWrapper } from "../../../ConditionalWrapper/ConditionalWrapper";
import { MDXDetail } from "../ui/MDXDetail";
import { useName } from "./MDXList";

const propsSchema = z.object({
  name: z.string(),
  min: z.number().optional(),
  max: z.number().optional(),
  children: z.any().optional(),
  tooltip: z.string().optional(),
});

type Props = z.input<typeof propsSchema>;

export function MDXNumberField(p: Props) {
  const props = parseProps({
    props: p,
    schema: propsSchema,
    componentName: "MDXNumberField",
  });
  const name = useName({ name: props.name });

  const campaignManager = useContext(CampaignContext);
  const [value, setValue] = useState(() => {
    return campaignManager.getCurrentFormValue({ name: name }) || "";
  });

  return (
    <Flex
      gap="1"
      direction={"column"}
      className="w-full"
      data-mdx-type="number-field"
    >
      <ConditionalWrapper
        wrapWhen={!!props.tooltip}
        wrapper={(children) => (
          <Tooltip content={props.tooltip}>{children}</Tooltip>
        )}
      >
        {props.children && (
          <Flex>
            <MDXDetail>{props.children}</MDXDetail>
          </Flex>
        )}
        <TextField.Root
          size="3"
          color="gray"
          variant="soft"
          value={value}
          disabled={campaignManager.readonly}
          onChange={(e) => {
            if (campaignManager.readonly) {
              return;
            }
            return setValue(e.target.value);
          }}
          autoComplete="off"
          type="number"
          min={props.min}
          max={props.max}
          placeholder="0"
          className="w-full text-center text-[1.25rem] [&>input]:indent-0 [&>input]:font-semibold"
        ></TextField.Root>
      </ConditionalWrapper>

      <CampaignState name={name} value={value}></CampaignState>
    </Flex>
  );
}
