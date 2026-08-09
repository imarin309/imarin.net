export type Work = {
  title: string;
  description: string;
  category: string;
  url?: string;
  github?: string;
  tags: string[];
  relatedPostSlugs?: string[] | null;
};

export const works: Work[] = [
  {
    title: "ぽよりろぐ",
    description: "このブログ自体。Next.js + MDXで構築した個人ブログ。",
    category: "ブログ",
    url: "https://imarin.net",
    github: "https://github.com/imarin309/imarin.net",
    tags: ["Next.js", "TypeScript", "Tailwind CSS"],
  },
  {
    title: "seki-saki.com",
    description: "イラストレーターのポートフォリオサイト",
    category: "ポートフォリオサイト",
    url: "https://seki-saki.com/",
    github: "https://github.com/imarin309/seki-saki.com",
    tags: ["Next.js", "TypeScript", "Tailwind CSS"],
    relatedPostSlugs: ["make_contact_form"],
  },
  {
    title: "calm-corner.com",
    description: "趣味のプラモデルについて制作物や制作手法などを公開するブログ",
    category: "ブログ",
    url: "https://calm-corner.com/",
    github: "https://github.com/imarin309/calm_corner.com",
    tags: ["Next.js", "TypeScript", "Tailwind CSS"],
    relatedPostSlugs: ["migration_from_wordpress"],
  },
  {
    title: "now-imarin.com",
    description: "アニメ、ゲームの感想記事を書くブログ",
    category: "ブログ",
    url: "https://now-imarin.com/",
    github: "https://github.com/imarin309/now-imarin.com",
    tags: ["Next.js", "TypeScript", "Tailwind CSS"],
  },
  {
    title: "nanoka",
    description: "PWA向けに設計したメモを書くアプリ",
    category: "ツール",
    url: "https://nanoka.imarin.net/",
    github: "https://github.com/imarin309/nanoka",
    tags: ["React", "TypeScript", "Tailwind CSS", "Vite"],
  },
  {
    title: "poyote",
    description: "動画から画像を抽出するツール",
    category: "ツール",
    url: "https://poyote.imarin.net/",
    github: "https://github.com/imarin309/poyote",
    tags: ["React", "TypeScript", "Tailwind CSS", "Vite"],
    relatedPostSlugs: ["poyote"],
  },
  {
    title: "Matoriko",
    description: "日記やメッセージカードなどの雑多なメモアプリ",
    category: "ツール",
    url: "https://matoriko.imarin.net/",
    github: "https://github.com/imarin309/Matoriko",
    tags: ["React", "TypeScript", "Tailwind CSS", "Vite"],
  },
];
