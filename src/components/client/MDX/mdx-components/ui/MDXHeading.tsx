import { Heading } from "@radix-ui/themes";
import { z } from "zod";
import { parseProps } from "../../../../../domains/utils/parseProps";

const propsSchema = z.object({
  children: z.any().optional(),
});

export type Props = z.input<typeof propsSchema>;

export function MDXHeading(p: Props) {
  const props = parseProps({
    props: p,
    schema: propsSchema,
    componentName: "MDXHeading",
  });

  return (
    <Heading data-mdx-type="heading" size={"8"} weight={"bold"}>
      {props.children}
    </Heading>
  );
}
