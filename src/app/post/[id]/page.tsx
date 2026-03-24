import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar } from "lucide-react";
import { posts } from "#site/content";
import { MDXContent } from "@/components/mdx/MDXContent";
import { SITE_TITLE, SITE_URL, SITE_DESCRIPTION } from "@/constants/meta";

interface Props {
  params: Promise<{ id: string }>;
}

export function generateStaticParams() {
  return posts.map((post) => ({ id: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const post = posts.find((p) => p.slug === id);
  if (!post) return {};

  const title = `${post.title} | ${SITE_TITLE}`;
  const description = post.description ?? SITE_DESCRIPTION;
  const url = `${SITE_URL}/post/${post.slug}`;

  return {
    title,
    description,
    openGraph: {
      type: "article",
      url,
      siteName: SITE_TITLE,
      title,
      description,
      images: [{ url: "/icon.png" }],
      locale: "ja_JP",
      publishedTime: post.date,
    },
    twitter: {
      card: "summary",
      title,
      description,
      images: ["/icon.png"],
    },
    alternates: {
      canonical: url,
    },
  };
}

export default async function PostPage({ params }: Props) {
  const { id } = await params;
  const post = posts.find((p) => p.slug === id);

  if (!post) notFound();

  const formattedDate = new Date(post.date).toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description ?? SITE_DESCRIPTION,
    datePublished: post.date,
    url: `${SITE_URL}/post/${post.slug}`,
    author: {
      "@type": "Person",
      name: SITE_TITLE,
      url: SITE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_TITLE,
      url: SITE_URL,
    },
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd)
            .replace(/</g, "\\u003c")
            .replace(/>/g, "\\u003e")
            .replace(/&/g, "\\u0026"),
        }}
      />
      {/* 戻るボタン */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-zinc-500 hover:text-zinc-900 transition-colors mb-8 text-sm"
      >
        <ArrowLeft className="w-4 h-4" />
        記事一覧に戻る
      </Link>

      {/* ヘッダー情報 */}
      <header className="mb-10">
        <div className="flex items-center gap-2 mb-4">
          <span className="px-3 py-1 bg-zinc-100 text-zinc-700 text-sm rounded-md">
            {post.category}
          </span>
        </div>
        <h1 className="text-3xl font-medium text-zinc-900 mb-4 leading-snug">
          {post.title}
        </h1>
        <div className="flex items-center gap-4 text-sm text-zinc-500">
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>{formattedDate}</span>
          </div>
        </div>
      </header>

      <hr className="border-zinc-200 mb-10" />

      {/* 本文 */}
      <article className="prose prose-zinc max-w-none">
        <MDXContent code={post.content} />
      </article>
    </div>
  );
}
