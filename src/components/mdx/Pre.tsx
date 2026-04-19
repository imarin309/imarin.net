"use client";

import dynamic from "next/dynamic";
import { CodeBlock } from "../CodeBlock";

const MermaidBlock = dynamic(
  () => import("./MermaidBlock").then((mod) => ({ default: mod.MermaidBlock })),
  { ssr: false },
);

interface PreProps {
  children?: React.ReactNode;
}

export function Pre({ children }: PreProps) {
  const child = children as React.ReactElement<{
    className?: string;
    children?: string;
  }>;
  const className = child?.props?.className ?? "";
  const lang = className.replace("language-", "") || "text";
  const value = String(child?.props?.children ?? "").trim();

  if (lang === "mermaid") {
    return <MermaidBlock value={value} />;
  }

  return <CodeBlock language={lang} value={value} />;
}
