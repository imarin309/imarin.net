# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## コマンド

```bash
pnpm dev      # Next.js 開発サーバー起動（webpack使用）
pnpm build    # Next.js ビルド（webpack使用）
pnpm lint     # ESLint（next lint）
pnpm start    # 本番サーバー起動
```

テストは設定されていない。

## アーキテクチャ概要

### コンテンツ管理（@next/mdx）

ブログ記事は `content/posts/*.mdx`、固定ページは `content/pages/*.mdx` に MDX ファイルとして配置する。`src/lib/posts.ts` がビルド時にファイルをスキャンし、`gray-matter` でフロントマターを解析する。

MDX のフロントマター必須フィールド：

- `title` / `date`（ISO形式）/ `category`

`slug` はファイル名から自動生成される（拡張子除去）。

### ルーティング

- `/` → 記事一覧（`src/app/page.tsx`）：全記事を日付降順で表示
- `/post/[id]` → 記事詳細（`src/app/post/[id]/page.tsx`）：`id` は slug
- `/[slug]` → 固定ページ（`src/app/(pages)/[slug]/page.tsx`）

静的生成（`generateStaticParams`）を使用。`src/lib/posts.ts` の `getAllPosts()` / `getAllPages()` からslug一覧を取得する。

### MDX レンダリング

MDX ファイルを動的インポートで直接 React コンポーネントとして読み込む。カスタムコンポーネントは `mdx-components.tsx`（ルート）でグローバル設定し、`src/components/mdx/index.tsx` の `mdxComponents` で定義する。

- `pre` → `Pre.tsx`（`"use client"`）: Mermaid / シンタックスハイライト（`react-syntax-highlighter`）を切り替え
- `h2` → 下線スタイル付きの見出し
- `LinkCard` → OGPカード

Turbopackはremarkプラグインとの互換性問題があるためwebpackを使用している（`--webpack`フラグ）。

### カテゴリ

カテゴリ一覧は `src/constants/categories.ts` で一元管理。記事に新しいカテゴリを追加する場合はここも更新が必要。

### スタイリング

Tailwind CSS v4 を使用。クラス結合には `src/lib/utils.ts` の `cn()` ユーティリティ（clsx + tailwind-merge）を使う。
