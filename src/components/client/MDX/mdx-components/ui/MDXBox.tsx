import { z } from "zod";
import { UI } from "../../../../../components/ui/ui";
import { parseProps } from "../../../../../domains/utils/parseProps";

const propsSchema = z.object({
  children: z.any().optional(),
});

type Props = z.input<typeof propsSchema>;

export function MDXBox(p: Props) {
  const props = parseProps({
    props: p,
    schema: propsSchema,
    componentName: "MDXBox",
  });

  return <UI.Box data-mdx-type="box">{props.children}</UI.Box>;
}
