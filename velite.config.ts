import { defineConfig, defineCollection, s } from "velite";
import remarkBreaks from "remark-breaks";
import { remarkLinkCard } from "./src/lib/remark-link-card";

const pages = defineCollection({
  name: "Page",
  pattern: "pages/*.mdx",
  schema: s
    .object({
      title: s.string().max(100),
      description: s.string().max(300).optional(),
      date: s.isodate().optional(),
      slug: s.path(),
      content: s.mdx(),
    })
    .transform((data) => ({
      ...data,
      slug: data.slug.replace(/^pages\//, ""),
    })),
});

const posts = defineCollection({
  name: "Post",
  pattern: "posts/**/*.mdx",
  schema: s
    .object({
      title: s.string().max(100),
      description: s.string().max(300).optional(),
      date: s.isodate(),
      category: s.string(),
      slug: s.path(),
      raw: s.raw(),
      content: s.mdx(),
    })
    .transform((data) => ({
      ...data,
      slug: data.slug.replace(/^posts\//, ""),
      excerpt: data.raw
        .replace(/^---[\s\S]*?---\n?/, "") // frontmatter
        .replace(/```[\s\S]*?```/g, "") // コードブロック
        .replace(/`[^`]*`/g, "") // インラインコード
        .replace(/!\[.*?\]\(.*?\)/g, "") // 画像
        .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // リンク → テキストのみ
        .replace(/^#{1,6}\s+/gm, "") // 見出し
        .replace(/^[-*_]{3,}\s*$/gm, "") // 水平線
        .replace(/^[>*+-]\s+/gm, "") // blockquote・リスト記号
        .replace(/\*\*(.+?)\*\*/g, "$1") // bold
        .replace(/__(.+?)__/g, "$1")
        .replace(/\*(.+?)\*/g, "$1") // italic
        .replace(/_(.+?)_/g, "$1")
        .replace(/\n+/g, " ")
        .trim()
        .slice(0, 120),
    })),
});

export default defineConfig({
  root: "content",
  output: {
    data: ".velite",
    assets: "public/static",
    base: "/static/",
    name: "[name]-[hash:6].[ext]",
    clean: true,
  },
  collections: { posts, pages },
  mdx: {
    remarkPlugins: [remarkBreaks, remarkLinkCard],
    rehypePlugins: [],
  },
});
