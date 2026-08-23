import { visit } from "unist-util-visit";
import type { Root } from "mdast";
import type { LeafDirective, TextDirective } from "mdast-util-directive";

/**
 * 出典表記のディレクティブ。
 *
 * `::cite[出典]` を独立した行に置くと `<cite>` としてレンダリングされる。
 * 引用ブロックの中で使う場合は、引用文との間に `>` だけの行を挟む。
 *
 * ```md
 * > 引用文
 * >
 * > ::cite[書籍名 紹介文抜粋]
 * ```
 */
export function remarkCite() {
  return (tree: Root) => {
    visit(tree, (node) => {
      if (node.type !== "leafDirective" && node.type !== "textDirective")
        return;

      const directive = node as LeafDirective | TextDirective;
      if (directive.name !== "cite") return;

      const data = directive.data || (directive.data = {});

      data.hName = "cite";
      data.hProperties = {
        ...data.hProperties,
        className: ["directive-cite"],
      };
    });
  };
}
