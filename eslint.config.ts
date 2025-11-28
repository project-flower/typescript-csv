import js from "@eslint/js";
import { defineConfig } from "eslint/config";
import eslintConfigPrettier from "eslint-config-prettier";
import importPlugin from "eslint-plugin-import";
import pluginReact from "eslint-plugin-react";
import globals from "globals";
import tseslint from "typescript-eslint";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    extends: ["js/recommended"],
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
    plugins: { import: importPlugin, js },
  },
  tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "warn",
      "import/order": [
        "error",
        {
          alphabetize: {
            order: "asc",
          },
          groups: [
            "builtin",
            "external",
            "parent",
            "sibling",
            "index",
            "object",
            "type",
          ],
          "newlines-between": "never",
          pathGroupsExcludedImportTypes: [],
          pathGroups: [
            {
              pattern: "{react,react-dom/**,react-router/**}",
              group: "builtin",
              position: "before",
            },
          ],
        },
      ],
      "react/react-in-jsx-scope": "off",
    },
  },
  eslintConfigPrettier,
]);
