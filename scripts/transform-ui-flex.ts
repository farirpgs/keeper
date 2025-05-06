import {
  API,
  FileInfo,
  JSXAttribute,
  JSXElement,
  JSXExpressionContainer,
} from "jscodeshift";

export default function transformer(file: FileInfo, api: API) {
  const j = api.jscodeshift;
  const root = j(file.source);

  root
    .find(JSXElement, {
      openingElement: {
        name: {
          object: { name: "UI" },
          property: { name: "Flex" },
        },
      },
    })
    .forEach((path) => {
      const { openingElement, closingElement } = path.node;
      const attrs = openingElement.attributes as JSXAttribute[];
      const classes: string[] = ["flex"];

      function pullProp(name: string) {
        const idx = attrs.findIndex(
          (a) => j.JSXAttribute.check(a) && a.name.name === name,
        );
        if (idx === -1) return;
        const [attr] = attrs.splice(idx, 1) as [JSXAttribute];
        const v = attr.value;
        if (j.Literal.check(v)) return (v as any).value;
        if (j.JSXExpressionContainer.check(v)) {
          const expr = (v as JSXExpressionContainer).expression;
          if (j.Literal.check(expr)) return (expr as any).value;
          return api.print(expr).code;
        }
      }

      const dir = pullProp("direction");
      if (dir) classes.push(`flex-${dir}`);
      const gap = pullProp("gap");
      if (gap) classes.push(`gap-${gap}`);
      const justify = pullProp("justify");
      if (justify) classes.push(`justify-${justify}`);
      const align = pullProp("align");
      if (align) classes.push(`items-${align}`);

      const wrap = pullProp("wrap");
      if (wrap === "wrap") classes.push("flex-wrap");
      if (wrap === "nowrap") classes.push("flex-nowrap");

      const grow = pullProp("flexGrow");
      if (grow) classes.push("flex-grow");

      const existing = pullProp("className");
      if (existing) classes.push(existing.replace(/['"`]/g, ""));

      // swap out
      openingElement.name = j.jsxIdentifier("div");
      if (closingElement) closingElement.name = j.jsxIdentifier("div");
      openingElement.attributes = [
        j.jsxAttribute(
          j.jsxIdentifier("className"),
          j.stringLiteral(classes.join(" ")),
        ),
      ];
    });

  return root.toSource({ quote: "single" });
}
