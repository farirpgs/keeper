import { evaluate, evaluateSync } from "@mdx-js/mdx";
import * as runtime from "react/jsx-runtime";
import remarkGfm from "remark-gfm";

export async function evaluateMdx(props: { mdx: string }) {
  const res = await evaluate(props.mdx, {
    ...(runtime as any),
    remarkPlugins: [remarkGfm],
  });
  return res.default;
}

export function evaluateMdxSync(props: { mdx: string }) {
  const res = evaluateSync(props.mdx, {
    ...(runtime as any),
    remarkPlugins: [remarkGfm],
  });
  return res.default;
}