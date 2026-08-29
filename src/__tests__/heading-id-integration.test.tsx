import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { mdxComponents } from "@/components/mdx";
import { getAllPosts, getPostHeadings } from "@/lib/posts";
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

describe("目次と本文アンカーの整合", () => {
  const posts = getAllPosts();

  it("検証対象の記事がある", () => {
    expect(posts.length).toBeGreaterThan(0);
  });

  // 記事先頭の目次はビルド時に本文から抜き出しているため、実際に
  // レンダリングされる見出しの id とずれるとリンクが機能しなくなる
  it.each(posts.map((post) => post.slug))(
    "post/%s の目次リンクが本文の見出しと一致する",
    async (slug) => {
      const { default: PostContent } = await import(
        `../../content/posts/${slug}.mdx`
      );
      const { container } = render(<PostContent components={mdxComponents} />);

      const rendered = Array.from(
        container.querySelectorAll<HTMLElement>("[data-toc-heading]"),
      ).map((el) => ({
        id: el.id,
        text: el.dataset.tocText,
        level: Number(el.dataset.tocHeading),
      }));

      expect(getPostHeadings(slug)).toEqual(rendered);
    },
  );
});
