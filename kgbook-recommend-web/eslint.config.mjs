import js from "@eslint/js";
import tsEslint from "typescript-eslint";
import eslintConfigPrettier from "eslint-config-prettier";
import nuxtEslintConfig from "@nuxt/eslint";
import eslintPluginVue from "eslint-plugin-vue";

export default tsEslint.config(
  {
    extends: [
      js.configs.recommended,
      eslintPluginVue.configs["flat/recommended"],
      eslintPluginVue.configs["flat/strongly-recommended"],
      nuxtEslintConfig,
    ],
    files: ["**.*.{ts,vue}"],
  },
  eslintConfigPrettier,
);
