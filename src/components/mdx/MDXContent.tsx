"use client";

import { useMemo } from "react";
import * as runtime from "react/jsx-runtime";
import { mdxComponents } from "./index";

interface MDXContentProps {
  code: string;
}

function getMDXComponent(code: string) {
  // eslint-disable-next-line @typescript-eslint/no-implied-eval
  const fn = new Function(code);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return fn({ ...runtime }).default as React.ComponentType<any>;
}

export function MDXContent({ code }: MDXContentProps) {
  const Component = useMemo(() => getMDXComponent(code), [code]);
  return <Component components={mdxComponents} />;
}
