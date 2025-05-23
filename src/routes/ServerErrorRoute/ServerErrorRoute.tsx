import { MDXH1, MDXP } from "../../components/client/MDX/MDX";
import { UI } from "../../components/ui/ui";
import type { ThemeType } from "../../domains/utils/getTheme";

type Props = {
  theme: ThemeType;
  error?: unknown;
};

export function ServerErrorRoute(props: Props) {
  return (
    <UI.Theme {...props.theme} hasBackground={false}>
      <UI.Container className="mx-auto max-w-3xl text-center">
        <div className="flex flex-col gap-5">
          <MDXH1>Server Error</MDXH1>

          <MDXP>
            Oops! Something went wrong on our servers. Please try again later,
            or <UI.Link href="https://farirpgs.com/contact">contact us</UI.Link>{" "}
            if the problem persists.
          </MDXP>

          <MDXP>We apologize for the inconvenience!</MDXP>

          <div>
            {props.error instanceof Error
              ? props.error.message
              : "Unknown error"}
          </div>

          <div className="flex items-center justify-center">
            <UI.Link href="/">
              <UI.Button radius="full" size="4">
                Go back home
              </UI.Button>
            </UI.Link>
          </div>
        </div>
      </UI.Container>
    </UI.Theme>
  );
}
