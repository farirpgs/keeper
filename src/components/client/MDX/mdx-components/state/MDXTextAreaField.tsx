import { useContext, useState } from "react";
import { z } from "zod";
import {
  CampaignContext,
  CampaignState,
} from "../../../../../domains/campaign/useCampaign";
import { UI } from "../../../../ui/ui";
import { ConditionalWrapper } from "../../../ConditionalWrapper/ConditionalWrapper";
import { MDXDetail } from "../ui/MDXDetail";
import { useName } from "./MDXList";
import { getDefaultPlaceholder } from "./MDXTextField";

const propsSchema = z.object({
  name: z.string(),
  placeholder: z.string().optional(),
  rows: z.number().optional().default(3),
  children: z.any().optional(),
  tooltip: z.string().optional(),
});

type Props = z.input<typeof propsSchema>;

export function MDXTextAreaField(p: Props) {
  const props = propsSchema.parse(p);
  const name = useName({ name: props.name });
  const campaignManager = useContext(CampaignContext);
  const [value, setValue] = useState(() => {
    return campaignManager.getCurrentFormValue({ name: name }) || "";
  });

  return (
    <UI.Flex
      data-mdx-type="text-area-field"
      gap="1"
      direction={"column"}
      className="w-full"
    >
      <ConditionalWrapper
        wrapWhen={!!props.tooltip}
        wrapper={(children) => (
          <UI.Tooltip content={props.tooltip}>{children}</UI.Tooltip>
        )}
      >
        {props.children && (
          <UI.Flex>
            <MDXDetail>{props.children}</MDXDetail>
          </UI.Flex>
        )}

        <UI.TextArea
          size="3"
          variant="soft"
          color="gray"
          rows={props.rows}
          autoComplete="off"
          resize="vertical"
          value={value}
          disabled={campaignManager.readonly}
          placeholder={getDefaultPlaceholder({
            children: props.children,
            placeholder: props.placeholder,
          })}
          onChange={(e) => {
            if (campaignManager.readonly) {
              return;
            }
            return setValue(e.target.value);
          }}
        />
      </ConditionalWrapper>

      <CampaignState name={name} value={value}></CampaignState>
    </UI.Flex>
  );
}
