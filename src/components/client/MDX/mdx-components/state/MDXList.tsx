import React, { useContext, useEffect, useState } from "react";
import { z } from "zod";
import { CampaignContext } from "../../../../../domains/campaign/useCampaign";
import { parseProps } from "../../../../../domains/utils/parseProps";
import { UI } from "../../../../ui/ui";
import { MDXStack } from "../ui/MDXStack";

const propsSchema = z.object({
  name: z.string(),
  min: z
    .number()
    .optional()
    .default(1)
    .refine((v) => v >= 1),
  max: z.number().optional(),
  children: z.any().optional(),
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

  const campaignManager = useContext(CampaignContext);

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

  function handleAddBelow(id: string) {
    setIds((prev) => {
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
      const toIndex = fromIndex - 1 <= 0 ? 0 : fromIndex - 1;
      const element = newIds[fromIndex];
      newIds.splice(fromIndex, 1);
      newIds.splice(toIndex, 0, element);

      return newIds;
    });
  }

  function handleMoveDown(id: string) {
    setIds((prev) => {
      const newIds = [...prev];
      const fromIndex = newIds.indexOf(id);
      const toIndex =
        fromIndex + 1 >= newIds.length ? newIds.length - 1 : fromIndex + 1;
      const element = newIds[fromIndex];
      newIds.splice(fromIndex, 1);
      newIds.splice(toIndex, 0, element);

      return newIds;
    });
  }

  return (
    <UI.Flex
      data-mdx-type="list"
      direction={"column"}
      gap="2"
      className="w-full"
    >
      {ids.map((id) => {
        const isFirst = id === ids[0];
        const isLast = id === ids[ids.length - 1];
        const shouldRenderDeleteButton = ids.length > props.min;
        const shouldRenderMoveButtons = !(isFirst && isLast);

        return (
          <ListContext.Provider
            value={{
              name: props.name,
              id,
            }}
            key={id}
          >
            <UI.ContextMenu.Root>
              <UI.Tooltip
                content={"Right click the card's background for options..."}
              >
                <UI.ContextMenu.Trigger>
                  <UI.Card size="2" className={"w-full"}>
                    <div className="flex items-start gap-4">
                      <MDXStack>{props.children}</MDXStack>
                      <UI.ContextMenu.Content color="gray">
                        <UI.ContextMenu.Item onClick={() => handleAddBelow(id)}>
                          Add Below
                        </UI.ContextMenu.Item>
                        {shouldRenderMoveButtons && (
                          <>
                            <UI.ContextMenu.Separator />
                            {!isFirst && (
                              <UI.ContextMenu.Item
                                onClick={() => handleMoveUp(id)}
                              >
                                Move Up
                              </UI.ContextMenu.Item>
                            )}
                            {!isLast && (
                              <UI.ContextMenu.Item
                                onClick={() => handleMoveDown(id)}
                              >
                                Move Down
                              </UI.ContextMenu.Item>
                            )}
                          </>
                        )}
                        {shouldRenderDeleteButton && (
                          <>
                            <UI.ContextMenu.Separator />
                            <UI.ContextMenu.Item
                              color="red"
                              onClick={() => handleDelete(id)}
                            >
                              Delete
                            </UI.ContextMenu.Item>
                          </>
                        )}
                      </UI.ContextMenu.Content>
                    </div>
                  </UI.Card>
                </UI.ContextMenu.Trigger>
              </UI.Tooltip>
            </UI.ContextMenu.Root>
          </ListContext.Provider>
        );
      })}
    </UI.Flex>
  );
}
