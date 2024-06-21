import { Text } from "@radix-ui/themes";
import clsx from "clsx";
import { z } from "zod";
import { parseProps } from "../../../../../domains/utils/parseProps";
import { TEXT_CLASSES } from "../../MDX";

const propsSchema = z.object({
  children: z.any().optional(),
});

export type Props = z.infer<typeof propsSchema>;

export function MDXDetail(p: Props) {
  const props = parseProps({
    props: p,
    schema: propsSchema,
    componentName: "MDXDetail",
  });

  return (
    <Text as="span" color="gray" className={clsx("w-full", TEXT_CLASSES)}>
      {props.children}
    </Text>
  );
}