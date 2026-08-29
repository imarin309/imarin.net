import { describe, expect, it } from "vitest";
import type { Root } from "mdast";
import { remarkHeadingId } from "@/lib/remark-heading-id";

function doc(headings: { depth: number; text: string }[]): Root {
  return {
    type: "root",
    children: headings.map(({ depth, text }) => ({
      type: "heading",
      depth,
      children: [{ type: "text", value: text }],
    })),
  } as unknown as Root;
}

function ids(tree: Root) {
  remarkHeadingId()(tree);
  return tree.children.map(
    (node) => (node.data?.hProperties as { id?: string } | undefined)?.id,
  );
}

describe("remarkHeadingId", () => {
  it("derives an id from the heading text", () => {
    expect(ids(doc([{ depth: 2, text: "はじめに" }]))).toEqual(["はじめに"]);
  });

  it("suffixes duplicate headings so ids stay unique", () => {
    expect(
      ids(
        doc([
          { depth: 2, text: "まとめ" },
          { depth: 2, text: "まとめ" },
          { depth: 3, text: "まとめ" },
        ]),
      ),
    ).toEqual(["まとめ", "まとめ-2", "まとめ-3"]);
  });

  it("leaves h1 and h5 untouched", () => {
    expect(
      ids(
        doc([
          { depth: 1, text: "タイトル" },
          { depth: 5, text: "細目" },
        ]),
      ),
    ).toEqual([undefined, undefined]);
  });

  it("skips headings whose text yields an empty slug", () => {
    expect(ids(doc([{ depth: 2, text: "###" }]))).toEqual([undefined]);
  });
});
