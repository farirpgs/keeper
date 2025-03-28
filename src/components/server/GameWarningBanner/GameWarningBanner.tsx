import { InfoCircledIcon } from "@radix-ui/react-icons";
import { Callout } from "@radix-ui/themes";

export function GameWarningBanner() {
  return (
    <>
      <Callout.Root color="yellow">
        <Callout.Icon>
          <InfoCircledIcon />
        </Callout.Icon>
        <Callout.Text>
          Games, campaigns and the character keeper are currently alpha
          features. Use at your own risks!
        </Callout.Text>
      </Callout.Root>
    </>
  );
}
