import { defineConfig, defineCollection, s } from "velite";
import remarkBreaks from "remark-breaks";

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
      content: s.mdx(),
    })
    .transform((data) => ({
      ...data,
      slug: data.slug.replace(/^posts\//, ""),
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
    remarkPlugins: [remarkBreaks],
    rehypePlugins: [],
  },
});
