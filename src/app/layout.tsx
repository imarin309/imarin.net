import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { GoogleAnalytics } from "@/components/google/GoogleAnalytics";
import { GoogleAdSense } from "@/components/google/GoogleAdSense";
import {
  SITE_TITLE,
  SITE_DESCRIPTION,
  SITE_URL,
  SITE_CATCHCOPY,
} from "@/constants/meta";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: SITE_TITLE,
    title: SITE_TITLE,
    description: SITE_CATCHCOPY,
    // TODO: SNSシェア時のサムネイル用に 1200×630px の専用画像を用意して差し替える
    images: [{ url: "/og-image.png" }],
    locale: "ja_JP",
  },
  twitter: {
    card: "summary",
    title: SITE_TITLE,
    description: SITE_CATCHCOPY,
    images: ["/og-image.png"], // TODO: 上記OGP画像と合わせて差し替える
  },
  icons: {
    apple: "/apple-icon.png",
  },
  alternates: {
    types: {
      "application/rss+xml": "/feed.xml",
    },
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_TITLE,
  url: SITE_URL,
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
        {process.env.NODE_ENV === "production" &&
          process.env.CF_PAGES_BRANCH === "main" && (
            <>
              <GoogleAnalytics />
              <GoogleAdSense />
            </>
          )}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd)
              .replace(/</g, "\\u003c")
              .replace(/>/g, "\\u003e")
              .replace(/&/g, "\\u0026"),
          }}
        />
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
