import remarkBreaks from "remark-breaks";
import remarkDirective from "remark-directive";
import remarkFrontmatter from "remark-frontmatter";
import remarkGfm from "remark-gfm";
import { remarkLinkCard } from "./remark-link-card";
import { remarkTextSize } from "./remark-text-size";

export const remarkPlugins = [
  remarkFrontmatter,
  remarkGfm,
  remarkBreaks,
  remarkDirective,
  remarkTextSize,
  remarkLinkCard,
];
