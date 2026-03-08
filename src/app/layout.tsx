import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { SITE_TITLE, SITE_DESCRIPTION } from "@/constants/meta";
import "./globals.css";

export const metadata: Metadata = {
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className="min-h-screen bg-zinc-50">
        <Header />
        <main>{children}</main>
        <footer className="border-t border-zinc-200 mt-16">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <p className="text-center text-zinc-500 text-sm">
              © 2026 {SITE_TITLE}. All rights reserved.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
