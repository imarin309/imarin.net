import createMDX from "@next/mdx";
import remarkBreaks from "remark-breaks";
import remarkFrontmatter from "remark-frontmatter";
import remarkGfm from "remark-gfm";
import { remarkLinkCard } from "./src/lib/remark-link-card";

const withMDX = createMDX({
  options: {
    remarkPlugins: [remarkFrontmatter, remarkGfm, remarkBreaks, remarkLinkCard],
  },
});

export default withMDX({
  output: "export",
  images: { unoptimized: true },
  pageExtensions: ["js", "jsx", "ts", "tsx", "md", "mdx"],
});
