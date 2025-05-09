import clsx from "clsx";
import { useEffect, useState } from "react";
import { UI } from "../../../components/ui/ui";
import { DLStorage } from "../../../domains/dl/DLStorage";
import { wait } from "../../../domains/utils/wait";

export function CreateNewCampaignButton(props: { gameId: string }) {
  const [ready, setReady] = useState(true);
  const [adding, setAdding] = useState(false);

  useEffect(function initializeButton() {
    main();

    async function main() {
      await wait();
      setReady(true);
    }
  }, []);

  async function handleClick() {
    setAdding(true);
    await wait();
    const id = DLStorage.addCampaign({
      slug: props.gameId,
    });

    location.href = `/play/${props.gameId}?id=${id}`;

    setAdding(false);
  }

  return (
    <UI.Button
      size="4"
      className={clsx("font-bold", "transition-all")}
      variant="solid"
      disabled={!ready || adding}
      onClick={handleClick}
      loading={adding}
    >
      Start a new campaign
    </UI.Button>
  );
}
