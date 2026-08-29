import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";
import { extractText, toSlug } from "@/lib/heading";

// 目次（TableOfContents）は data-toc-heading / data-toc-text を目印に
// レンダリング後のDOMから見出しを収集するため、両方を必ず付与する。
//
// id は remark-heading-id が記事全体で一意化したものを props で受け取る。
// MDX 以外から使われた場合に備えて、無ければ見出しテキストから生成する。
function headingProps(
  children: React.ReactNode,
  level: number,
  id: string | undefined,
) {
  const text = extractText(children);

  return {
    id: id ?? toSlug(text),
    "data-toc-heading": String(level),
    "data-toc-text": text,
  };
}

export function H2({
  children,
  className,
  id,
  ...props
}: ComponentPropsWithoutRef<"h2">) {
  return (
    <h2
      {...headingProps(children, 2, id)}
      className={cn("scroll-mt-20 border-b border-current pb-1", className)}
      {...props}
    >
      {children}
    </h2>
  );
}

export function H3({
  children,
  className,
  id,
  ...props
}: ComponentPropsWithoutRef<"h3">) {
  return (
    <h3
      {...headingProps(children, 3, id)}
      className={cn("scroll-mt-20", className)}
      {...props}
    >
      {children}
    </h3>
  );
}

export function H4({
  children,
  className,
  id,
  ...props
}: ComponentPropsWithoutRef<"h4">) {
  return (
    <h4
      {...headingProps(children, 4, id)}
      className={cn("scroll-mt-20", className)}
      {...props}
    >
      {children}
    </h4>
  );
}
