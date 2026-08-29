import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { ArticleToc } from "@/components/ArticleToc";
import type { TocHeading } from "@/lib/toc";

afterEach(cleanup);

const headings: TocHeading[] = [
  { id: "はじめに", text: "はじめに", level: 2 },
  { id: "前提", text: "前提", level: 3 },
  { id: "補足", text: "補足", level: 4 },
];

describe("ArticleToc", () => {
  it("見出しへのリンクを順番どおりに並べる", () => {
    render(<ArticleToc headings={headings} />);

    expect(
      screen.getAllByRole("link").map((link) => link.getAttribute("href")),
    ).toEqual(["#はじめに", "#前提", "#補足"]);
  });

  it("見出しレベルに応じて字下げする", () => {
    render(<ArticleToc headings={headings} />);

    const indent = (name: string) =>
      screen.getByRole("link", { name }).closest("li")?.className;

    expect(indent("はじめに")).toBe("");
    expect(indent("前提")).toContain("pl-4");
    expect(indent("補足")).toContain("pl-8");
  });

  it("見出しが1つ以下なら表示しない", () => {
    const { container } = render(
      <ArticleToc headings={headings.slice(0, 1)} />,
    );

    expect(container.innerHTML).toBe("");
  });

  // xl 以上では TableOfContents の追従パネルが常時見えているため、
  // 先頭の目次と二重にならないよう隠す
  it("追従パネルが出るデスクトップ幅では隠れる", () => {
    render(<ArticleToc headings={headings} />);

    expect(screen.getByRole("navigation").className).toContain("xl:hidden");
  });
});
