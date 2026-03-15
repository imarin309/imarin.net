import Link from "next/link";

export default function NotFound() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
      <p className="text-6xl font-bold text-zinc-300">404</p>
      <h1 className="mt-4 text-2xl font-semibold text-zinc-800">
        ページが見つかりません
      </h1>
      <p className="mt-3 text-zinc-500">
        お探しのページは存在しないか、移動した可能性があります。
      </p>
      <Link
        href="/"
        className="inline-block mt-8 px-6 py-3 bg-zinc-800 text-white text-sm rounded-lg hover:bg-zinc-700 transition-colors"
      >
        トップページへ戻る
      </Link>
    </div>
  );
}
