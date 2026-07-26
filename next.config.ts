import createMDX from "@next/mdx";
import { remarkPlugins } from "./src/lib/mdx-plugins";

const withMDX = createMDX({
  options: { remarkPlugins },
});

export default withMDX({
  output: "export",
  images: { unoptimized: true },
  pageExtensions: ["js", "jsx", "ts", "tsx", "md", "mdx"],
});
