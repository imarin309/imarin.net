import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkDirective from "remark-directive";
import { visit } from "unist-util-visit";
import { toString } from "mdast-util-to-string";
import type { Heading, Root } from "mdast";
import { remarkHeadingId } from "./remark-heading-id";

export type TocHeading = {
  id: string;
  text: string;
  level: number;
};

// 見出しのテキストに影響するプラグインだけを通す。
// remarkDirective が無いと `## :red[重要]` の記法がただの文字列として
// 解釈され、MDX 本体と id がずれてしまう。
// remarkTextSize / remarkCite / remarkLinkCard は hName・hProperties を
// 足すだけでテキストを変えないため、ここでは通す必要がない。
const processor = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkDirective);

/**
 * Markdown本文から目次用の見出し（h2〜h4）を抜き出す。
 *
 * id は MDX のレンダリングと同じ remarkHeadingId に振らせるため、
 * 記事本文のアンカーと必ず一致する。
 */
export function extractHeadings(markdown: string): TocHeading[] {
  const tree = processor.parse(markdown) as Root;
  remarkHeadingId()(tree);

  const headings: TocHeading[] = [];

  visit(tree, "heading", (node: Heading) => {
    const id = (node.data?.hProperties as { id?: string } | undefined)?.id;
    if (!id) return;

    headings.push({ id, text: toString(node), level: node.depth });
  });

  return headings;
}
