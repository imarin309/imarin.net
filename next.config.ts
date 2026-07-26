import createMDX from "@next/mdx";
import remarkBreaks from "remark-breaks";
import remarkDirective from "remark-directive";
import remarkFrontmatter from "remark-frontmatter";
import remarkGfm from "remark-gfm";
import { remarkLinkCard } from "./src/lib/remark-link-card";
import { remarkTextSize } from "./src/lib/remark-text-size";

const withMDX = createMDX({
  options: {
    remarkPlugins: [
      remarkFrontmatter,
      remarkGfm,
      remarkBreaks,
      remarkDirective,
      remarkTextSize,
      remarkLinkCard,
    ],
  },
});

export default withMDX({
  output: "export",
  images: { unoptimized: true },
  pageExtensions: ["js", "jsx", "ts", "tsx", "md", "mdx"],
});
