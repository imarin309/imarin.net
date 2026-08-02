import type { Metadata } from "next";
import { SITE_EMAIL } from "@/constants/meta";

export const metadata: Metadata = {
  title: "お問い合わせ",
  description: "ぽよりろぐへのお問い合わせはこちらから。",
  openGraph: {
    title: "お問い合わせ",
    description: "ぽよりろぐへのお問い合わせはこちらから。",
  },
};

export default function ContactPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
      <header className="mb-8 border-b border-zinc-200 pb-6">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-800 sm:text-3xl">
          お問い合わせ
        </h1>
        <p className="mt-4 text-zinc-500">
          ご質問・ご感想はメールにてお気軽にどうぞ。
        </p>
      </header>

      <a
        href={`mailto:${SITE_EMAIL}`}
        className="group inline-flex flex-col gap-2 border-b border-zinc-200 pb-4 transition-colors hover:border-zinc-600"
      >
        <span className="text-xs uppercase tracking-widest text-zinc-400 transition-colors group-hover:text-zinc-600">
          Email
        </span>
        <span className="text-xl tracking-wide text-zinc-700 sm:text-2xl">
          {SITE_EMAIL}
        </span>
      </a>

      <p className="mt-16 max-w-xl text-sm leading-relaxed text-zinc-400">
        いただいた個人情報は、ご連絡・対応の目的にのみ使用し、第三者への提供は行いません。
      </p>
    </article>
  );
}
