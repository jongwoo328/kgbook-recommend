import withNuxt from "./.nuxt/eslint.config.mjs";

import js from "@eslint/js";
import tsEslint from "typescript-eslint";
import eslintPluginVue from "eslint-plugin-vue";
import eslintConfigPrettier from "eslint-config-prettier";

export default withNuxt(
  js.configs.recommended,
  tsEslint.configs.recommended,
  eslintPluginVue.configs["flat/recommended"],
  eslintPluginVue.configs["flat/strongly-recommended"],
  eslintConfigPrettier,
  {
    files: ["**/*.{ts,vue}"],
  },
);
