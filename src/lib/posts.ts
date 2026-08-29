import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { extractHeadings, type TocHeading } from "./toc";

export type Post = {
  slug: string;
  title: string;
  date: string;
  category: string;
  description?: string;
  // OGP画像を自動生成分から差し替えたいときだけ frontmatter に書く（任意）
  ogImage?: string;
  excerpt: string;
};

export type Page = {
  slug: string;
  title: string;
  description?: string;
};

const postsDir = path.join(process.cwd(), "content/posts");
const pagesDir = path.join(process.cwd(), "content/pages");

// gray-matter は YAML の日付をDate型で返すことがあるため YYYY-MM-DD に正規化する
function normalizeDate(value: unknown): string {
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  return String(value ?? "");
}

// 記事一覧カードの抜粋用に、Markdown記法を取り除いた本文だけのテキストに変換する
function markdownToPlainText(markdown: string): string {
  let text = markdown;

  text = text.replace(/```[\s\S]*?```/g, ""); // コードブロック
  text = text.replace(/`([^`]*)`/g, "$1"); // インラインコード
  text = text.replace(/!\[[^\]]*\]\([^)]*\)/g, ""); // 画像
  text = text.replace(/\[([^\]]*)\]\([^)]*\)/g, "$1"); // リンク
  text = text.replace(/^https?:\/\/\S+$/gm, ""); // LinkCard化される裸のURL行
  text = text.replace(/<[^>]+>/g, ""); // JSX/HTMLタグ
  text = text.replace(/:{1,2}[a-z]+\[([^\]]*)\]/gi, "$1"); // remark-directiveのインライン/リーフ記法
  text = text.replace(/^:::.*$/gm, ""); // remark-directiveのブロック記法
  text = text.replace(/^#{1,6}\s+.*$/gm, ""); // 見出し行ごと除去
  text = text.replace(/^>\s?/gm, ""); // 引用記号
  text = text.replace(/^\s*([-*+]|\d+\.)\s+/gm, ""); // リスト記号
  text = text.replace(/^(-{3,}|\*{3,}|_{3,})$/gm, ""); // 水平線
  text = text.replace(/(\*\*|__)(.*?)\1/g, "$2"); // 強調
  text = text.replace(/(\*|_)(.*?)\1/g, "$2"); // 強調
  text = text.replace(/~~(.*?)~~/g, "$1"); // 打ち消し線

  return text.replace(/\s+/g, " ").trim();
}

// 念の為ディレクトリトラバーサルを防ぐため、想定ディレクトリ配下に
// 収まっているファイルだけを返す
function resolveContentFile(dir: string, slug: string): string | undefined {
  const filepath = path.join(dir, `${slug}.mdx`);
  if (!filepath.startsWith(dir + path.sep)) return undefined;
  if (!fs.existsSync(filepath)) return undefined;
  return filepath;
}

function parsePost(filename: string): Post {
  const slug = filename.replace(/\.mdx$/, "");
  const raw = fs.readFileSync(path.join(postsDir, filename), "utf-8");
  const { data, content } = matter(raw);
  const excerpt = markdownToPlainText(content).slice(0, 120);

  const title = String(data.title ?? "");
  const date = normalizeDate(data.date);
  const category = String(data.category ?? "");

  if (!title) throw new Error(`[${filename}] frontmatter に title が必要です`);
  if (!category)
    throw new Error(`[${filename}] frontmatter に category が必要です`);
  if (!date || isNaN(new Date(date).getTime()))
    throw new Error(
      `[${filename}] frontmatter の date が不正です: "${data.date}"`,
    );

  return {
    slug,
    title,
    date,
    category,
    description: data.description ? String(data.description) : undefined,
    ogImage: data.ogImage ? String(data.ogImage) : undefined,
    excerpt,
  };
}

function parsePage(filename: string): Page {
  const slug = filename.replace(/\.mdx$/, "");
  const raw = fs.readFileSync(path.join(pagesDir, filename), "utf-8");
  const { data } = matter(raw);

  const title = String(data.title ?? "");
  if (!title) throw new Error(`[${filename}] frontmatter に title が必要です`);

  return {
    slug,
    title,
    description: data.description ? String(data.description) : undefined,
  };
}

export function getAllPosts(): Post[] {
  const files = fs.readdirSync(postsDir).filter((f) => f.endsWith(".mdx"));
  return files.map(parsePost);
}

export function getPostBySlug(slug: string): Post | undefined {
  if (!resolveContentFile(postsDir, slug)) return undefined;
  return parsePost(`${slug}.mdx`);
}

// 記事先頭に置く目次用。見出しはビルド時に本文から抜き出す
export function getPostHeadings(slug: string): TocHeading[] {
  const filepath = resolveContentFile(postsDir, slug);
  if (!filepath) return [];

  const { content } = matter(fs.readFileSync(filepath, "utf-8"));
  return extractHeadings(content);
}

export function getAllPages(): Page[] {
  const files = fs.readdirSync(pagesDir).filter((f) => f.endsWith(".mdx"));
  return files.map(parsePage);
}

export function getPageBySlug(slug: string): Page | undefined {
  if (!resolveContentFile(pagesDir, slug)) return undefined;
  return parsePage(`${slug}.mdx`);
}
