import clsx from "clsx";
import { Hash } from "lucide-react";
import type React from "react";
import { UI } from "../../ui/ui";
import { getSurfaceStyle } from "../Surface/getSurfaceStyle";

import { MDXCheckboxField } from "./mdx-components/state/MDXCheckboxField";
import { MDXList } from "./mdx-components/state/MDXList";
import { MDXNumberField } from "./mdx-components/state/MDXNumberField";
import { MDXRollingTable } from "./mdx-components/state/MDXRollingTable";
import { MDXSelectField } from "./mdx-components/state/MDXSelectField";
import { MDXTextAreaField } from "./mdx-components/state/MDXTextAreaField";
import { MDXTextField } from "./mdx-components/state/MDXTextField";
import { MDXTracker } from "./mdx-components/state/MDXTracker";
import { MDXBox } from "./mdx-components/ui/MDXBox";
import { MDXCodeBox } from "./mdx-components/ui/MDXCodeBox";
import { MDXColumns } from "./mdx-components/ui/MDXColumns";
import { MDXDetail } from "./mdx-components/ui/MDXDetail";
import { MDXDivider } from "./mdx-components/ui/MDXDivider";
import { MDXHeading } from "./mdx-components/ui/MDXHeading";
import { MDXLabel } from "./mdx-components/ui/MDXLabel";
import { MDXRow } from "./mdx-components/ui/MDXRow";
import { MDXStack } from "./mdx-components/ui/MDXStack";

export const TEXT_CLASSES = "text-[1.2rem] leading-[1.5em] tracking-normal";

const proseClassName = `
prose prose-base md:prose-lg lg:prose-xl dark:prose-invert 
w-full max-w-full
[&_h1>a]:font-bold
[&_h2>a]:font-bold
[&_h3>a]:font-bold
[&_h4>a]:font-bold
[&_h5>a]:font-bold
[&_h6>a]:font-bold
`;

export function MDXProseWrapper(props: { children: React.ReactNode }) {
  return <div className={proseClassName}>{props.children}</div>;
}
export function MDXProseSheetWrapper(props: { children: React.ReactNode }) {
  return <div className={proseClassName}>{props.children}</div>;
}

export function Fields(props: { children: React.ReactNode }) {
  return (
    <div className="flex w-full flex-col gap-4 py-4 [&_*]:m-0">
      {props.children}
    </div>
  );
}

function getHeadingWithAnchor(Component: React.ElementType) {
  return (props: {
    className?: string;
    id?: string;
    children: React.ReactNode;
  }) => (
    <Component
      data-mdx-type={"data-mdx-type-" + props.className}
      {...props}
      className={clsx(props.className, props.className)}
    >
      {props.id ? (
        <>
          <a href={`#${props.id}`} className="group relative no-underline">
            {props.children}
            <Hash
              className="absolute top-1/2 -right-7 -translate-y-1/2 opacity-0 transition-opacity group-hover:opacity-50"
              size=".75em"
            />
          </a>
        </>
      ) : (
        <>{props.children}</>
      )}
    </Component>
  );
}

export function getMdxComponents(arg: { allowH1s?: boolean } = {}) {
  const allowH1s = arg.allowH1s ?? true;
  return {
    h1: allowH1s ? getHeadingWithAnchor("h1") : getHeadingWithAnchor("h2"),
    h2: allowH1s ? getHeadingWithAnchor("h2") : getHeadingWithAnchor("h3"),
    h3: allowH1s ? getHeadingWithAnchor("h3") : getHeadingWithAnchor("h4"),
    h4: allowH1s ? getHeadingWithAnchor("h4") : getHeadingWithAnchor("h5"),
    h5: allowH1s ? getHeadingWithAnchor("h5") : getHeadingWithAnchor("h6"),
    h6: allowH1s ? getHeadingWithAnchor("h6") : getHeadingWithAnchor("h6"),
    Fields: Fields,
    blockquote: MDXBlockquote as any,
    Divider: MDXDivider as any,
    Row: MDXRow as any,
    Columns: MDXColumns as any,
    Box: MDXBox as any,
    CodeBox: MDXCodeBox as any,
    Stack: MDXStack as any,
    Heading: MDXHeading as any,
    Label: MDXLabel as any,
    List: MDXList as any,
    TextField: MDXTextField as any,
    TextAreaField: MDXTextAreaField as any,
    SelectField: MDXSelectField as any,
    CheckboxField: MDXCheckboxField as any,
    NumberField: MDXNumberField as any,
    Detail: MDXDetail as any,
    Tracker: MDXTracker as any,
    RollingTable: MDXRollingTable as any,
  };
}

