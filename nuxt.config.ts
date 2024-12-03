import { defineNuxtConfig } from "nuxt/config";
import type { ServerOptions } from "vite";

export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  modules: ["@nuxt/ui", "@nuxtjs/supabase", "@pinia/nuxt"],
  supabase: {
    redirect: false,
  },
  runtimeConfig: {
    public: {
      baseurl: process.env.BASE_URL ?? "http://localhost:3000",
    },
  },
  css: ["~/assets/css/main.css"],
});
