import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { fileURLToPath, URL } from 'node:url'


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(),
  AutoImport({
    resolvers: [ElementPlusResolver()],
  }),
  Components({
    resolvers: [ElementPlusResolver()],
  }),
  ],
  server: {
    proxy: {
      '/api': {
        // ºóÌ¨µØÖ·
        target: 'http://127.0.0.1:8080/',
        changeOrigin: true,
        ws: true,
        rewrite: path => path.replace(/^\/api/, '')
      }
    }
  },


})


