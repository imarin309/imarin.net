# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## コマンド

```bash
pnpm dev      # Velite のウォッチ + Next.js 開発サーバーを同時起動
pnpm build    # Velite でコンテンツをビルド → Next.js ビルド
pnpm lint     # ESLint（next lint）
pnpm start    # 本番サーバー起動
pnpm velite   # Velite 単体実行
```

テストは設定されていない。

## アーキテクチャ概要

### コンテンツ管理（Velite）

ブログ記事は `content/posts/*.mdx` に MDX ファイルとして配置する。Velite がビルド時に処理して `.velite/` に出力し、Next.js から `#site/content` というエイリアスでインポートできる。

MDX のフロントマター必須フィールド：

- `title` / `date`（ISO形式）/ `category`

`slug` はファイルパスから自動生成される（`posts/` プレフィックスは除去）。

### ルーティング

- `/` → 記事一覧（`src/app/page.tsx`）：全記事を日付降順で表示
- `/post/[id]` → 記事詳細（`src/app/post/[id]/page.tsx`）：`id` は slug

静的生成（`generateStaticParams`）を使用しており、Velite のデータが必要なので、ビルド前に必ず Velite を実行する必要がある（`pnpm build` で自動実行される）。

### MDX レンダリング

Velite がコンパイルした MDX 文字列を `MDXContent` コンポーネント（クライアントコンポーネント）が `new Function(code)` で実行する。コードブロックは `pre` 要素を上書きする `CodeBlock` コンポーネント（`react-syntax-highlighter` 使用）で描画される。

### カテゴリ

カテゴリ一覧は `src/constants/categories.ts` で一元管理。記事に新しいカテゴリを追加する場合はここも更新が必要。

### スタイリング

Tailwind CSS v4 を使用。クラス結合には `src/lib/utils.ts` の `cn()` ユーティリティ（clsx + tailwind-merge）を使う。
