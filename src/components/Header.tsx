import Link from "next/link";
import Image from "next/image";
import { SITE_TITLE } from "@/constants/meta";

export function Header() {
  return (
    <header className="border-b border-zinc-200 bg-white sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link
            href="/"
            className="flex items-center gap-2 hover:opacity-70 transition-opacity"
          >
            <Image src="/ahiru.png" alt="" width={40} height={40} />
            <div className="flex flex-col">
              <span className="text-xl font-normal text-zinc-900 leading-tight">
                {SITE_TITLE}
              </span>
            </div>
          </Link>
          <nav className="flex items-center gap-4">
            <Link
              href="/about"
              className="text-zinc-600 hover:text-zinc-900 transition-colors text-sm"
            >
              About
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
