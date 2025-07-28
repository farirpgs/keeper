import { useRef } from "react";
import { z } from "zod";
import { parseProps } from "../../../../../domains/utils/parseProps";

const propsSchema = z.object({
  children: z.any().optional(),
  language: z.string().optional().default("typescript"),
});

type Props = z.input<typeof propsSchema>;

export function MDXCodeBox(p: Props) {
  const props = parseProps({
    props: p,
    schema: propsSchema,
    componentName: "MDXCodeBox",
  });
  const contentRef = useRef<HTMLDivElement>(null);

  return (
    <div data-mdx-type="code-box" className="flex gap-4">
      <div ref={contentRef} className="flex-1">
        {props.children}
      </div>
      <button
        style={{
          backgroundColor: "var(--color-gray-100)",
          padding: "0.5rem",
          borderRadius: "0.5rem",
          fontSize: "0.875rem",
          fontWeight: "500",
          color: "var(--color-gray-900)",
          cursor: "pointer",
        }}
        onClick={() => {
          const code = contentRef.current?.innerText || "";
          const url = new URL("/playground", window.location.origin);
          url.searchParams.set("code", code);
          window.open(url.toString(), "_blank");
        }}
      >
        Open in Playground
      </button>
    </div>
  );
}
