import { ESLint } from "eslint";

export default [
  {
    files: ["**/*.ts", "**/*.js"],
    languageOptions: {
      parser: "@typescript-eslint/parser",
      parserOptions: {
        ecmaVersion: 2021,
        sourceType: "module",
      },
    },
    env: {
      node: true,
      es2021: true,
      jest: true,
    },
    plugins: {
      "@typescript-eslint": ESLint.CLIEngine ? undefined : undefined,
    },
    extends: [
      "eslint:recommended",
      "plugin:@typescript-eslint/recommended",
      "prettier",
    ],
    rules: {},
  },
];
