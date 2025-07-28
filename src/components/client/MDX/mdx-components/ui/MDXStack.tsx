import clsx from "clsx";
import { z } from "zod";
import { parseProps } from "../../../../../domains/utils/parseProps";

const propsSchema = z.object({
  children: z.any().optional(),
  className: z.string().optional(),
});

type Props = z.input<typeof propsSchema>;

export function MDXStack(p: Props) {
  const props = parseProps({
    props: p,
    schema: propsSchema,
    componentName: "MDXStack",
  });

  return (
    <div
      data-mdx-type="stack"
      className={clsx("flex flex-1 flex-col gap-4", props.className)}
    >
      {props.children}
    </div>
  );
}
