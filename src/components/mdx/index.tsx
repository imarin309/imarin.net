import { CodeBlock } from "../CodeBlock";

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

  return <CodeBlock language={lang} value={value} />;
}

export const mdxComponents = {
  pre: Pre,
};
