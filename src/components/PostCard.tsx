import Link from "next/link";
import { Calendar } from "lucide-react";
import type { Post } from "#site/content";

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  const formattedDate = new Date(post.date).toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Link href={`/post/${post.slug}`} className="block group">
      <article className="border border-zinc-200 rounded-lg p-6 hover:border-zinc-400 hover:shadow-md transition-all bg-white">
        <div className="flex items-center gap-2 mb-3">
          <span className="px-3 py-1 bg-zinc-100 text-zinc-700 text-sm rounded-md">
            {post.category}
          </span>
        </div>

        <h2 className="text-xl font-medium mb-3 text-zinc-900 group-hover:text-zinc-600 transition-colors">
          {post.title}
        </h2>

        <p className="text-zinc-600 mb-4 line-clamp-2 text-sm leading-relaxed">
          {post.description}
        </p>

        <div className="flex items-center gap-4 text-sm text-zinc-500">
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>{formattedDate}</span>
          </div>
        </div>
      </article>
    </Link>
  );
}
