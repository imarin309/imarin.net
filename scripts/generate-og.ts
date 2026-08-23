/**
 * 記事ごとのOGP画像（1200x630 PNG）と、サイト共通のOGP画像を生成する。
 *
 * 生成物は .og/ に出力するだけで、R2（asset.imarin.net）へのアップロードは手動。
 * アップロード先は og/ 配下で、ファイル名は .og/ の生成物とそのまま対応する。
 *
 *   pnpm og                    未生成のものだけ生成
 *   pnpm og --force            既存のPNGも作り直す
 *   pnpm og poyote site        slug（サイト共通は site）を指定して生成
 *
 * frontmatter に ogImage を書いた記事は手動指定を優先するためスキップする。
 *
 * Next のビルドとは独立させたいので next/og を直接使う（追加の依存はない）。
 * node の型ストリップで動かすため、ローカルの import は拡張子つき、JSXは使わない。
 */
import fs from "node:fs";
import path from "node:path";
import type { ReactElement } from "react";
import { ImageResponse } from "next/og.js";
import { getAllPosts, type Post } from "../src/lib/posts.ts";
import { OG_IMAGE_SIZE, SITE_OG_IMAGE_NAME } from "../src/lib/og.ts";
import { SITE_CATCHCOPY, SITE_TITLE, SITE_URL } from "../src/constants/meta.ts";

const OUT_DIR = path.join(process.cwd(), ".og");
const FONT_DIR = path.join(process.cwd(), ".fonts");
const SITE_DOMAIN = SITE_URL.replace("https://", "");

// satori はシステムフォントを見ないためフォントファイルを渡す必要がある。
// woff2 は非対応なので OTF を使う。gitignore してあり、無ければ都度取得する。
const FONTS = [
  {
    weight: 400 as const,
    file: "NotoSansJP-Regular.otf",
    url: "https://raw.githubusercontent.com/notofonts/noto-cjk/main/Sans/SubsetOTF/JP/NotoSansJP-Regular.otf",
  },
  {
    weight: 700 as const,
    file: "NotoSansJP-Bold.otf",
    url: "https://raw.githubusercontent.com/notofonts/noto-cjk/main/Sans/SubsetOTF/JP/NotoSansJP-Bold.otf",
  },
];

const COLOR = {
  bg: "#fafafa", // zinc-50
  card: "#ffffff",
  border: "#e4e4e7", // zinc-200
  accent: "#18181b", // zinc-900
  title: "#18181b", // zinc-900
  chipBg: "#f4f4f5", // zinc-100
  chipText: "#3f3f46", // zinc-700
  muted: "#71717a", // zinc-500
};

// satori に渡す要素ツリー。JSXを使わないので手で組む。
type OgNode = {
  type: string;
  props: {
    style?: Record<string, string | number>;
    children?: OgNode | OgNode[] | string;
    src?: string;
    width?: number;
    height?: number;
  };
};

function div(
  style: Record<string, string | number>,
  children?: OgNode | OgNode[] | string,
): OgNode {
  // satori のデフォルトは display:flex だが、意図を明示しておく
  return {
    type: "div",
    props: { style: { display: "flex", ...style }, children },
  };
}

// satori は外部URLを読みに行けないので data URI で埋め込む
function icon(size: number): OgNode {
  const png = fs.readFileSync(path.join(process.cwd(), "public/ahiru.png"));
  const src = `data:image/png;base64,${png.toString("base64")}`;

  return { type: "img", props: { src, width: size, height: size } };
}

// タイトル左に置くアイコン。ヘッダーのロゴと同じ ahiru.png を使う
const ICON_SIZE = 96;
const ICON_GAP = 28;

// カード内側の余白とアイコンを引いたタイトルの表示幅。
// 見積もりを外して溢れないよう少し余裕をみる
const TITLE_WIDTH = (1200 - 40 * 2 - 72 * 2 - ICON_SIZE - ICON_GAP) * 0.95;
const TITLE_LINE_HEIGHT = 1.45;
const TITLE_MAX_HEIGHT = 290;
const TITLE_FONT_SIZES = [68, 64, 60, 56, 52, 48, 44, 40];

// 全角は1em、半角はおよそ0.55emとして、タイトルの横幅をem単位で見積もる
function textWidthEm(text: string): number {
  return [...text].reduce(
    (sum, char) => sum + (/[ -~]/.test(char) ? 0.55 : 1),
    0,
  );
}

// 「1文字だけ次の行に落ちる」のを避けたいので、行数が最小になるサイズの中から
// 最大のものを選ぶ（サイズ優先で選ぶと大きい文字で余計に折り返してしまう）
function titleFontSize(title: string): number {
  const width = textWidthEm(title);

  const candidates = TITLE_FONT_SIZES.map((size) => ({
    size,
    lines: Math.max(1, Math.ceil((width * size) / TITLE_WIDTH)),
  })).filter(
    ({ size, lines }) => lines * size * TITLE_LINE_HEIGHT <= TITLE_MAX_HEIGHT,
  );

  const best = candidates.reduce(
    (a, b) =>
      b.lines < a.lines || (b.lines === a.lines && b.size > a.size) ? b : a,
    { size: TITLE_FONT_SIZES[TITLE_FONT_SIZES.length - 1], lines: Infinity },
  );

  return best.size;
}

