import { visit } from "unist-util-visit";
import type { Root } from "mdast";
import type { TextDirective } from "mdast-util-directive";

const TEXT_SIZE_DIRECTIVES = ["large", "xl", "sm"] as const;
const TEXT_COLOR_DIRECTIVES = [
  "red",
  "blue",
  "green",
  "yellow",
  "orange",
  "pink",
  "purple",
  "gray",
] as const;

const ALL_DIRECTIVES = [
  ...TEXT_SIZE_DIRECTIVES,
  ...TEXT_COLOR_DIRECTIVES,
] as const;

export function remarkTextSize() {
  return (tree: Root) => {
    visit(tree, "textDirective", (node: TextDirective) => {
      if (!(ALL_DIRECTIVES as readonly string[]).includes(node.name)) return;

      const data = node.data || (node.data = {});
      const existingClasses = data.hProperties?.className ?? [];

      data.hName = "span";
      data.hProperties = {
        ...data.hProperties,
        className: [...existingClasses, `directive-${node.name}`],
      };
    });
  };
}
