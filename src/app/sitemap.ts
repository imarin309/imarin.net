import type { MetadataRoute } from "next";
import { getAllPosts, getAllPages, getUsedTags } from "@/lib/posts";
import { SITE_URL } from "@/constants/meta";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts();
  const pages = getAllPages();

  const postEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${SITE_URL}/post/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const pageEntries: MetadataRoute.Sitemap = pages.map((page) => ({
    url: `${SITE_URL}/${page.slug}`,
    changeFrequency: "yearly",
    priority: 0.5,
  }));

  const tagEntries: MetadataRoute.Sitemap = getUsedTags().map((tag) => ({
    url: `${SITE_URL}/tag/${tag.slug}`,
    changeFrequency: "weekly",
    priority: 0.3,
  }));

  return [
    {
      url: SITE_URL,
      changeFrequency: "daily",
      priority: 1,
    },
    ...pageEntries,
    ...postEntries,
    ...tagEntries,
  ];
}
