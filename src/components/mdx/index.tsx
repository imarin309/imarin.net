import dynamic from "next/dynamic";
import { CodeBlock } from "../CodeBlock";
import { LinkCard } from "./LinkCard";

const MermaidBlock = dynamic(
  () => import("./MermaidBlock").then((mod) => ({ default: mod.MermaidBlock })),
  { ssr: false },
);

interface PreProps {
  children?: React.ReactNode;
}

function Pre({ children }: PreProps) {
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

function H2({ children }: { children?: React.ReactNode }) {
  return <h2 className="border-b border-current pb-1">{children}</h2>;
}

export const mdxComponents = {
  pre: Pre,
  h2: H2,
  LinkCard,
};
