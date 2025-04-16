import { evaluate, evaluateSync } from "@mdx-js/mdx";
import * as runtime from "react/jsx-runtime";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";

export async function evaluateMdx(props: { mdx: string }) {
  const res = await evaluate(props.mdx, {
    ...(runtime as any),
    remarkPlugins: [remarkGfm],
    rehypePlugins: [rehypeSlug],
  });
  return res.default;
}

export function evaluateMdxSync(props: { mdx: string | undefined }) {
  if (!props.mdx) {
    return "";
  }
  const res = evaluateSync(props.mdx, {
    ...(runtime as any),
    remarkPlugins: [remarkGfm],
    rehypePlugins: [rehypeSlug],
  });
  return res.default;
}
