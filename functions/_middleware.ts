import { SITE_URL } from "../src/constants/meta";

export async function onRequest(context: {
  request: Request;
  next: () => Promise<Response>;
}) {
  const url = new URL(context.request.url);

  // *.pages.dev（プレビューデプロイを除く）を imarin.net にリダイレクト
  // プレビューURLは <hash>.<project>.pages.dev の形式（4セグメント）
  // 本番の pages.dev URL は <project>.pages.dev（3セグメント）
  const parts = url.hostname.split(".");
  if (parts.length === 3 && url.hostname.endsWith(".pages.dev")) {
    const redirectUrl = new URL(SITE_URL);
    redirectUrl.pathname = url.pathname;
    redirectUrl.search = url.search;
    return Response.redirect(redirectUrl.toString(), 308);
  }

  return context.next();
}
