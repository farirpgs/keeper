import { ArrowDown, ArrowUp, PlusIcon, Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { z } from "zod";
import { useCampaignManager } from "../../../../../domains/campaign/useCampaign";
import { parseProps } from "../../../../../domains/utils/parseProps";
import { UI } from "../../../../ui/ui";
import { MDXStack } from "../ui/MDXStack";

const propsSchema = z.object({
  name: z.string(),
  min: z.number().optional().default(1),
  max: z.number().optional(),
  children: z.any().optional(),
  addButtonLabel: z.string().optional().default("Add Item"),
});

type Props = z.input<typeof propsSchema>;

const ListContext = React.createContext<{
  name: string;
  id: string;
}>(undefined as any);

export function useName(props: { name: string }) {
  const listContext = React.useContext(ListContext);

  if (listContext === undefined) {
    return props.name;
  } else {
    const nameForList = `[${listContext.name}].${listContext.id}.${props.name}`;
    return nameForList;
  }
}

export function MDXList(p: Props) {
  const props = parseProps({
    props: p,
    schema: propsSchema,
    componentName: "MDXList",
  });

  const campaignManager = useCampaignManager();
  const [ids, setIds] = useState<Array<string>>([]);

  useEffect(() => {
    const state = campaignManager.getAllFormValues();

    const idsToSet = new Set<string>();
    for (const key of Object.keys(state)) {
      const listNamePrefix = `[${props.name}].`;
      if (key.startsWith(listNamePrefix)) {
        const [extractedId] = key.replace(listNamePrefix, "").split(".");
        idsToSet.add(extractedId);
      }
    }

    const numberOfMissingItems =
      idsToSet.size < props.min ? props.min - idsToSet.size : 0;

    for (const _i of Array(numberOfMissingItems).keys()) {
      const id = crypto.randomUUID();
      idsToSet.add(id);
    }

    setIds([...idsToSet]);
  }, []);

  function handleAddBelow(id?: string) {
    setIds((prev) => {
      debugger;
      if (!id) return [...prev, crypto.randomUUID()];
      return prev.reduce((acc, currentId) => {
        if (currentId === id) {
          return [...acc, currentId, crypto.randomUUID()];
        } else {
          return [...acc, currentId];
        }
      }, [] as Array<string>);
    });
  }

  function handleDelete(id: string) {
    setIds((prev) => {
      return prev.filter((i) => i !== id);
    });
  }

  function handleMoveUp(id: string) {
    setIds((prev) => {
      const newIds = [...prev];
      const fromIndex = newIds.indexOf(id);
      if (fromIndex > 0) {
        const [removed] = newIds.splice(fromIndex, 1);
        newIds.splice(fromIndex - 1, 0, removed);
      }
      return newIds;
    });
  }

  function handleMoveDown(id: string) {
    setIds((prev) => {
      const newIds = [...prev];
      const fromIndex = newIds.indexOf(id);
      if (fromIndex < newIds.length - 1) {
        const [removed] = newIds.splice(fromIndex, 1);
        newIds.splice(fromIndex + 1, 0, removed);
      }
      return newIds;
    });
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col items-end gap-3">
      <div className="flex w-full flex-col gap-4">
        {ids.map((id, index) => {
          const isFirst = index === 0;
          const isLast = index === ids.length - 1;
          const shouldRenderDeleteButton = ids.length > props.min;

          const canMoveUp = !isFirst;
          const canMoveDown = !isLast;
          const canDelete = shouldRenderDeleteButton;
          const hasActions = canMoveUp || canMoveDown || canDelete;

          return (
            <ListContext.Provider value={{ name: props.name, id }} key={id}>
              {hasActions ? (
                <UI.HoverCard.Root>
                  <UI.HoverCard.Trigger>
                    <UI.Card
                      size="2"
                      className="group flex w-full flex-row items-center gap-2 p-4"
                    >
                      <div className="flex-1">
                        <MDXStack className="w-full">{props.children}</MDXStack>
                      </div>
                    </UI.Card>
                  </UI.HoverCard.Trigger>
                  <UI.HoverCard.Content side="right" size="1">
                    <div className="flex flex-row gap-2">
                      {canMoveUp && (
                        <UI.IconButton
                          variant="soft"
                          aria-label="Move up"
                          onClick={() => handleMoveUp(id)}
                        >
                          <ArrowUp size={20} />
                        </UI.IconButton>
                      )}
                      {canMoveDown && (
                        <UI.IconButton
                          aria-label="Move down"
                          variant="soft"
                          onClick={() => handleMoveDown(id)}
                        >
                          <ArrowDown size={20} />
                        </UI.IconButton>
                      )}
                      {canDelete && (
                        <UI.IconButton
                          aria-label="Delete"
                          variant="outline"
                          color="red"
                          onClick={() => handleDelete(id)}
                        >
                          <Trash2 size={20} />
                        </UI.IconButton>
                      )}
                    </div>
                  </UI.HoverCard.Content>
                </UI.HoverCard.Root>
              ) : (
                <UI.Card
                  size="2"
                  className="group flex w-full flex-row items-center gap-2 p-4"
                >
                  <div className="flex-1">
                    <MDXStack className="w-full">{props.children}</MDXStack>
                  </div>
                </UI.Card>
              )}
            </ListContext.Provider>
          );
        })}
      </div>
      <div className="flex-end flex items-center">
        <UI.Button onClick={() => handleAddBelow()} size="2" variant="soft">
          <PlusIcon size={16} />
          {props.addButtonLabel}
        </UI.Button>
      </div>
    </div>
  );
}
