import { cn } from "@/lib/utils";
import type { TocHeading } from "@/lib/toc";

interface ArticleTocProps {
  headings: TocHeading[];
}

/**
 * 記事本文の先頭に置く目次。
 *
 * 見出しはビルド時に抜き出しているので静的HTMLに含まれ、JSが無効でも読める。
 *
 * xl 以上では TableOfContents の追従パネルが常時見えていて重複するため隠す。
 * 逆に xl 未満では追従パネルが無く、ボタンをタップしないと目次に辿り着けない
 * ので、ここで最初から見えるようにしている。ブレークポイントは
 * TableOfContents 側の `xl:block` / `xl:hidden` と対になっている。
 */
export function ArticleToc({ headings }: ArticleTocProps) {
  // 見出しが1つ以下の記事では目次を出さない
  if (headings.length < 2) return null;

  return (
    <nav
      aria-labelledby="article-toc-title"
      className="mb-10 rounded-lg border border-zinc-200 bg-white px-5 py-4 xl:hidden"
    >
      <p
        id="article-toc-title"
        className="mb-3 text-sm font-medium text-zinc-700"
      >
        目次
      </p>
      <ol className="space-y-1.5">
        {headings.map((heading) => (
          <li
            key={heading.id}
            className={cn(
              heading.level === 3 && "pl-4",
              heading.level >= 4 && "pl-8",
            )}
          >
            <a
              href={`#${heading.id}`}
              className="text-sm text-zinc-600 underline-offset-4 hover:text-zinc-900 hover:underline"
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
