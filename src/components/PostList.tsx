"use client";

import { useState } from "react";
import { PostCard } from "./PostCard";
import { CategoryFilter } from "./CategoryFilter";
import type { Post } from "#site/content";

interface PostListProps {
  posts: Post[];
  categories: string[];
}

export function PostList({ posts, categories }: PostListProps) {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredPosts =
    selectedCategory === "All"
      ? posts
      : posts.filter((post) => post.category === selectedCategory);

  return (
    <>
      <CategoryFilter
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      <div className="grid gap-6">
        {filteredPosts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>

      {filteredPosts.length === 0 && (
        <div className="text-center py-12 text-zinc-500">
          記事が見つかりませんでした
        </div>
      )}
    </>
  );
}