// ヘッダー / タイトル / フッターを上下に振り分けたカード
function card(header: OgNode, title: OgNode, footer: OgNode): OgNode {
  return div(
    {
      width: "100%",
      height: "100%",
      padding: 40,
      backgroundColor: COLOR.bg,
    },
    div(
      {
        flex: 1,
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "60px 72px",
        backgroundColor: COLOR.card,
        border: `1px solid ${COLOR.border}`,
        borderTop: `10px solid ${COLOR.accent}`,
        borderRadius: 24,
      },
      [header, title, footer],
    ),
  );
}

function postTemplate(post: Post): OgNode {
  return card(
    div({}, [
      div(
        {
          padding: "10px 24px",
          backgroundColor: COLOR.chipBg,
          color: COLOR.chipText,
          borderRadius: 999,
          fontSize: 26,
          fontWeight: 400,
        },
        post.category,
      ),
    ]),
    div({ alignItems: "center", gap: ICON_GAP, padding: "32px 0" }, [
      icon(ICON_SIZE),
      div(
        {
          flex: 1,
          fontSize: titleFontSize(post.title),
          fontWeight: 700,
          color: COLOR.title,
          lineHeight: TITLE_LINE_HEIGHT,
        },
        post.title,
      ),
    ]),
    div({ alignItems: "baseline", gap: 20 }, [
      div({ fontSize: 34, fontWeight: 700, color: COLOR.accent }, SITE_TITLE),
      div({ fontSize: 24, fontWeight: 400, color: COLOR.muted }, SITE_DOMAIN),
    ]),
  );
}

// トップページと固定ページで使うサイト共通のOGP画像
function siteTemplate(): OgNode {
  return card(
    div({}),
    div({ alignItems: "center", gap: ICON_GAP, padding: "24px 0" }, [
      icon(ICON_SIZE),
      div({ flexDirection: "column" }, [
        div({ fontSize: 76, fontWeight: 700, color: COLOR.title }, SITE_TITLE),
        div(
          {
            fontSize: 30,
            fontWeight: 400,
            color: COLOR.chipText,
            paddingTop: 20,
            lineHeight: TITLE_LINE_HEIGHT,
          },
          SITE_CATCHCOPY,
        ),
      ]),
    ]),
    div({ fontSize: 24, fontWeight: 400, color: COLOR.muted }, SITE_DOMAIN),
  );
}

async function loadFonts() {
  fs.mkdirSync(FONT_DIR, { recursive: true });

  return Promise.all(
    FONTS.map(async ({ weight, file, url }) => {
      const filepath = path.join(FONT_DIR, file);

      if (!fs.existsSync(filepath)) {
        console.log(`フォントを取得: ${file}`);
        const res = await fetch(url);
        if (!res.ok) {
          throw new Error(
            `フォントの取得に失敗しました (${res.status}): ${url}`,
          );
        }
        fs.writeFileSync(filepath, Buffer.from(await res.arrayBuffer()));
      }

      return {
        name: "Noto Sans JP",
        data: fs.readFileSync(filepath),
        weight,
        style: "normal" as const,
      };
    }),
  );
}

async function main() {
  const args = process.argv.slice(2);
  const force = args.includes("--force");
  const names = args.filter((arg) => !arg.startsWith("--"));

  const posts = getAllPosts();
  const targets: { name: string; node: OgNode; skip?: string }[] = [
    ...posts.map((post) => ({
      name: post.slug,
      node: postTemplate(post),
      skip: post.ogImage ? "frontmatter の ogImage を使用" : undefined,
    })),
    { name: SITE_OG_IMAGE_NAME, node: siteTemplate() },
  ].filter((target) => names.length === 0 || names.includes(target.name));

  const unknown = names.filter(
    (name) => !targets.some((target) => target.name === name),
  );
  if (unknown.length > 0) {
    throw new Error(`該当する記事がありません: ${unknown.join(", ")}`);
  }

  fs.mkdirSync(OUT_DIR, { recursive: true });
  const fonts = await loadFonts();

  for (const { name, node, skip } of targets) {
    const filepath = path.join(OUT_DIR, `${name}.png`);

    if (skip) {
      console.log(`skip   ${name} (${skip})`);
      continue;
    }
    if (fs.existsSync(filepath) && !force) {
      console.log(`skip   ${name} (生成済み。作り直すなら --force)`);
      continue;
    }

    const image = new ImageResponse(node as unknown as ReactElement, {
      ...OG_IMAGE_SIZE,
      fonts,
    });
    fs.writeFileSync(filepath, Buffer.from(await image.arrayBuffer()));
    console.log(`create ${path.relative(process.cwd(), filepath)}`);
  }

  console.log(
    [
      "",
      ".og/ の画像をR2（asset.imarin.net）の og/ にそのままアップロードしてください。",
      "デプロイより先に済ませてください（Xは取得結果をキャッシュするため）。",
    ].join("\n"),
  );
}

await main();
