import { visit } from "unist-util-visit";
import { toString } from "mdast-util-to-string";
import type { Heading, Root } from "mdast";
import { toSlug } from "./heading";

/**
 * 見出し（h2〜h4）にアンカー用の id を付与する。
 *
 * id は見出しテキストから生成するため、同じ見出しが複数ある記事だと
 * 衝突してしまう。ドキュメント全体を見渡せる remark の段階で連番の
 * サフィックスを付けて一意化する（2つ目以降が `-2`, `-3` …）。
 *
 * 生成した id は hProperties 経由で h2/h3/h4 コンポーネントに props として
 * 渡り、コンポーネント側が計算する id を上書きする。
 */
export function remarkHeadingId() {
  return (tree: Root) => {
    const usedIds = new Map<string, number>();

    visit(tree, "heading", (node: Heading) => {
      if (node.depth < 2 || node.depth > 4) return;

      const slug = toSlug(toString(node));
      if (!slug) return;

      const count = usedIds.get(slug) ?? 0;
      usedIds.set(slug, count + 1);

      const data = node.data || (node.data = {});
      data.hProperties = {
        ...data.hProperties,
        id: count === 0 ? slug : `${slug}-${count + 1}`,
      };
    });
  };
}
