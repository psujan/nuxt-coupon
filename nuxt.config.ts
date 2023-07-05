export default defineNuxtConfig({
  devtools: { enabled: false },
  css: [`assets/css/index.css`],
  ssr:false,
  modules: ["@nuxtjs/tailwindcss", "nuxt-icon"],
});
