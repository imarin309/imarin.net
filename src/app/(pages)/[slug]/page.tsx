import { notFound } from "next/navigation";
import { getAllPages, getPageBySlug } from "@/lib/posts";
import { mdxComponents } from "@/components/mdx";
import { SITE_OG_IMAGE } from "@/lib/og";
import { SITE_TITLE, SITE_URL } from "@/constants/meta";
import type { Metadata } from "next";

export function generateStaticParams() {
  return getAllPages().map((page) => ({ slug: page.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = getPageBySlug(slug);

  if (!page) {
    return {};
  }

  return {
    title: page.title,
    description: page.description,
    openGraph: {
      // openGraph は指定したオブジェクトで丸ごと置き換わるため、
      // layout.tsx の設定は引き継がれない。必要な項目は明示的に渡す
      type: "website",
      url: `${SITE_URL}/${page.slug}`,
      siteName: SITE_TITLE,
      title: page.title,
      description: page.description,
      images: [{ ...SITE_OG_IMAGE, alt: page.title }],
      locale: "ja_JP",
    },
  };
}

export default async function StaticPage({ params }: Props) {
  const { slug } = await params;
  const page = getPageBySlug(slug);

  if (!page) {
    notFound();
  }

  const { default: PageContent } = await import(
    `../../../../content/pages/${slug}.mdx`
  );

  return (
    <article className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
      <header className="mb-8 border-b border-zinc-200 pb-6">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-800 sm:text-3xl">
          {page.title}
        </h1>
        {page.description && (
          <p className="mt-4 text-zinc-500">{page.description}</p>
        )}
      </header>

      <div className="prose prose-zinc max-w-none prose-headings:font-semibold">
        <PageContent components={mdxComponents} />
      </div>
    </article>
  );
}
