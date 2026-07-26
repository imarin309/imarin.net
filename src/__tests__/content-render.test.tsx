import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { mdxComponents } from "@/components/mdx";
import { getAllPages, getAllPosts } from "@/lib/posts";

afterEach(cleanup);

describe("MDX content rendering", () => {
  const posts = getAllPosts();
  const pages = getAllPages();

  it("finds posts and pages to verify", () => {
    expect(posts.length).toBeGreaterThan(0);
    expect(pages.length).toBeGreaterThan(0);
  });

  it.each(posts.map((post) => post.slug))(
    "renders post/%s without throwing",
    async (slug) => {
      const { default: PostContent } = await import(
        `../../content/posts/${slug}.mdx`
      );

      expect(() =>
        render(<PostContent components={mdxComponents} />),
      ).not.toThrow();
    },
  );

  it.each(pages.map((page) => page.slug))(
    "renders page/%s without throwing",
    async (slug) => {
      const { default: PageContent } = await import(
        `../../content/pages/${slug}.mdx`
      );

      expect(() =>
        render(<PageContent components={mdxComponents} />),
      ).not.toThrow();
    },
  );
});
