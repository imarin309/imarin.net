import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeAll, describe, expect, it } from "vitest";
import { TableOfContents } from "@/components/TableOfContents";

// jsdom は IntersectionObserver を持たないため、最低限のスタブを用意する
beforeAll(() => {
  class IntersectionObserverStub {
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords() {
      return [];
    }
  }

  Object.defineProperty(globalThis, "IntersectionObserver", {
    writable: true,
    value: IntersectionObserverStub,
  });
});

afterEach(() => {
  cleanup();
  document.body.innerHTML = "";
  document.body.style.overflow = "";
});

function renderArticle(html: string) {
  const article = document.createElement("article");
  article.innerHTML = html;
  document.body.appendChild(article);

  return render(<TableOfContents />);
}

describe("TableOfContents", () => {
  it("collects headings marked with data-toc-heading", () => {
    renderArticle(`
      <h2 id="はじめに" data-toc-heading="2" data-toc-text="はじめに">はじめに</h2>
      <h3 id="前提" data-toc-heading="3" data-toc-text="前提">前提</h3>
      <h2 id="おわり" data-toc-heading="2" data-toc-text="おわり">おわり</h2>
    `);

    expect(
      screen.getAllByRole("link").map((link) => link.getAttribute("href")),
    ).toEqual(["#はじめに", "#前提", "#おわり"]);
  });

  it("indents by heading level", () => {
    renderArticle(`
      <h2 id="a" data-toc-heading="2" data-toc-text="A">A</h2>
      <h3 id="b" data-toc-heading="3" data-toc-text="B">B</h3>
      <h4 id="c" data-toc-heading="4" data-toc-text="C">C</h4>
    `);

    expect(
      screen.getByRole("link", { name: "A" }).closest("li")?.className,
    ).toBe("");
    expect(
      screen.getByRole("link", { name: "B" }).closest("li")?.className,
    ).toContain("pl-3");
    expect(
      screen.getByRole("link", { name: "C" }).closest("li")?.className,
    ).toContain("pl-6");
  });

  it("renders nothing when the article has fewer than two headings", () => {
    const { container } = renderArticle(`
      <h2 id="a" data-toc-heading="2" data-toc-text="A">A</h2>
    `);

    expect(container.innerHTML).toBe("");
  });

  it("ignores headings outside of article", () => {
    const heading = document.createElement("h2");
    heading.id = "外";
    heading.dataset.tocHeading = "2";
    heading.dataset.tocText = "外";
    document.body.appendChild(heading);

    const { container } = renderArticle(`
      <h2 id="a" data-toc-heading="2" data-toc-text="A">A</h2>
    `);

    expect(container.innerHTML).toBe("");
  });

  describe("ボトムシート", () => {
    function openSheet() {
      renderArticle(`
        <h2 id="a" data-toc-heading="2" data-toc-text="A">A</h2>
        <h2 id="b" data-toc-heading="2" data-toc-text="B">B</h2>
      `);
      fireEvent.click(screen.getByRole("button", { name: "目次を開く" }));
    }

    it("Escape で閉じる", () => {
      openSheet();
      expect(screen.getByRole("button", { name: "目次を閉じる" })).toBeTruthy();

      fireEvent.keyDown(document, { key: "Escape" });

      expect(screen.queryByRole("button", { name: "目次を閉じる" })).toBeNull();
    });

    it("開いている間だけ背面スクロールを止め、元の値に戻す", () => {
      document.body.style.overflow = "auto";

      openSheet();
      expect(document.body.style.overflow).toBe("hidden");

      fireEvent.keyDown(document, { key: "Escape" });
      expect(document.body.style.overflow).toBe("auto");
    });

    it("閉じているときは body の overflow に触らない", () => {
      document.body.style.overflow = "auto";

      renderArticle(`
        <h2 id="a" data-toc-heading="2" data-toc-text="A">A</h2>
        <h2 id="b" data-toc-heading="2" data-toc-text="B">B</h2>
      `);

      expect(document.body.style.overflow).toBe("auto");
    });
  });
});
