import { describe, expect, it } from "vitest";
import { extractHeadings } from "@/lib/toc";

describe("extractHeadings", () => {
  it("collects h2〜h4 with level and text", () => {
    expect(
      extractHeadings(["## はじめに", "### 前提", "#### 補足"].join("\n\n")),
    ).toEqual([
      { id: "はじめに", text: "はじめに", level: 2 },
      { id: "前提", text: "前提", level: 3 },
      { id: "補足", text: "補足", level: 4 },
    ]);
  });

  it("skips h1 and h5", () => {
    expect(extractHeadings("# タイトル\n\n##### 細目")).toEqual([]);
  });

  it("ignores heading-like lines inside code blocks", () => {
    const markdown = ["## 本物", "", "```sh", "## これはコメント", "```"].join(
      "\n",
    );

    expect(extractHeadings(markdown).map((h) => h.text)).toEqual(["本物"]);
  });

  it("uniquifies duplicate headings the same way as the article body", () => {
    expect(extractHeadings("## まとめ\n\n## まとめ").map((h) => h.id)).toEqual([
      "まとめ",
      "まとめ-2",
    ]);
  });

  it("unwraps directives so the id matches the rendered heading", () => {
    expect(extractHeadings("## :red[重要]な話")).toEqual([
      { id: "重要な話", text: "重要な話", level: 2 },
    ]);
  });

  it("keeps the text of inline code and emphasis", () => {
    expect(extractHeadings("## `cn()` の**使い方**")[0]).toEqual({
      id: "cn()-の使い方",
      text: "cn() の使い方",
      level: 2,
    });
  });
});
