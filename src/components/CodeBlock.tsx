"use client";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";

interface CodeBlockProps {
  language: string;
  value: string;
}

export function CodeBlock({ language, value }: CodeBlockProps) {
  return (
    <div className="my-6 rounded-lg overflow-hidden border border-zinc-200">
      <SyntaxHighlighter
        language={language || "text"}
        style={oneLight}
        customStyle={{
          margin: 0,
          padding: "1.5rem",
          fontSize: "0.875rem",
          lineHeight: "1.6",
          background: "#fafafa",
        }}
        showLineNumbers={false}
      >
        {value}
      </SyntaxHighlighter>
    </div>
  );
}
