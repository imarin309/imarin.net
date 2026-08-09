"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Ellipsis } from "lucide-react";
import { SITE_TITLE } from "@/constants/meta";

const navLinks = [
  { href: "/about", label: "About", external: false },
  { href: "/development", label: "Development", external: false },
  {
    href: "https://github.com/imarin309/imarin.net",
    label: "GitHub",
    external: true,
  },
  { href: "/contact", label: "Contact", external: false },
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isMenuOpen) return;

    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMenuOpen]);

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

          <nav className="hidden sm:flex items-center gap-4">
            {navLinks.map((link) =>
              link.external ? (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-zinc-600 hover:text-zinc-900 transition-colors text-sm"
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-zinc-600 hover:text-zinc-900 transition-colors text-sm"
                >
                  {link.label}
                </Link>
              ),
            )}
          </nav>

          <div className="relative sm:hidden" ref={menuRef}>
            <button
              type="button"
              onClick={() => setIsMenuOpen((open) => !open)}
              aria-label="メニューを開く"
              aria-expanded={isMenuOpen}
              className="p-2 text-zinc-600 hover:text-zinc-900 transition-colors"
            >
              <Ellipsis size={20} />
            </button>

            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-40 rounded-xl border border-zinc-200 bg-white shadow-sm overflow-hidden">
                {navLinks.map((link) =>
                  link.external ? (
                    <a
                      key={link.href}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setIsMenuOpen(false)}
                      className="block px-4 py-2 text-sm text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 transition-colors"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsMenuOpen(false)}
                      className="block px-4 py-2 text-sm text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 transition-colors"
                    >
                      {link.label}
                    </Link>
                  ),
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
