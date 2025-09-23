module.exports = [
  {
    files: ["**/*.ts", "**/*.js"],
    languageOptions: {
      parser: require.resolve("@typescript-eslint/parser"),
      parserOptions: {
        ecmaVersion: 2021,
        sourceType: "module",
      },
      globals: {
        NodeJS: true,
        jest: true,
      },
    },
    settings: {},
    plugins: {
      "@typescript-eslint": require("@typescript-eslint/eslint-plugin"),
    },
    extends: [
      "eslint:recommended",
      "plugin:@typescript-eslint/recommended",
      "prettier",
    ],
    rules: {},
  },
];
