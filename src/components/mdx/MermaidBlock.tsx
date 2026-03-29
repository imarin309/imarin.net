"use client";

import { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";

interface MermaidBlockProps {
  value: string;
}

let initialized = false;

export function MermaidBlock({ value }: MermaidBlockProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [showRaw, setShowRaw] = useState(false);

  useEffect(() => {
    if (!initialized) {
      mermaid.initialize({ startOnLoad: false, theme: "neutral" });
      initialized = true;
    }

    const id = `mermaid-${Math.random().toString(36).slice(2)}`;
    mermaid.render(id, value).then(({ svg }) => {
      if (ref.current) {
        ref.current.innerHTML = svg;
      }
    });
  }, [value]);

  return (
    <div className="my-6 overflow-hidden rounded-lg border border-zinc-200">
      <div className="flex border-b border-zinc-200 bg-zinc-50">
        {(["Preview", "Raw"] as const).map((tab) => {
          const active = tab === "Raw" ? showRaw : !showRaw;
          return (
            <button
              key={tab}
              onClick={() => setShowRaw(tab === "Raw")}
              className={`px-4 py-2 text-xs font-medium transition-colors ${
                active
                  ? "border-b-2 border-zinc-800 text-zinc-800"
                  : "text-zinc-400 hover:text-zinc-600"
              }`}
            >
              {tab}
            </button>
          );
        })}
      </div>
      <div
        ref={ref}
        className={`flex justify-center overflow-x-auto p-4 ${showRaw ? "hidden" : ""}`}
      />
      {showRaw && (
        <pre className="overflow-x-auto bg-[#fafafa] p-6 text-sm leading-relaxed text-zinc-700">
          <code>{value}</code>
        </pre>
      )}
    </div>
  );
}
