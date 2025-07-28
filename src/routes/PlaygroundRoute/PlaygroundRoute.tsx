import React, { useEffect, useState } from "react";
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

  console.log(text);

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
              <ErrorBoundary key={text}>
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
              </ErrorBoundary>
            </UI.Card>
          </div>
        </div>
      </div>
    </UI.Theme>
  );
}

// Inline Error Boundary Component
interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <UI.Card className="border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-950">
          <div className="flex flex-col gap-2">
            <UI.Text size="3" weight="bold" color="red">
              Something went wrong
            </UI.Text>
            <UI.Text size="2" color="gray">
              {this.state.error?.message || "An unexpected error occurred"}
            </UI.Text>
            <UI.Button
              size="2"
              variant="outline"
              color="gray"
              onClick={() =>
                this.setState({ hasError: false, error: undefined })
              }
            >
              Try again
            </UI.Button>
          </div>
        </UI.Card>
      );
    }

    return this.props.children;
  }
}
