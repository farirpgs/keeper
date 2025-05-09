import { z } from "zod";
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
    <div data-mdx-type="stack" className="flex flex-col gap-4">
      {props.children}
    </div>
  );
}
