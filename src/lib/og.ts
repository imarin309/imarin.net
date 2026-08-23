// 記事のOGP画像。frontmatter に ogImage があればそれを、無ければ
// scripts/generate-og.ts が生成してR2に置く規約上のURLを使う。
//
// このファイルは scripts/ からも直接読み込むため、"@/..." エイリアスではなく
// 拡張子つきの相対パスで import している（node がそのまま解決できるように）。
import { ASSET_URL } from "../constants/meta.ts";
import type { Post } from "./posts.ts";

export const OG_IMAGE_SIZE = { width: 1200, height: 630 };

// R2 側のOGP画像の置き場。ファイル名は .og/ の生成物とそのまま対応する
const OG_IMAGE_DIR = `${ASSET_URL}/og`;
export const SITE_OG_IMAGE_NAME = "site";

export type OgImage = {
  url: string;
  width?: number;
  height?: number;
};

// トップページと固定ページで使うサイト共通のOGP画像
export const SITE_OG_IMAGE: OgImage = {
  url: `${OG_IMAGE_DIR}/${SITE_OG_IMAGE_NAME}.png`,
  ...OG_IMAGE_SIZE,
};

export function getOgImage(post: Pick<Post, "slug" | "ogImage">): OgImage {
  // 手動で指定された画像はサイズが分からないので url だけ返す
  if (post.ogImage) return { url: post.ogImage };

  return { url: `${OG_IMAGE_DIR}/${post.slug}.png`, ...OG_IMAGE_SIZE };
}
