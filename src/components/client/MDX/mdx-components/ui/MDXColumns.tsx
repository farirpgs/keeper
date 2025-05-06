import { z } from "zod";
import { UI } from "../../../../../components/ui/ui";
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
    <UI.Grid
      data-mdx-type="columns"
      columns={{ initial: "1", md: props.cols.toString() }}
      gap="4"
      width="auto"
    >
      {props.children}
    </UI.Grid>
  );
}
