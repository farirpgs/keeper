import { Container, Flex, Text } from "@radix-ui/themes";
import { CircleOff } from "lucide-react";
import type { JSX } from "react";
import { MDXH1 } from "../MDX/MDX";

export function NothingToShowHere(props: {
  title?: JSX.Element | string;
  description: JSX.Element | string;
  icon?: true | undefined | React.ComponentType<any>;
}) {
  let Icon: React.ComponentType<any> | undefined;
  if (props.icon === true) {
    Icon = CircleOff;
  } else {
    Icon = props.icon;
  }

  return (
    <Container className="mx-auto max-w-[768px]">
      <div className="py-[10vh]">
        <Flex direction="column" gap="4" align="center">
          {Icon && <Icon size="20vh" className="mb-[2rem]"></Icon>}
          <MDXH1 as="h3" align={"center"}>
            {props.title}
          </MDXH1>
          <Text align={"center"}>{props.description}</Text>
        </Flex>
      </div>
    </Container>
  );
}
