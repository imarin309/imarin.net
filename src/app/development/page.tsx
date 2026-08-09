import type { Metadata } from "next";
import { works } from "@/constants/development";
import { WorkCard } from "@/components/WorkCard";

export const metadata: Metadata = {
  title: "作ったもの",
  description: "これまでに作ったものの一覧です。",
  openGraph: {
    title: "作ったもの",
    description: "これまでに作ったものの一覧です。",
  },
};

export default function WorksPage() {
  return (
    <article className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12">
      <header className="mb-8 border-b border-zinc-200 pb-6">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-800 sm:text-3xl">
          作ったもの
        </h1>
        <p className="mt-4 text-zinc-500">
          これまでに作ったものをまとめています。
        </p>
      </header>

      <div className="flex flex-col gap-6">
        {works.map((work) => (
          <WorkCard key={work.title} work={work} />
        ))}
      </div>
    </article>
  );
}
