import { z } from "zod";
import { parseProps } from "../../../../../domains/utils/parseProps";

const propsSchema = z.object({
  cols: z.number().default(2),
  children: z.any().optional(),
});

type Props = z.input<typeof propsSchema>;

export function MDXColumns(p: Props) {
  const props = parseProps({
    props: p,
    schema: propsSchema,
    componentName: "MDXColumns",
  });

  return (
    <div
      data-mdx-type="columns"
      className={`grid grid-cols-1 md:grid-cols-${props.cols} w-auto gap-4`}
    >
      {props.children}
    </div>
  );
}
