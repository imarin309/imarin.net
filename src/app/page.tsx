import { PostList } from "@/components/PostList";
import { posts } from "#site/content";
import { categoryList } from "@/constants/categories";

export default function Home() {
  const sortedPosts = [...posts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-medium mb-4 text-zinc-900">
          エンジニアブログ
        </h1>
        <p className="text-zinc-600">
          技術的な挑戦、学び、気づきをアウトプットしています
        </p>
      </div>

      <PostList posts={sortedPosts} categories={categoryList} />
    </div>
  );
}
