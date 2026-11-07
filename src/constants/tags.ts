export type Tag = {
  slug: string;
  label: string;
};

// slug はURL（/tag/ + slug）になる。静的エクスポートで日本語やスペースを
// ファイル名にするとエンコードで壊れやすいため、ASCIIの小文字とハイフンだけにする
export const tagList: Tag[] = [
  { slug: "cloudflare-workers", label: "Cloudflare Workers" },
  { slug: "cloudflare-pages", label: "Cloudflare Pages" },
  { slug: "turnstile", label: "Turnstile" },
  { slug: "nextjs", label: "Next.js" },
  { slug: "react", label: "React" },
  { slug: "typescript", label: "TypeScript" },
  { slug: "vite", label: "Vite" },
  { slug: "phaser", label: "Phaser" },
  { slug: "mdx", label: "MDX" },
  { slug: "claude-code", label: "Claude Code" },
  { slug: "generative-ai", label: "生成AI" },
  { slug: "web-design", label: "Webデザイン" },
  { slug: "cbt", label: "認知行動療法" },
  { slug: "job-change", label: "転職" },
];
