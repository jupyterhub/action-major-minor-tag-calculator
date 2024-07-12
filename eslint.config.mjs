// https://eslint.org/docs/latest/use/configure/migration-guide#start-using-flat-config-files

import jest from "eslint-plugin-jest";
import globals from "globals";
import js from "@eslint/js";

export default [
  js.configs.recommended,
  {
    ignores: ["dist/*", "lib/*", "node_modules/*"],
  },
  {
    plugins: {
      jest,
    },

    files: ["__tests__/**"],
    ...jest.configs["flat/recommended"],
    rules: {
      ...jest.configs["flat/recommended"].rules,
    },
  },

  {
    files: ["**/*.*js"],
    languageOptions: {
      globals: {
        ...globals.node,
      },

      // https://node.green/#ES2022
      ecmaVersion: 2022,
      sourceType: "module",
    },
  },
];
