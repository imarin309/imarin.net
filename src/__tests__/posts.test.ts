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
