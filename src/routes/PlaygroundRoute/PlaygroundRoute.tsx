import { useEffect, useState } from "react";
import {
  getMdxComponents,
  MDXH1,
  MDXProseWrapper,
} from "../../components/client/MDX/MDX";
import { UI } from "../../components/ui/ui";
import {
  CampaignContext,
  useCampaign,
} from "../../domains/campaign/useCampaign";
import { evaluateMdx } from "../../domains/mdx/evaluateMdx";
import { getLogger } from "../../domains/utils/getLogger";
import type { ThemeType } from "../../domains/utils/getTheme";

const logger = getLogger("PlaygroundPage");

export function PlaygroundRoute(props: { theme: ThemeType }) {
  const searchParams =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search)
      : new URLSearchParams();
  const code = searchParams.get("code");
  const [text, setText] = useState(code || "");
  const campaignManager = useCampaign({
    id: "",
  });

  const [MDXContent, setMDXContent] =
    useState<Awaited<ReturnType<typeof evaluateMdx>>>();

  useEffect(() => {
    main();
    async function main() {
      try {
        const mdxContent = await evaluateMdx({
          mdx: text,
        });
        setMDXContent(() => mdxContent);
      } catch (error) {
        logger.error("Failed to evaluate MDX", { error });
      }
    }
  }, [text]);

  return (
    <UI.Theme {...props.theme} hasBackground={false}>
      <div className="flex flex-col items-center gap-5">
        <MDXH1>Asset Creation Playground</MDXH1>
        <div className="flex flex-row gap-7">
          <div className="w-[400px]">
            <UI.TextArea
              className="h-full font-mono"
              rows={20}
              value={text}
              onChange={(e) => setText(e.target.value)}
            ></UI.TextArea>
          </div>
          <div className="w-[800px]">
            <UI.Card className="h-full px-6">
              <CampaignContext.Provider value={campaignManager}>
                <MDXProseWrapper>
                  {MDXContent && (
                    <MDXContent
                      components={{
                        ...getMdxComponents({}),
                      }}
                    />
                  )}
                </MDXProseWrapper>
              </CampaignContext.Provider>
            </UI.Card>
          </div>
        </div>
      </div>
    </UI.Theme>
  );
}
