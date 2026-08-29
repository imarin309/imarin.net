import { describe, expect, it } from "vitest";
import { createElement } from "react";
import { extractText, toSlug } from "@/lib/heading";

describe("extractText", () => {
  it("returns strings and numbers as-is", () => {
    expect(extractText("見出し")).toBe("見出し");
    expect(extractText(2024)).toBe("2024");
  });

  it("joins array children", () => {
    expect(extractText(["Next.js", " ", "16"])).toBe("Next.js 16");
  });

  it("digs into nested elements", () => {
    const children = createElement(
      "strong",
      null,
      createElement("code", null, "cn()"),
      " の使い方",
    );

    expect(extractText(children)).toBe("cn() の使い方");
  });

  it("ignores null and undefined", () => {
    expect(extractText(null)).toBe("");
    expect(extractText(undefined)).toBe("");
  });
});

describe("toSlug", () => {
  it("keeps Japanese text and replaces spaces with hyphens", () => {
    expect(toSlug("目次を 追加する")).toBe("目次を-追加する");
  });

  it("drops characters that break URL fragments", () => {
    expect(toSlug('a<b>c"d#e?f%g')).toBe("abcdefg");
  });

  it("collapses repeated hyphens and trims edges", () => {
    expect(toSlug("  Next.js   16  ")).toBe("Next.js-16");
    expect(toSlug("- foo -")).toBe("foo");
  });
});
