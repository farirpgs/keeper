import { z } from "zod";
import { parseProps } from "../../../../../domains/utils/parseProps";

const propsSchema = z.object({
  children: z.any().optional(),
});

type Props = z.input<typeof propsSchema>;

export function MDXHeading(p: Props) {
  const props = parseProps({
    props: p,
    schema: propsSchema,
    componentName: "MDXHeading",
  });

  return (
    <span data-mdx-type="heading" className="text-2xl font-bold">
      {props.children}
    </span>
  );
}
