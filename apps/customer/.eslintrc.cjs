/** @type {import('@types/eslint').Linter.BaseConfig} */
module.exports = {
  root: true,
  extends: [
    "@remix-run/eslint-config",
    "@remix-run/eslint-config/node",
    "prettier",
    "plugin:prettier/recommended",
    "plugin:import/typescript",
    "plugin:tailwindcss/recommended",
  ],
  plugins: ["unused-imports"],
  globals: {
    shopify: "readonly",
  },
  rules: {
    "import/order": [
      "error",
      {
        groups: ["builtin", "external", "parent", "sibling", "index", "type"],
      },
    ],
    "no-unused-vars": "off", // or "@typescript-eslint/no-unused-vars": "off",
    "@typescript-eslint/ban-ts-comment": "off",
    "unused-imports/no-unused-imports": "error",
    "unused-imports/no-unused-vars": [
      "warn",
      {
        vars: "all",
        varsIgnorePattern: "^_",
        args: "after-used",
        argsIgnorePattern: "^_",
      },
    ],
    "tailwindcss/no-custom-classname": [
      "warn",
      {
        whitelist: ["size\\-*"],
      },
    ],
  },
};
