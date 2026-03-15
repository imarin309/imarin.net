import Link from "next/link";
import { SITE_TITLE } from "@/constants/meta";

export function Footer() {
  return (
    <footer className="border-t border-zinc-200 mt-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col items-center gap-3">
        <Link
          href="/privacy-policy"
          className="text-zinc-400 text-sm hover:text-zinc-600 transition-colors"
        >
          プライバシーポリシー
        </Link>
        <p className="text-center text-zinc-500 text-sm">
          © {new Date().getFullYear()} {SITE_TITLE}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
