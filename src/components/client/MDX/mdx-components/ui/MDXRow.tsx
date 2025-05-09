import { z } from "zod";
import { parseProps } from "../../../../../domains/utils/parseProps";

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

  const alignClass = `items-${props.align}`;
  return (
    <div data-mdx-type="row" className={`flex w-full gap-4 ${alignClass}`}>
      {props.children}
    </div>
  );
}
