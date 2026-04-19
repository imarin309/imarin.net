import fs from "fs";
import path from "path";
import matter from "gray-matter";

export type Post = {
  slug: string;
  title: string;
  date: string;
  category: string;
  description?: string;
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

function parsePost(filename: string): Post {
  const slug = filename.replace(/\.mdx$/, "");
  const raw = fs.readFileSync(path.join(postsDir, filename), "utf-8");
  const { data, content } = matter(raw);
  const excerpt = content.trim().slice(0, 120);

  const title = String(data.title ?? "");
  const date = normalizeDate(data.date);
  const category = String(data.category ?? "");

  if (!title) throw new Error(`[${filename}] frontmatter に title が必要です`);
  if (!category) throw new Error(`[${filename}] frontmatter に category が必要です`);
  if (!date || isNaN(new Date(date).getTime()))
    throw new Error(`[${filename}] frontmatter の date が不正です: "${data.date}"`);

  return {
    slug,
    title,
    date,
    category,
    description: data.description ? String(data.description) : undefined,
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
  const filename = `${slug}.mdx`;
  const filepath = path.join(postsDir, filename);
  // 念の為ディレクトリトラバーサルを防ぐため、postsDir 配下に収まっているか確認
  if (!filepath.startsWith(postsDir + path.sep)) return undefined;
  if (!fs.existsSync(filepath)) return undefined;
  return parsePost(filename);
}

export function getAllPages(): Page[] {
  const files = fs.readdirSync(pagesDir).filter((f) => f.endsWith(".mdx"));
  return files.map(parsePage);
}

export function getPageBySlug(slug: string): Page | undefined {
  const filename = `${slug}.mdx`;
  const filepath = path.join(pagesDir, filename);
  // 念の為ディレクトリトラバーサルを防ぐため、pagesDir 配下に収まっているか確認
  if (!filepath.startsWith(pagesDir + path.sep)) return undefined;
  if (!fs.existsSync(filepath)) return undefined;
  return parsePage(filename);
}
