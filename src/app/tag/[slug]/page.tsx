import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PostCard } from "@/components/PostCard";
import { getPostsByTag, getUsedTags } from "@/lib/posts";
import { tagList } from "@/constants/tags";
import { SITE_OG_IMAGE } from "@/lib/og";
import { SITE_TITLE, SITE_URL } from "@/constants/meta";

type Props = { params: Promise<{ slug: string }> };

// 記事が1本もないタグのページは作らない
export function generateStaticParams() {
  return getUsedTags().map((tag) => ({ slug: tag.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tag = tagList.find((t) => t.slug === slug);
  if (!tag) return {};

  const title = `#${tag.label} の記事一覧 | ${SITE_TITLE}`;
  const description = `「${tag.label}」タグが付いた記事の一覧です。`;
  const url = `${SITE_URL}/tag/${tag.slug}`;

  return {
    title,
    description,
    openGraph: {
      type: "website",
      url,
      siteName: SITE_TITLE,
      title,
      description,
      images: [{ ...SITE_OG_IMAGE, alt: title }],
      locale: "ja_JP",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [SITE_OG_IMAGE.url],
    },
    alternates: {
      canonical: url,
    },
  };
}

export default async function TagPage({ params }: Props) {
  const { slug } = await params;
  const tag = tagList.find((t) => t.slug === slug);
  if (!tag) notFound();

  const posts = getPostsByTag(tag.slug).sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-zinc-500 hover:text-zinc-900 transition-colors mb-8 text-sm"
      >
        <ArrowLeft className="w-4 h-4" />
        記事一覧に戻る
      </Link>

      <h1 className="text-2xl font-medium text-zinc-900 mb-8">
        #{tag.label} の記事
      </h1>

      <div className="grid gap-6">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
    </div>
  );
}
