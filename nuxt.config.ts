import { defineNuxtConfig } from 'nuxt/config'
import type { ServerOptions } from 'vite'

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
  ui: {},
  vite: {
    server: {
      port: 3000,
      strictPort: true,
      hmr: {
        port: 24678,
        protocol: 'ws',
        host: 'localhost'
      }
    } as Partial<ServerOptions>
  }
});