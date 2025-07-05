import { useState } from "react";
import { z } from "zod";
import {
  CampaignState,
  useCampaignManager,
} from "../../../../../domains/campaign/useCampaign";
import { parseProps } from "../../../../../domains/utils/parseProps";
import { UI } from "../../../../ui/ui";
import { MDXDetail } from "../ui/MDXDetail";
import { useName } from "./MDXList";

const propsSchema = z.object({
  name: z.string(),
  min: z.number().optional(),
  max: z.number().optional(),
  placeholder: z.string().optional().default("0"),
  children: z.any().optional(),
});

type Props = z.input<typeof propsSchema>;

export function MDXNumberField(p: Props) {
  const props = parseProps({
    props: p,
    schema: propsSchema,
    componentName: "MDXNumberField",
  });
  const name = useName({ name: props.name });

  const campaignManager = useCampaignManager();
  const [value, setValue] = useState(() => {
    return campaignManager.getCurrentFormValue({ name: name }) || "";
  });

  return (
    <div className="flex w-full flex-col gap-1" data-mdx-type="number-field">
      {props.children && (
        <div className="flex">
          <MDXDetail>{props.children}</MDXDetail>
        </div>
      )}
      <UI.TextField.Root
        size="3"
        color="gray"
        variant="soft"
        name={name}
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
        placeholder={props.placeholder}
        className="w-full text-center text-[1.25rem] [&>input]:indent-0 [&>input]:font-semibold"
      ></UI.TextField.Root>

      <CampaignState name={name} value={value}></CampaignState>
    </div>
  );
}
