import { z } from "zod";
import { UI } from "../../../../../components/ui/ui";
import { parseProps } from "../../../../../domains/utils/parseProps";

const propsSchema = z.object({
  children: z.any().optional(),
});

type Props = z.input<typeof propsSchema>;

export function MDXStack(p: Props) {
  const props = parseProps({
    props: p,
    schema: propsSchema,
    componentName: "MDXStack",
  });

  return (
    <UI.Flex data-mdx-type="stack" direction="column" gap="4">
      {props.children}
    </UI.Flex>
  );
}
