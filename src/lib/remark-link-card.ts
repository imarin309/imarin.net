import { visit } from "unist-util-visit";
import type { Root, Paragraph, Parent } from "mdast";
import type { Plugin } from "unified";

interface OGPData {
  title: string;
  description: string;
  image: string;
  favicon: string;
}

async function fetchOGP(url: string): Promise<OGPData> {
  try {
    const domain = new URL(url).hostname;
    const favicon = `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; LinkCardBot/1.0)" },
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const html = await res.text();

    const getMetaContent = (property: string) => {
      const m =
        html.match(
          new RegExp(
            `<meta[^>]+(?:property|name)=["']${property}["'][^>]+content=["']([^"']*)["']`,
            "i",
          ),
        ) ||
        html.match(
          new RegExp(
            `<meta[^>]+content=["']([^"']*)["'][^>]+(?:property|name)=["']${property}["']`,
            "i",
          ),
        );
      return m?.[1] ?? "";
    };

    const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i);

    const rawImage = getMetaContent("og:image");
    const image = rawImage
      ? (() => {
          try {
            return new URL(rawImage, url).toString();
          } catch {
            return "";
          }
        })()
      : "";

    return {
      title: getMetaContent("og:title") || titleMatch?.[1] || url,
      description:
        getMetaContent("og:description") || getMetaContent("description") || "",
      image,
      favicon,
    };
  } catch {
    return { title: url, description: "", image: "", favicon: "" };
  }
}

const URL_REGEX = /^https?:\/\/\S+$/;

export const remarkLinkCard: Plugin<[], Root> = () => {
  return async (tree) => {
    const tasks: Array<{ parent: Parent; index: number; url: string }> = [];

    visit(tree, "paragraph", (node: Paragraph, index, parent) => {
      if (index === undefined || !parent) return;
      if (node.children.length !== 1) return;

      const child = node.children[0];
      let url: string | null = null;

      if (child.type === "link") {
        const linkText = child.children
          .map((c) => ("value" in c ? c.value : ""))
          .join("");
        if (linkText === child.url && URL_REGEX.test(child.url))
          url = child.url;
      } else if (child.type === "text" && URL_REGEX.test(child.value.trim())) {
        url = child.value.trim();
      }

      if (url) {
        tasks.push({ parent, index, url });
      }
    });

    const uniqueUrls = [...new Set(tasks.map((t) => t.url))];
    const CONCURRENCY = 5;
    const ogpCache = new Map<string, OGPData>();
    for (let i = 0; i < uniqueUrls.length; i += CONCURRENCY) {
      const chunk = uniqueUrls.slice(i, i + CONCURRENCY);
      const results = await Promise.all(chunk.map((url) => fetchOGP(url)));
      chunk.forEach((url, j) => ogpCache.set(url, results[j]));
    }

    for (const { parent, index, url } of tasks) {
      const ogp = ogpCache.get(url)!;
      parent.children[index] = {
        type: "mdxJsxFlowElement",
        name: "LinkCard",
        attributes: [
          { type: "mdxJsxAttribute", name: "url", value: url },
          { type: "mdxJsxAttribute", name: "title", value: ogp.title },
          {
            type: "mdxJsxAttribute",
            name: "description",
            value: ogp.description,
          },
          { type: "mdxJsxAttribute", name: "image", value: ogp.image },
          { type: "mdxJsxAttribute", name: "favicon", value: ogp.favicon },
        ],
        children: [],
      };
    }
  };
};
