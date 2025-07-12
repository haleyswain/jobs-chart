import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://dsg-api-test.k2-app.com',
        changeOrigin: true,
        secure: true,
        headers: {
          'Origin': 'https://dsg-api-test.k2-app.com',
        },
        rewrite: (path) => path.replace(/^\/api/, '/ats/search/all'),
      },
    },
  },
})
