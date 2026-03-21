"use client";

import { useState } from "react";
import { PostCard } from "./PostCard";
import { CategoryFilter } from "./CategoryFilter";
import { cn } from "@/lib/utils";
import type { Post } from "#site/content";
import { POSTS_PER_PAGE } from "@/constants/config";

interface PostListProps {
  posts: Post[];
  categories: string[];
}

export function PostList({ posts, categories }: PostListProps) {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredPosts =
    selectedCategory === "All"
      ? posts
      : posts.filter((post) => post.category === selectedCategory);

  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const paginatedPosts = filteredPosts.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE,
  );

  function handleSelectCategory(category: string) {
    setSelectedCategory(category);
    setCurrentPage(1);
  }

  return (
    <>
      <CategoryFilter
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={handleSelectCategory}
      />

      <div className="grid gap-6">
        {paginatedPosts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>

      {filteredPosts.length === 0 && (
        <div className="text-center py-12 text-zinc-500">
          記事が見つかりませんでした
        </div>
      )}

      {totalPages > 1 && (
        <nav
          aria-label="ページネーション"
          className="flex justify-center items-center gap-2 mt-10"
        >
          <button
            type="button"
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1.5 rounded text-sm bg-zinc-100 text-zinc-700 hover:bg-zinc-200 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            前へ
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              type="button"
              onClick={() => setCurrentPage(page)}
              aria-current={page === currentPage ? "page" : undefined}
              className={cn(
                "px-3 py-1.5 rounded text-sm transition-all",
                page === currentPage
                  ? "bg-zinc-900 text-white"
                  : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200",
              )}
            >
              {page}
            </button>
          ))}

          <button
            type="button"
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1.5 rounded text-sm bg-zinc-100 text-zinc-700 hover:bg-zinc-200 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            次へ
          </button>
        </nav>
      )}
    </>
  );
}
