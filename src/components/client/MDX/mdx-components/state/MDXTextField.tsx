import { useState } from "react";
import { z } from "zod";
import {
  CampaignState,
  useCampaignManager,
} from "../../../../../domains/campaign/useCampaign";
import { UI } from "../../../../ui/ui";
import { MDXDetail } from "../ui/MDXDetail";
import { useName } from "./MDXList";

const propsSchema = z.object({
  name: z.string(),
  placeholder: z.string().optional().default(""),
  children: z.any().optional(),
});

type Props = z.input<typeof propsSchema>;

export function MDXTextField(p: Props) {
  const props = propsSchema.parse(p);
  const name = useName({ name: props.name });
  const campaignManager = useCampaignManager();
  const [value, setValue] = useState(() => {
    return campaignManager.getCurrentFormValue({ name: name }) || "";
  });

  return (
    <div className="flex w-full flex-col gap-1" data-mdx-type="text-field">
      {props.children && (
        <div className="flex">
          <MDXDetail>{props.children}</MDXDetail>
        </div>
      )}
      <UI.TextField.Root
        size="3"
        color="gray"
        name={name}
        variant="soft"
        value={value}
        placeholder={props.placeholder}
        disabled={campaignManager.readonly}
        onChange={(e) => {
          if (campaignManager.readonly) {
            return;
          }
          return setValue(e.target.value);
        }}
        autoComplete="off"
      />

      <CampaignState name={name} value={value}></CampaignState>
    </div>
  );
}
