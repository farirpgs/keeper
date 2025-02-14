import { Separator } from "@radix-ui/themes";
import { z } from "zod";
import { parseProps } from "../../../../../domains/utils/parseProps";

const propsSchema = z.object({});

type Props = z.input<typeof propsSchema>;

export function MDXDivider(p: Props) {
  const props = parseProps({
    props: p,
    schema: propsSchema,
    componentName: "MDXDivider",
  });

  return (
    <Separator data-mdx-type="divider" size="4" className="my-4"></Separator>
  );
}
