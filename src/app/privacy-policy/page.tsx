import { notFound } from "next/navigation";
import { pages } from "#site/content";
import { MDXContent } from "@/components/mdx/MDXContent";
import type { Metadata } from "next";

function getPageBySlug(slug: string) {
  return pages.find((page) => page.slug === slug);
}

export async function generateMetadata(): Promise<Metadata> {
  const page = getPageBySlug("privacy-policy");

  if (!page) {
    return {};
  }

  return {
    title: page.title,
    description: page.description,
    openGraph: {
      title: page.title,
      description: page.description,
    },
  };
}

export default function PrivacyPolicyPage() {
  const page = getPageBySlug("privacy-policy");

  if (!page) {
    notFound();
  }

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
        <MDXContent code={page.content} />
      </div>
    </article>
  );
}