export function MDXH1(props: UI.HeadingProps) {
  return (
    <UI.Heading
      data-mdx-type="h1"
      as="h1"
      size={{
        initial: "8",
        sm: "9",
      }}
      {...props}
      className={clsx("relative", props.className)}
    >
      {props.id ? (
        <>
          <a href={`#${props.id}`}>{props.children}</a>
        </>
      ) : (
        <>{props.children}</>
      )}
    </UI.Heading>
  );
}

export function MDXH2(props: UI.HeadingProps) {
  return (
    <UI.Heading
      data-mdx-type="h2"
      as="h2"
      size={{
        initial: "7",
        sm: "8",
      }}
      {...props}
      className={clsx("relative mt-5", props.className)}
    >
      {props.id ? (
        <>
          <a href={`#${props.id}`}>{props.children}</a>
        </>
      ) : (
        <>{props.children}</>
      )}
    </UI.Heading>
  );
}

export function MDXH3(props: UI.HeadingProps) {
  return (
    <UI.Heading
      data-mdx-type="h3"
      as="h3"
      size={{
        initial: "6",
        sm: "7",
      }}
      {...props}
      className={clsx("relative mt-4", props.className)}
    >
      {props.id ? (
        <>
          <a href={`#${props.id}`}>{props.children}</a>
        </>
      ) : (
        <>{props.children}</>
      )}
    </UI.Heading>
  );
}

export function MDXH4(props: UI.HeadingProps) {
  return (
    <UI.Heading
      data-mdx-type="h4"
      as="h4"
      size={{
        initial: "5",
        sm: "6",
      }}
      {...props}
      className={clsx("relative mt-3", props.className)}
    >
      {props.id ? (
        <>
          <a href={`#${props.id}`}>{props.children}</a>
        </>
      ) : (
        <>{props.children}</>
      )}
    </UI.Heading>
  );
}

export function MDXH5(props: UI.HeadingProps) {
  return (
    <UI.Heading
      data-mdx-type="h5"
      as="h5"
      size={{
        initial: "4",
        sm: "5",
      }}
      {...props}
      className={clsx("relative mt-2", props.className)}
    >
      {props.id ? (
        <>
          <a href={`#${props.id}`}>{props.children}</a>
        </>
      ) : (
        <>{props.children}</>
      )}
    </UI.Heading>
  );
}

function MDXH6(props: UI.HeadingProps) {
  return (
    <UI.Heading
      data-mdx-type="h6"
      as="h6"
      size={{
        initial: "3",
        sm: "4",
      }}
      {...props}
      className={clsx("relative mt-1", props.className)}
    >
      {props.id ? (
        <>
          <a href={`#${props.id}`}>{props.children}</a>
        </>
      ) : (
        <>{props.children}</>
      )}
    </UI.Heading>
  );
}

function MDXBlockquote(props: any) {
  return (
    <UI.Blockquote
      data-mdx-type="blockquote"
      style={{
        ...getSurfaceStyle(),
        padding: "1rem",
      }}
      {...props}
    >
      <MDXProseWrapper>{props.children}</MDXProseWrapper>
    </UI.Blockquote>
  );
}

export function MDXP(props: any) {
  return (
    <UI.Text
      data-mdx-type="p"
      {...props}
      as="span"
      size={""}
      className={clsx(props.className, TEXT_CLASSES)}
    />
  );
}
