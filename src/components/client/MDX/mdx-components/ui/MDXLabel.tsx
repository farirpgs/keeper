import { UI } from "../../../../../components/ui/ui";
import { z } from "zod";
import { parseProps } from "../../../../../domains/utils/parseProps";

const propsSchema = z.object({
  children: z.any().optional(),
});

type Props = z.input<typeof propsSchema>;

export function MDXLabel(p: Props) {
  const props = parseProps({
    props: p,
    schema: propsSchema,
    componentName: "MDXLabel",
  });

  return (
    <UI.Text data-mdx-type="label" as="label">
      {props.children}
    </UI.Text>
  );
}
