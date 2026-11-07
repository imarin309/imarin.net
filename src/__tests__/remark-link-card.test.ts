import { describe, expect, it } from "vitest";
import { getTweetId } from "@/lib/remark-link-card";

describe("getTweetId", () => {
  it.each([
    "https://x.com/imarin309/status/2116883479615197443",
    "https://x.com/imarin309/status/2116883479615197443?a=bhP7dEW3o8JKaaoEOeA&s=20",
    "https://twitter.com/imarin309/status/2116883479615197443",
    "https://mobile.twitter.com/imarin309/status/2116883479615197443",
  ])("extracts the post id from %s", (url) => {
    expect(getTweetId(url)).toBe("2116883479615197443");
  });

  it.each([
    "https://x.com/imarin309",
    "https://example.com/imarin309/status/2116883479615197443",
    "https://notx.com/imarin309/status/2116883479615197443",
  ])("returns null for %s", (url) => {
    expect(getTweetId(url)).toBeNull();
  });
});
