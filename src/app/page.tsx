import { PostList } from "@/components/PostList";
import { posts } from "#site/content";
import { categoryList } from "@/constants/categories";

export default function Home() {
  const sortedPosts = [...posts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="sr-only">imarin.net - 記事一覧</h1>
      <PostList posts={sortedPosts} categories={categoryList} />
    </div>
  );
}
