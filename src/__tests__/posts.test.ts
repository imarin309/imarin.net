import fs from "fs";
import path from "path";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  getAllPages,
  getAllPosts,
  getPageBySlug,
  getPostBySlug,
} from "@/lib/posts";

vi.mock("fs", () => ({
  default: {
    readdirSync: vi.fn(),
    readFileSync: vi.fn(),
    existsSync: vi.fn(),
  },
}));

const mockFs = vi.mocked(fs, true);

const postsDir = path.join(process.cwd(), "content/posts");
const pagesDir = path.join(process.cwd(), "content/pages");

beforeEach(() => {
  vi.resetAllMocks();
});

describe("getAllPosts", () => {
  it("parses frontmatter and derives the slug from the filename", () => {
    mockFs.readdirSync.mockReturnValue(["hello-world.mdx"] as never);
    mockFs.readFileSync.mockReturnValue(
      "---\ntitle: Hello\ndate: 2024-01-01\ncategory: tech\n---\nbody text here",
    );

    expect(getAllPosts()).toEqual([
      {
        slug: "hello-world",
        title: "Hello",
        date: "2024-01-01",
        category: "tech",
        description: undefined,
        excerpt: "body text here",
      },
    ]);
  });

  it("normalizes a YAML Date value to YYYY-MM-DD", () => {
    mockFs.readdirSync.mockReturnValue(["hello-world.mdx"] as never);
    // クォートなしの日付はgray-matterがDate型として解釈することがある
    mockFs.readFileSync.mockReturnValue(
      "---\ntitle: Hello\ndate: 2024-01-01\ncategory: tech\n---\nbody",
    );

    expect(getAllPosts()[0].date).toBe("2024-01-01");
  });

  it("throws when title is missing", () => {
    mockFs.readdirSync.mockReturnValue(["broken.mdx"] as never);
    mockFs.readFileSync.mockReturnValue(
      "---\ndate: 2024-01-01\ncategory: tech\n---\nbody",
    );

    expect(() => getAllPosts()).toThrow(/title/);
  });

  it("throws when category is missing", () => {
    mockFs.readdirSync.mockReturnValue(["broken.mdx"] as never);
    mockFs.readFileSync.mockReturnValue(
      "---\ntitle: Hello\ndate: 2024-01-01\n---\nbody",
    );

    expect(() => getAllPosts()).toThrow(/category/);
  });

  it("throws when date is missing or invalid", () => {
    mockFs.readdirSync.mockReturnValue(["broken.mdx"] as never);
    mockFs.readFileSync.mockReturnValue(
      "---\ntitle: Hello\ncategory: tech\ndate: not-a-date\n---\nbody",
    );

    expect(() => getAllPosts()).toThrow(/date/);
  });

  it("ignores non-.mdx files", () => {
    mockFs.readdirSync.mockReturnValue(["notes.txt", "hello.mdx"] as never);
    mockFs.readFileSync.mockReturnValue(
      "---\ntitle: Hello\ndate: 2024-01-01\ncategory: tech\n---\nbody",
    );

    expect(getAllPosts()).toHaveLength(1);
  });

  describe("excerpt", () => {
    function excerptFor(body: string): string {
      mockFs.readdirSync.mockReturnValue(["hello-world.mdx"] as never);
      mockFs.readFileSync.mockReturnValue(
        `---\ntitle: Hello\ndate: 2024-01-01\ncategory: tech\n---\n${body}`,
      );
      return getAllPosts()[0].excerpt;
    }

    it("strips heading lines entirely, not just the # marker", () => {
      expect(excerptFor("## 内容について\n本文です。")).toBe("本文です。");
    });

    it("strips list markers but keeps the item text", () => {
      expect(
        excerptFor("- 1章 理解しやすいコード\n- 2章 名前に情報を詰め込む"),
      ).toBe("1章 理解しやすいコード 2章 名前に情報を詰め込む");
    });

    it("removes a bare URL line that would become a LinkCard", () => {
      expect(
        excerptFor(
          "本文の前半です。\n\nhttps://example.com/article\n\n本文の後半です。",
        ),
      ).toBe("本文の前半です。 本文の後半です。");
    });

    it("keeps link text but drops the URL", () => {
      expect(
        excerptFor("[リーダブルコード](https://example.com/book)を読んだ"),
      ).toBe("リーダブルコードを読んだ");
    });

    it("removes code blocks entirely", () => {
      expect(excerptFor("説明文\n\n```js\nconst x = 1;\n```\n\n続きの文")).toBe(
        "説明文 続きの文",
      );
    });

    it("keeps inline code content but drops the backticks", () => {
      expect(excerptFor("`pnpm dev` で起動する")).toBe("pnpm dev で起動する");
    });

    it("strips bold/italic/strikethrough markers but keeps the text", () => {
      expect(excerptFor("**重要**な話と*補足*と~~削除線~~")).toBe(
        "重要な話と補足と削除線",
      );
    });

    it("strips blockquote markers", () => {
      expect(excerptFor("> 引用文です")).toBe("引用文です");
    });

    it("removes horizontal rules", () => {
      expect(excerptFor("前半\n\n---\n\n後半")).toBe("前半 後半");
    });

    it("strips JSX/HTML tags", () => {
      expect(
        excerptFor('<LinkCard url="https://example.com" title="foo" />本文'),
      ).toBe("本文");
    });

    it("collapses newlines and surrounding whitespace into single spaces", () => {
      expect(excerptFor("  1行目  \n\n  2行目  \n\n  3行目  ")).toBe(
        "1行目 2行目 3行目",
      );
    });
  });
});

