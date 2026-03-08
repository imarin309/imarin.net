import Link from "next/link";
import { Code2 } from "lucide-react";
import { SITE_TITLE, SITE_CATCHCOPY } from "@/constants/meta";

export function Header() {
  return (
    <header className="border-b border-zinc-200 bg-white sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link
            href="/"
            className="flex items-center gap-2 hover:opacity-70 transition-opacity"
          >
            <Code2 className="w-6 h-6 text-zinc-900" />
            <div className="flex flex-col">
              <span className="text-xl font-medium text-zinc-900 leading-tight">
                {SITE_TITLE}
              </span>
              <span className="text-xs text-zinc-500">{SITE_CATCHCOPY}</span>
            </div>
          </Link>
          <nav>
            <Link
              href="/"
              className="text-zinc-600 hover:text-zinc-900 transition-colors text-sm"
            >
              記事一覧
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
