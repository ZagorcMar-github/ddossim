// https://nuxt.com/docs/api/configuration/nuxt-config
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'
export default defineNuxtConfig({
  devtools: { enabled: true },

  css:['vuetify/lib/styles/main.sass','@mdi/font/css/materialdesignicons.min.css','~/layouts/global.css'],
  build:{
    transpile:['vuetify']
  },modules: [
    '@pinia/nuxt',
    (_options, nuxt) => {
      nuxt.hooks.hook('vite:extendConfig', (config) => {
        // @ts-expect-error
        config.plugins.push(vuetify({ autoImport: true }))
      })
    },
    //...
  ],
  vite: {
    server: {
      proxy: {
        '/api': {
          target: 'https://localhost:7270/',
          rewrite: (path) => path.replace(/^\/api/, ''),
          changeOrigin: true,
          secure: false,
        }
      }
    },
    vue: {
      template: {
        transformAssetUrls,
      },
    },
  },
})