describe("getPostBySlug", () => {
  it("returns the post when the file exists", () => {
    mockFs.existsSync.mockReturnValue(true);
    mockFs.readFileSync.mockReturnValue(
      "---\ntitle: Hello\ndate: 2024-01-01\ncategory: tech\n---\nbody",
    );

    expect(getPostBySlug("hello-world")?.title).toBe("Hello");
    expect(mockFs.existsSync).toHaveBeenCalledWith(
      path.join(postsDir, "hello-world.mdx"),
    );
  });

  it("returns undefined when the file does not exist", () => {
    mockFs.existsSync.mockReturnValue(false);

    expect(getPostBySlug("missing")).toBeUndefined();
  });

  it("returns undefined for a directory-traversal slug without touching the filesystem", () => {
    expect(getPostBySlug("../../etc/passwd")).toBeUndefined();
    expect(mockFs.existsSync).not.toHaveBeenCalled();
    expect(mockFs.readFileSync).not.toHaveBeenCalled();
  });
});

describe("getAllPages", () => {
  it("parses a page without requiring date or category", () => {
    mockFs.readdirSync.mockReturnValue(["about.mdx"] as never);
    mockFs.readFileSync.mockReturnValue(
      "---\ntitle: About\ndescription: test page\n---\nbody",
    );

    expect(getAllPages()).toEqual([
      { slug: "about", title: "About", description: "test page" },
    ]);
  });

  it("throws when title is missing", () => {
    mockFs.readdirSync.mockReturnValue(["about.mdx"] as never);
    mockFs.readFileSync.mockReturnValue(
      "---\ndescription: test page\n---\nbody",
    );

    expect(() => getAllPages()).toThrow(/title/);
  });
});

describe("getPageBySlug", () => {
  it("returns undefined for a directory-traversal slug without touching the filesystem", () => {
    expect(getPageBySlug("../../etc/passwd")).toBeUndefined();
    expect(mockFs.existsSync).not.toHaveBeenCalled();
  });

  it("returns undefined when the file does not exist", () => {
    mockFs.existsSync.mockReturnValue(false);

    expect(getPageBySlug("missing")).toBeUndefined();
  });

  it("returns the page when the file exists", () => {
    mockFs.existsSync.mockReturnValue(true);
    mockFs.readFileSync.mockReturnValue("---\ntitle: About\n---\nbody");

    expect(getPageBySlug("about")?.title).toBe("About");
    expect(mockFs.existsSync).toHaveBeenCalledWith(
      path.join(pagesDir, "about.mdx"),
    );
  });
});
