import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { mdxComponents } from "@/components/mdx";
import DuplicateHeadings from "./fixtures/duplicate-headings.mdx";

afterEach(cleanup);

describe("見出しidの一意化（MDXパイプライン経由）", () => {
  it("同じ見出しが並んでも id が衝突しない", () => {
    const { container } = render(
      <DuplicateHeadings components={mdxComponents} />,
    );

    const headings = Array.from(
      container.querySelectorAll<HTMLElement>("[data-toc-heading]"),
    );

    expect(headings.map((el) => el.id)).toEqual([
      "まとめ",
      "まとめ-2",
      "まとめ-3",
    ]);
    // 目次の表示ラベルは重複したままでよい（見出しの文言そのもの）
    expect(headings.map((el) => el.dataset.tocText)).toEqual([
      "まとめ",
      "まとめ",
      "まとめ",
    ]);
  });
});
