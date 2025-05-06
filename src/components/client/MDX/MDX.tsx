import clsx from "clsx";
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
import { MDXColumns } from "./mdx-components/ui/MDXColumns";
import { MDXDetail } from "./mdx-components/ui/MDXDetail";
import { MDXDivider } from "./mdx-components/ui/MDXDivider";
import { MDXHeading } from "./mdx-components/ui/MDXHeading";
import { MDXLabel } from "./mdx-components/ui/MDXLabel";
import { MDXRow } from "./mdx-components/ui/MDXRow";
import { MDXStack } from "./mdx-components/ui/MDXStack";

export const TEXT_CLASSES = "text-[1.2rem] leading-[1.5em] tracking-normal";

export function MDXWrapper(props: { children: React.ReactNode }) {
  return (
    <div className="prose prose-xl dark:prose-invert w-full max-w-full">
      {props.children}
    </div>
  );
}
export function MDXSheetWrapper(props: { children: React.ReactNode }) {
  return (
    <div className="prose prose-xl dark:prose-invert w-full max-w-full">
      {props.children}
    </div>
  );
}

export function Fields(props: { children: React.ReactNode }) {
  return (
    <div className="flex w-full flex-col gap-4 py-4 [&_*]:m-0">
      {props.children}
    </div>
  );
}

export function getMdxComponents(arg: { allowH1s?: boolean } = {}) {
  const allowH1s = arg.allowH1s ?? true;
  return {
    h1: allowH1s ? "h1" : "h2",
    h2: allowH1s ? "h2" : "h3",
    h3: allowH1s ? "h3" : "h4",
    h4: allowH1s ? "h4" : "h5",
    h5: allowH1s ? "h5" : "h6",
    h6: allowH1s ? "h6" : "h6",
    Fields: Fields,
    blockquote: MDXBlockquote as any,
    Divider: MDXDivider as any,
    Row: MDXRow as any,
    Columns: MDXColumns as any,
    Box: MDXBox as any,
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

function MDXA(props: any) {
  return (
    <UI.Link
      data-mdx-type="a"
      weight={"medium"}
      underline="always"
      {...props}
      className={clsx(props.className, TEXT_CLASSES)}
    />
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
      <MDXWrapper>{props.children}</MDXWrapper>
    </UI.Blockquote>
  );
}

function MDXEm(props: any) {
  return (
    <UI.Em
      data-mdx-type="em"
      {...props}
      className={clsx(props.className, TEXT_CLASSES)}
    />
  );
}

function MDXStrong(props: any) {
  return (
    <UI.Strong
      data-mdx-type="strong"
      {...props}
      className={clsx(props.className, TEXT_CLASSES)}
    />
  );
}

function MDXPre(props: any) {
  return (
    <UI.Card>
      <pre
        data-mdx-type="pre"
        {...props}
        className={clsx(
          props.className,
          "p-2",
          TEXT_CLASSES,
          "whitespace-pre-wrap",
        )}
      />
    </UI.Card>
  );
}

function MDXUl(props: any) {
  return (
    <ul
      data-mdx-type="ul"
      {...props}
      className={clsx(props.className, "list-disc")}
    />
  );
}

function MDXOl(props: any) {
  return (
    <ol
      data-mdx-type="ol"
      {...props}
      className={clsx(props.className, "list-decimal")}
    />
  );
}

function MDXLi(props: any) {
  return (
    <li
      data-mdx-type="li"
      {...props}
      className={clsx(props.className, "ml-4")}
    />
  );
}

function MDXCode(props: any) {
  return (
    <code
      data-mdx-type="code"
      {...props}
      className={clsx(props.className, TEXT_CLASSES)}
    />
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

function MDXTable(props: any) {
  return <UI.Table.Root data-mdx-type="table" variant="surface" {...props} />;
}

function MDXTHead(props: any) {
  return <UI.Table.Header data-mdx-type="thead" {...props} />;
}

function MDXTBody(props: any) {
  return <UI.Table.Body data-mdx-type="tbody" {...props} />;
}

function MDXTr(props: any) {
  return <UI.Table.Row data-mdx-type="tr" {...props} />;
}

function MDXTh(props: any) {
  return <UI.Table.ColumnHeaderCell data-mdx-type="th" {...props} />;
}

function MDXTd(props: any) {
  return <UI.Table.Cell data-mdx-type="td" {...props} />;
}
