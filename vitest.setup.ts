import { vi } from "vitest";

// remark-link-card が記事内のURLに対して実際にOGP取得のfetchを行うため、
// テスト中に外部ネットワークへアクセスしないようスタブ化する
vi.stubGlobal(
  "fetch",
  vi.fn(
    async () =>
      new Response(
        `<html><head><title>Mock Title</title><meta property="og:title" content="Mock Title" /></head></html>`,
        { status: 200 },
      ),
  ),
);
