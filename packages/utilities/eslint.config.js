import eslint from "@eslint/js";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import eslintConfigPrettier from "eslint-config-prettier";
import vitest from "eslint-plugin-vitest";

export default [
  // Replacement for "eslint:recommended" and "eslint:all"
  eslint.configs.recommended,
  eslintConfigPrettier,
  {
    files: ["./**/*.(test|spec).(ts|js)"], // or any other pattern
    plugins: {
      vitest,
    },
    rules: {
      ...vitest.configs.recommended.rules, // you can also use vitest.configs.all.rules to enable all rules
      "vitest/max-nested-describe": ["error", { max: 3 }], // you can also modify rules' behavior using option like this
    },
  },
  {
    files: ["./**/*.ts"],
    env: {
      browser: false,
      es6: true,
      node: true,
    },
    parser: "@typescript-eslint/parser",
    parserOptions: {
      project: "tsconfig.json",
      sourceType: "module",
    },
    plugins: ["@typescript-eslint"],
    extends: ["eslint:recommended", "prettier"],
    rules: {
      ...typescriptEslint.configs.recommended,
    },
  },
];
