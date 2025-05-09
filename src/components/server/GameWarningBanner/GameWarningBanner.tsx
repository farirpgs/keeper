import { InfoCircledIcon } from "@radix-ui/react-icons";
import { UI } from "../../ui/ui";

export function GameWarningBanner() {
  return (
    <>
      <UI.Callout.Root color="yellow">
        <UI.Callout.Icon>
          <InfoCircledIcon />
        </UI.Callout.Icon>
        <UI.Callout.Text>
          Games, campaigns and the character keeper are currently alpha
          features. Please report any bugs or issues here on{" "}
          <UI.Link href="https://link.farirpgs.com/discord">Discord</UI.Link>.
        </UI.Callout.Text>
      </UI.Callout.Root>
    </>
  );
}
