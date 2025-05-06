import { z } from "zod";
import { parseProps } from "../../../../../domains/utils/parseProps";
import { UI } from "../../../../ui/ui";

const propsSchema = z.object({
  children: z.any().optional(),
  align: z
    .enum(["start", "center", "end", "baseline", "stretch"])
    .optional()
    .default("center"),
});

type Props = z.input<typeof propsSchema>;

export function MDXRow(p: Props) {
  const props = parseProps({
    props: p,
    schema: propsSchema,
    componentName: "MDXRow",
  });

  return (
    <UI.Flex data-mdx-type="row" gap="4" width={"100%"} align={props.align}>
      {props.children}
    </UI.Flex>
  );
}
