import js from "@eslint/js";
import babelParser from "@babel/eslint-parser";
import babel from "@babel/eslint-plugin";

export default [
  {
    ignores: [
      "test-babel/**",
      "test-typescript/**",
      "**/*.d.ts",
      "**/*.test-d.ts",
    ],
  },
  js.configs.recommended,
  {
    files: ["test/**/*.ts"],
    languageOptions: {
      parser: babelParser,
    },
    plugins: {
      babel,
    },
    rules: {
      "babel/new-cap": "error", // handles decorators
      "no-undef": "off", // replaced by @babel/no-undef
      "babel/no-undef": "error", // handles auto-accessors
      "babel/semi": "error", // handles class properties
      "no-unused-vars": "off", // TypeScript requires decorator signatures to exactly match
    },
  },
];
