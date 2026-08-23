import { describe, expect, it } from "vitest";
import type { Root } from "mdast";
import { remarkCite } from "@/lib/remark-cite";

function directive(
  type: "leafDirective" | "textDirective",
  name: string,
): Root {
  return {
    type: "root",
    children: [
      {
        type,
        name,
        attributes: {},
        children: [{ type: "text", value: "書籍名 紹介文抜粋" }],
      },
    ],
  } as unknown as Root;
}

function transform(tree: Root) {
  remarkCite()(tree);
  return tree.children[0].data;
}

describe("remarkCite", () => {
  it("renders ::cite as a <cite> element", () => {
    expect(transform(directive("leafDirective", "cite"))).toEqual({
      hName: "cite",
      hProperties: { className: ["directive-cite"] },
    });
  });

  it("renders :cite inline as a <cite> element", () => {
    expect(transform(directive("textDirective", "cite"))).toEqual({
      hName: "cite",
      hProperties: { className: ["directive-cite"] },
    });
  });

  it("leaves other directives untouched", () => {
    expect(transform(directive("textDirective", "large"))).toBeUndefined();
  });
});
