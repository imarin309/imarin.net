import { defineConfig, globalIgnores } from "eslint/config";
import nextPlugin from "@next/eslint-plugin-next";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import {
  flat as mdxFlat,
  flatCodeBlocks as mdxFlatCodeBlocks,
} from "eslint-plugin-mdx";
import prettier from "eslint-config-prettier";

const eslintConfig = defineConfig([
  ...tsPlugin.configs["flat/recommended"],
  nextPlugin.flatConfig.coreWebVitals,
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parser: tsParser,
    },
    rules: {
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/no-unused-expressions": "warn",
    },
  },
  mdxFlat,
  mdxFlatCodeBlocks,
  prettier,
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "content/drafts/**",
  ]),
]);

export default eslintConfig;
