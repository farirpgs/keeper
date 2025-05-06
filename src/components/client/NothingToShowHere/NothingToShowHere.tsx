import { UI } from "../../ui/ui";
import { CircleOff } from "lucide-react";
import type { JSX } from "react";
import { MDXH1 } from "../MDX/MDX";

export function NothingToShowHere(props: {
  title?: JSX.Element | string;
  description: JSX.Element | string;
  icon?: true | undefined | React.ComponentType<any>;
}) {
  return (
    <UI.Container size="2">
      <UI.Flex direction="column" gap="4" align="center">
        {props.icon === true ? (
          <CircleOff className="h-12 w-12" />
        ) : props.icon ? (
          <props.icon className="h-12 w-12" />
        ) : null}
        {props.title && <MDXH1>{props.title}</MDXH1>}
        <UI.Text>{props.description}</UI.Text>
      </UI.Flex>
    </UI.Container>
  );
}
