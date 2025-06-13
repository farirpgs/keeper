import { useState } from "react";
import { z } from "zod";
import {
  CampaignState,
  useCampaignManager,
} from "../../../../../domains/campaign/useCampaign";
import { ConditionalWrapper } from "../../../ConditionalWrapper/ConditionalWrapper";

import { UI } from "../../../../ui/ui";
import { MDXDetail } from "../ui/MDXDetail";
import { useName } from "./MDXList";

const propsSchema = z.object({
  name: z.string(),
  placeholder: z.string().optional(),
  defaultValue: z.string().optional(),
  options: z.array(z.string()),
  children: z.any().optional(),
  tooltip: z.string().optional(),
});

type Props = z.input<typeof propsSchema>;

export function MDXSelectField(p: Props) {
  const props = propsSchema.parse(p);
  const campaignManager = useCampaignManager();
  const name = useName({ name: props.name });
  const [value, setValue] = useState(() => {
    return campaignManager.getCurrentFormValue({ name: name }) || "";
  });

  return (
    <div className="flex w-full flex-col gap-1" data-mdx-type="select-field">
      <UI.Select.Root
        defaultValue={props.defaultValue}
        size="3"
        value={value}
        onValueChange={(newValue) => {
          if (campaignManager.readonly) {
            return;
          }
          return setValue(newValue);
        }}
      >
        <ConditionalWrapper
          wrapWhen={!!props.tooltip}
          wrapper={(children) => (
            <UI.Tooltip content={props.tooltip}>{children}</UI.Tooltip>
          )}
        >
          <>
            {props.children && (
              <div className="flex">
                <MDXDetail>{props.children}</MDXDetail>
              </div>
            )}
            <UI.Select.Trigger
              variant="soft"
              color="gray"
              placeholder={props.placeholder || "—"}
            ></UI.Select.Trigger>
          </>
        </ConditionalWrapper>

        <UI.Select.Content color="gray">
          {props.options.map((option) => (
            <UI.Select.Item key={option} value={option}>
              {option}
            </UI.Select.Item>
          ))}
        </UI.Select.Content>
      </UI.Select.Root>

      <CampaignState name={name} value={value}></CampaignState>
    </div>
  );
}
