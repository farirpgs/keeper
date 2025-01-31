import {
  Blockquote,
  Card,
  Em,
  Flex,
  Heading,
  Link,
  Strong,
  Table,
  Text,
  type HeadingProps,
} from "@radix-ui/themes";
import clsx from "clsx";
import type React from "react";
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
    <Flex gap="3" direction="column">
      {props.children}
    </Flex>
  );
}

export function getMdxComponents(arg: { allowH1s?: boolean } = {}) {
  const allowH1s = arg.allowH1s ?? true;
  return {
    h1: allowH1s ? (MDXH1 as any) : (MDXH2 as any),
    h2: allowH1s ? (MDXH2 as any) : (MDXH3 as any),
    h3: allowH1s ? (MDXH3 as any) : (MDXH4 as any),
    h4: allowH1s ? (MDXH4 as any) : (MDXH5 as any),
    h5: allowH1s ? (MDXH5 as any) : (MDXH6 as any),
    h6: allowH1s ? (MDXH6 as any) : (MDXH6 as any),
    a: MDXA as any,
    blockquote: MDXBlockquote as any,
    em: MDXEm as any,
    strong: MDXStrong as any,
    pre: MDXPre as any,
    ul: MDXUl as any,
    ol: MDXOl as any,
    li: MDXLi as any,
    code: MDXCode as any,
    p: MDXP as any,
    table: MDXTable as any,
    thead: MDXTHead as any,
    tbody: MDXTBody as any,
    tr: MDXTr as any,
    th: MDXTh as any,
    td: MDXTd as any,
    hr: MDXDivider as any,
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

export function MDXH1(props: HeadingProps) {
  return (
    <Heading
      data-mdx-type="h1"
      as="h1"
      size={{
        initial: "8",
        sm: "9",
      }}
      {...props}
      className={clsx(
        "relative",
        // 'mb-6 mt-8',
        props.className,
      )}
    >
      {props.id ? (
        <>
          <a href={`#${props.id}`}>{props.children}</a>
        </>
      ) : (
        <>{props.children}</>
      )}
    </Heading>
  );
}

export function MDXH2(props: HeadingProps) {
  return (
    <Heading
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
    </Heading>
  );
}

export function MDXH3(props: HeadingProps) {
  return (
    <Heading
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
    </Heading>
  );
}

export function MDXH4(props: HeadingProps) {
  return (
    <Heading
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
    </Heading>
  );
}

export function MDXH5(props: HeadingProps) {
  return (
    <Heading
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
    </Heading>
  );
}

function MDXH6(props: HeadingProps) {
  return (
    <Heading
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
    </Heading>
  );
}

function MDXA(props: any) {
  return (
    <Link
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
    <Blockquote
      data-mdx-type="blockquote"
      style={{
        ...getSurfaceStyle(),
        padding: "1rem",
      }}
      {...props}
    >
      <MDXWrapper>{props.children}</MDXWrapper>
    </Blockquote>
  );
}

function MDXEm(props: any) {
  return (
    <Em
      data-mdx-type="em"
      {...props}
      className={clsx(props.className, TEXT_CLASSES)}
    />
  );
}

function MDXStrong(props: any) {
  return (
    <Strong
      data-mdx-type="strong"
      {...props}
      className={clsx(props.className, TEXT_CLASSES)}
    />
  );
}

function MDXPre(props: any) {
  return (
    <Card>
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
    </Card>
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
    <Text
      data-mdx-type="p"
      {...props}
      as="span"
      size={""}
      className={clsx(props.className, TEXT_CLASSES)}
    />
  );
}

function MDXTable(props: any) {
  return <Table.Root data-mdx-type="table" variant="surface" {...props} />;
}

function MDXTHead(props: any) {
  return <Table.Header data-mdx-type="thead" {...props} />;
}

function MDXTBody(props: any) {
  return <Table.Body data-mdx-type="tbody" {...props} />;
}

function MDXTr(props: any) {
  return <Table.Row data-mdx-type="tr" {...props} />;
}

function MDXTh(props: any) {
  return <Table.ColumnHeaderCell data-mdx-type="th" {...props} />;
}

function MDXTd(props: any) {
  return <Table.Cell data-mdx-type="td" {...props} />;
}
