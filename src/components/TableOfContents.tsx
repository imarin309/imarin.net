"use client";

import { useEffect, useState } from "react";
import { List, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface HeadingItem {
  id: string;
  text: string;
  level: number;
}

export function TableOfContents() {
  const [headings, setHeadings] = useState<HeadingItem[]>([]);
  const [activeId, setActiveId] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // 見出しはMDXがレンダリングしたDOMから収集する
    const elements = Array.from(
      document.querySelectorAll<HTMLElement>("article [data-toc-heading]"),
    ).filter((el) => el.id && el.dataset.tocText);

    setHeadings(
      elements.map((el) => ({
        id: el.id,
        text: el.dataset.tocText ?? "",
        level: Number(el.dataset.tocHeading),
      })),
    );

    // 画面上部付近にある見出しを現在地として扱う
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-96px 0px -70% 0px", threshold: 0 },
    );
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  // ボトムシート表示中は背面のスクロールを止める
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // 見出しが1つ以下の記事では目次を出さない
  if (headings.length < 2) return null;

  const list = (onLinkClick?: () => void) => (
    <ul className="space-y-1.5">
      {headings.map((heading, index) => (
        <li
          key={`${heading.id}-${index}`}
          className={cn(
            heading.level === 3 && "pl-3",
            heading.level >= 4 && "pl-6",
          )}
        >
          <a
            href={`#${heading.id}`}
            onClick={onLinkClick}
            className={cn(
              "block truncate text-sm transition-colors",
              activeId === heading.id
                ? "font-medium text-zinc-900"
                : "text-zinc-500 hover:text-zinc-800",
            )}
          >
            {heading.text}
          </a>
        </li>
      ))}
    </ul>
  );

  return (
    <>
      {/* デスクトップ: 右側に固定表示 */}
      <nav
        aria-label="目次"
        className="fixed right-6 top-1/2 z-30 hidden max-h-[70vh] w-52 -translate-y-1/2 overflow-y-auto rounded-lg border border-zinc-200 bg-white/95 p-4 shadow-sm backdrop-blur-sm xl:block"
      >
        <p className="mb-2 text-xs font-medium text-zinc-400">目次</p>
        {list()}
      </nav>

      {/* モバイル: 丸ボタン + ボトムシート */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label="目次を開く"
        className="fixed bottom-5 right-5 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-zinc-900 text-white shadow-lg xl:hidden"
      >
        <List className="h-5 w-5" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 xl:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setIsOpen(false)}
          />
          <nav
            aria-label="目次"
            className="absolute inset-x-0 bottom-0 max-h-[70vh] overflow-y-auto rounded-t-2xl bg-white p-5 shadow-xl"
          >
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-medium text-zinc-700">目次</p>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="目次を閉じる"
                className="text-zinc-400 hover:text-zinc-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            {list(() => setIsOpen(false))}
          </nav>
        </div>
      )}
    </>
  );
}
