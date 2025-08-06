// https://nuxt.com/docs/api/configuration/nuxt-config
import Nora from "@primeuix/themes/nora";
import { definePreset } from "@primeuix/themes";

const CustomPreset = definePreset(Nora, {
  semantic: {
    primary: {
      50: "{teal.50}",
      100: "{teal.100}",
      200: "{teal.200}",
      300: "{teal.300}",
      400: "{teal.400}",
      500: "{teal.500}",
      600: "{teal.600}",
      700: "{teal.700}",
      800: "{teal.800}",
      900: "{teal.900}",
      950: "{teal.950}",
    },
  },
});

export default defineNuxtConfig({
  compatibilityDate: "2025-05-15",
  devtools: { enabled: true },
  modules: [
    "@nuxt/icon",
    "@nuxt/eslint",
    "@nuxtjs/tailwindcss",
    "@primevue/nuxt-module",
    "@vueuse/nuxt",
    "motion-v/nuxt",
    "@pinia/nuxt",
  ],
  devServer: {
    port: 8000,
  },
  nitro: {
    esbuild: {
      options: {
        target: "esnext",
      },
    },
  },
  primevue: {
    options: {
      theme: {
        preset: CustomPreset,
      },
    },
  },
  app: {
    head: {
      htmlAttrs: {
        lang: "ko",
      },
      link: [
        {
          rel: "stylesheet",
          type: "text/css",
          href: "https://cdn.rawgit.com/moonspam/NanumSquare/master/nanumsquare.css",
        },
      ],
    },
  },
  css: ["~/assets/css/reset.css", "~/assets/css/global.css"],
});
