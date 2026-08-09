import Link from "next/link";
import { Code2, FileText } from "lucide-react";
import type { Work } from "@/constants/development";
import { getPostBySlug } from "@/lib/posts";

interface WorkCardProps {
  work: Work;
}

export function WorkCard({ work }: WorkCardProps) {
  const relatedPosts = (work.relatedPostSlugs ?? [])
    .map((slug) => getPostBySlug(slug))
    .filter((post) => post !== undefined);

  return (
    <article className="relative border border-zinc-200 rounded-lg p-6 hover:border-zinc-400 hover:shadow-md transition-all bg-white flex flex-col">
      <div className="flex items-center gap-2 mb-3">
        <span className="px-3 py-1 bg-zinc-100 text-zinc-700 text-sm rounded-md">
          {work.category}
        </span>
      </div>

      <h2 className="text-xl font-normal mb-3 text-zinc-900">
        {work.url ? (
          <a
            href={work.url}
            target="_blank"
            rel="noopener noreferrer"
            className="static after:absolute after:inset-0"
          >
            {work.title}
          </a>
        ) : (
          work.title
        )}
      </h2>

      <p className="text-zinc-600 mb-4 text-sm leading-relaxed flex-1">
        {work.description}
      </p>

      <div className="flex flex-wrap items-center gap-2 mb-4">
        {work.tags.map((tag) => (
          <span
            key={tag}
            className="px-3 py-1 bg-zinc-100 text-zinc-700 text-xs rounded-md"
          >
            {tag}
          </span>
        ))}
      </div>

      {relatedPosts.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center gap-1 text-xs text-zinc-400 mb-2">
            <FileText className="w-3.5 h-3.5" />
            <span>関連記事</span>
          </div>
          <ul className="flex flex-col gap-1">
            {relatedPosts.map((post) => (
              <li key={post.slug}>
                <Link
                  href={`/post/${post.slug}`}
                  className="relative z-10 text-sm text-zinc-600 underline underline-offset-2 hover:text-zinc-900 transition-colors"
                >
                  {post.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {work.github && (
        <div className="flex items-center gap-4 text-sm text-zinc-500">
          <a
            href={work.github}
            target="_blank"
            rel="noopener noreferrer"
            className="relative z-10 flex items-center gap-1 hover:text-zinc-900 transition-colors"
          >
            <Code2 className="w-4 h-4" />
            <span>GitHub</span>
          </a>
        </div>
      )}
    </article>
  );
}
