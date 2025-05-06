import { useContext, useState } from "react";
import { z } from "zod";
import {
  CampaignContext,
  CampaignState,
} from "../../../../../domains/campaign/useCampaign";
import { parseProps } from "../../../../../domains/utils/parseProps";
import { UI } from "../../../../ui/ui";
import { useName } from "../state/MDXList";

const propsSchema = z.object({
  name: z.string(),
  defaultValue: z.boolean().default(false),
  children: z.any().optional(),
});

type Props = z.input<typeof propsSchema>;

export function MDXCheckboxField(p: Props) {
  const props = parseProps({
    props: p,
    schema: propsSchema,
    componentName: "MDXCheckboxField",
  });
  const name = useName({ name: props.name });

  const campaignManager = useContext(CampaignContext);
  const [value, setValue] = useState<boolean>(() => {
    return (
      campaignManager.getCurrentFormValue({ name: name }) || props.defaultValue
    );
  });

  return (
    <UI.Text data-mdx-type="text-field" as="label" size="2">
      <div className="flex gap-2">
        <UI.Flex gap={2}>
          <UI.Checkbox
            name={name}
            size="3"
            checked={value}
            onClick={(e) => {
              if (campaignManager.readonly) {
                return;
              }
              return setValue((prev) => !prev);
            }}
          />

          {props.children && (
            <span
              onClick={() => {
                if (campaignManager.readonly) {
                  return;
                }
                return setValue((prev) => !prev);
              }}
            >
              {props.children}
            </span>
          )}
        </UI.Flex>

        <CampaignState value={value} name={name} />
      </div>
    </UI.Text>
  );
}
