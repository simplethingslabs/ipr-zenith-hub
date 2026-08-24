import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    // `api/` is a separate Node/Express project with its own tsconfig and its own
    // conventions. Linting it with the frontend's browser-globals config produced
    // 19 errors that were all false signal — Express's `Request<{}, {}, Body>`
    // generics legitimately use `{}`, and there is no React in it at all.
    ignores: ["dist", "api/**", "scripts/**"],
  },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
      "@typescript-eslint/no-unused-vars": "off",
      // shadcn/ui generates `interface Props extends React.ComponentProps<T> {}`
      // as an extension point. It is intentional, not an oversight.
      "@typescript-eslint/no-empty-object-type": "off",
    },
  },
  {
    // Tailwind's config is CommonJS-flavoured by design.
    files: ["tailwind.config.ts"],
    rules: { "@typescript-eslint/no-require-imports": "off" },
  },
);
