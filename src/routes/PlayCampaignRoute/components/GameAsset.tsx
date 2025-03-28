import { evaluate } from "@mdx-js/mdx";
import type { CollectionEntry } from "astro:content";
import { useEffect, useState } from "react";
import {
  MDXWrapper,
  getMdxComponents,
} from "../../../components/client/MDX/MDX";
import { evaluateMdx } from "../../../domains/mdx/evaluateMdx";
import { getLogger } from "../../../domains/utils/getLogger";

const logger = getLogger("Sheet");

export function GameAsset(props: {
  id: string | undefined;
  asset: CollectionEntry<"assets">;
}) {
  const keyToForceRerenderOnAssetChange = props.id;
  const [MDXContent, setMDXContent] =
    useState<Awaited<ReturnType<typeof evaluate>>["default"]>();

  useEffect(() => {
    main();
    async function main() {
      try {
        const mdxContent = await evaluateMdx({
          mdx: props.asset.body!,
        });
        setMDXContent(() => mdxContent);
      } catch (error) {
        logger.error("Failed to evaluate MDX", { error });
      }
    }
  }, [props.id, props.asset.id]);

  return (
    <MDXWrapper key={keyToForceRerenderOnAssetChange}>
      {MDXContent && (
        <MDXContent
          components={{
            ...getMdxComponents({
              allowH1s: false,
            }),
          }}
        />
      )}
    </MDXWrapper>
  );
}
