import type { Metadata } from "next";
import { Header } from "@/components/Header";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tech Blog",
  description: "技術的な挑戦、学び、気づきをアウトプットしています",
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
              © 2026 Tech Blog. All rights reserved.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
