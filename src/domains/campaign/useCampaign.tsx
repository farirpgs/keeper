import isEqual from "lodash/isEqual";
import { createContext, useEffect, useRef, useState } from "react";
import { UI } from "../../components/ui/ui";
import { DLStorage, schemas, type CampaignType } from "../dl/DLStorage";
import { getLogger } from "../utils/getLogger";

const logger = getLogger("useGameState");

export const CampaignContext = createContext<ReturnType<typeof useCampaign>>(
  undefined as any,
);

const debug = false;
const AUTO_SAVE_INTERVAL = 2000;
const AUTO_CHECK_DIRTY_INTERVAL = 500;

export function useCampaign(props: {
  id: string;
  readonly?: boolean;

  onLoadCampaign?: (campaign: CampaignType) => void;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [campaign, setCampaign] = useState<CampaignType>();
  const [dirty, setDirty] = useState(false);
  const [selectedAssetId, setSelectedAssetId] = useState<string>();

  useEffect(() => {
    const interval = setInterval(() => {
      const { isDirty } = getIsDirty();
      setDirty(isDirty);
    }, AUTO_CHECK_DIRTY_INTERVAL);
    return () => {
      clearInterval(interval);
    };
  }, [campaign, selectedAssetId]);

  useEffect(() => {
    const interval = setInterval(() => {
      saveForm();
    }, AUTO_SAVE_INTERVAL);
    return () => {
      clearInterval(interval);
    };
  }, [campaign, selectedAssetId]);

  useEffect(() => {
    main();
    async function main() {
      if (!props.id) {
        return;
      }
      try {
        logger.log("Loading campaign");
        const campaign = DLStorage.getCampaign({ campaignId: props.id });

        const firstAssetId = Object.keys(campaign.assets)[0];
        setSelectedAssetId(firstAssetId);
        logger.log("Setting campaign state");
        setCampaign(campaign);
        props.onLoadCampaign?.(campaign);
      } catch (error) {
        logger.error("Failed to campaign", { error });
      }
    }
  }, [props.id]);

  function getIsDirty() {
    if (!campaign) {
      return {
        isDirty: false,
      } as const;
    }
    const storedCampaign = DLStorage.getCampaign({ campaignId: props.id });
    const draft = structuredClone(campaign);

    // update assets
    if (selectedAssetId) {
      draft.assets[selectedAssetId].state = getCurrentFormState();
    }

    const isDirty = !isEqual(storedCampaign, draft);

    return {
      isDirty,
      currentCampaign: storedCampaign,
      draftCampaign: draft,
    } as const;
  }

  function addAsset(p: { slug: string }) {
    const assetId = crypto.randomUUID();
    setCampaign((prev) => {
      const draft = structuredClone(prev!);

      draft.assets[assetId] = schemas.assetSchema.parse({
        slug: p.slug,
      });

      return draft;
    });
    setSelectedAssetId(assetId);
  }

  function removeAsset(p: { id: string }) {
    setCampaign((prev) => {
      const draft = structuredClone(prev!);
      delete draft.assets[p.id];
      return draft;
    });
    if (selectedAssetId === p.id) {
      setSelectedAssetId(undefined);
    }
  }

  function moveAssetUp(p: { id: string }) {
    setCampaign((prev) => {
      const draft = structuredClone(prev!);
      draft.assets = {};

      const keys = Object.keys(prev!.assets);
      const fromIndex = keys.indexOf(p.id);
      const toIndex = fromIndex - 1 <= 0 ? 0 : fromIndex - 1;
      const element = keys[fromIndex];
      keys.splice(fromIndex, 1);
      keys.splice(toIndex, 0, element);

      for (const key of keys) {
        draft.assets[key] = prev!.assets[key];
      }

      return draft;
    });
  }

  function moveAssetDown(p: { id: string }) {
    setCampaign((prev) => {
      const draft = structuredClone(prev!);
      draft.assets = {};

      const keys = Object.keys(prev!.assets);
      const fromIndex = keys.indexOf(p.id);
      const toIndex =
        fromIndex + 1 >= keys.length ? keys.length - 1 : fromIndex + 1;
      const element = keys[fromIndex];
      keys.splice(fromIndex, 1);
      keys.splice(toIndex, 0, element);

      for (const key of keys) {
        draft.assets[key] = prev!.assets[key];
      }

      return draft;
    });
  }

  function getCurrentFormValue(p: { name: string }) {
    if (!campaign || !selectedAssetId) {
      return undefined;
    }

    const value = campaign.assets[selectedAssetId].state[p.name];
    return value;
  }

  function getAllFormValues() {
    if (!campaign || !selectedAssetId) {
      return {};
    }

    const value = campaign.assets[selectedAssetId].state;
    return value;
  }

  function saveForm(p: {} = {}) {
    const { isDirty, draftCampaign, currentCampaign } = getIsDirty();
    debug &&
      logger.log("draftCampaign", { isDirty, draftCampaign, currentCampaign });
    if (isDirty) {
      DLStorage.updateCampaign({
        campaignId: props.id,
        updatedCampaign: draftCampaign,
      });
      setCampaign(draftCampaign);
    }
  }

  function setCampaignName(p: { name: string }) {
    setCampaign((prev) => {
      const draft = structuredClone(prev!);
      draft.name = p.name;
      return draft;
    });
  }

  function getCurrentFormState() {
    if (!formRef.current) {
      return {};
    }
    const formData = new FormData(formRef.current);
    const serializedFormData = Object.fromEntries(formData.entries());
    const keysToSave = Object.keys(serializedFormData).filter((key) =>
      key.startsWith("__keeper."),
    );

    const data: Record<string, any> = {};
    keysToSave.forEach((key) => {
      const keyWithoutPrefix = key.replace("__keeper.", "");
      const inputValue = JSON.parse(serializedFormData[key] as string);
      data[keyWithoutPrefix] = inputValue.value;
    });

    return data;
  }

  return {
    loading: !campaign,
    dirty: dirty,
    readonly: props.readonly,
    formRef,
    campaign,
    selectedAssetId,
    setSelectedAssetId,
    saveForm,
    setCampaignName,
    addAsset,
    removeAsset,
    moveAssetUp,
    moveAssetDown,
    getCurrentFormValue,
    getAllFormValues,
  };
}

export function CampaignState<T>(props: { name: string; value: T }) {
  const name = "__keeper." + props.name;
  const state = JSON.stringify({ value: props.value });
  return (
    <UI.VisuallyHidden>
      <input type="hidden" name={name} value={state} />;
    </UI.VisuallyHidden>
  );
}
