import { Text } from "@radix-ui/themes";
import clsx from "clsx";
import { z } from "zod";
import { parseProps } from "../../../../../domains/utils/parseProps";

const propsSchema = z.object({
  fullWidth: z.boolean().optional(),
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
    <Text
      data-mdx-type="label"
      size={"5"}
      weight={"bold"}
      className={clsx("text-(--accent-11)", {
        "w-full": props.fullWidth,
      })}
    >
      {props.children}
    </Text>
  );
}
