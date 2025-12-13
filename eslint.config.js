import js from "@eslint/js";
import globals from "globals";

export default [
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 2024,
      sourceType: "module",
      globals: {
        ...globals.node,
        ...globals.es2024,
        // Custom globals
        otel: "readonly",
      },
    },
    rules: {
      // Possible Errors
      "no-console": "off",
      "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],

      // Best Practices
      "eqeqeq": ["error", "always"],
      "no-eval": "error",
      "no-implied-eval": "error",
      "no-return-await": "error",
      "require-await": "warn",

      // Variables
      "no-shadow": "warn",
      "no-use-before-define": ["error", { functions: false }],

      // Stylistic
      "semi": ["error", "always"],
      "quotes": ["error", "double", { allowTemplateLiterals: true }],
      "indent": ["error", 2, { SwitchCase: 1 }],
      "comma-dangle": ["error", "always-multiline"],
      "no-trailing-spaces": "error",
      "no-multiple-empty-lines": ["error", { max: 2 }],

      // ES6
      "prefer-const": "error",
      "no-var": "error",
      "arrow-spacing": "error",
      "prefer-arrow-callback": "warn",
      "prefer-template": "warn",
    },
  },
  {
    ignores: [
      "node_modules/**",
      "signoz/**",
      "common/**",
      "*.min.js",
    ],
  },
];

