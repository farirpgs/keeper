import clsx from "clsx";
import { z } from "zod";
import { UI } from "../../../../../components/ui/ui";
import { parseProps } from "../../../../../domains/utils/parseProps";
import { TEXT_CLASSES } from "../../MDX";

const propsSchema = z.object({
  children: z.any().optional(),
  fullWidth: z.boolean().optional(),
});

type Props = z.input<typeof propsSchema>;

export function MDXDetail(p: Props) {
  const props = parseProps({
    props: p,
    schema: propsSchema,
    componentName: "MDXDetail",
  });

  return (
    <UI.Text
      as="span"
      color="gray"
      className={clsx(
        {
          "w-full": props.fullWidth,
          "[&>p]:m-0": true,
        },
        TEXT_CLASSES,
      )}
    >
      {props.children}
    </UI.Text>
  );
}
