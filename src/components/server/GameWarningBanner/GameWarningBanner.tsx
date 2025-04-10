import { InfoCircledIcon } from "@radix-ui/react-icons";
import { Callout, Link } from "@radix-ui/themes";

export function GameWarningBanner() {
  return (
    <>
      <Callout.Root color="yellow">
        <Callout.Icon>
          <InfoCircledIcon />
        </Callout.Icon>
        <Callout.Text>
          Games, campaigns and the character keeper are currently alpha
          features. Please report any bugs or issues here on{" "}
          <Link href="https://link.farirpgs.com/discord">Discord</Link>.
        </Callout.Text>
      </Callout.Root>
    </>
  );
}
