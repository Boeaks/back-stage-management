import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'
import WindiCSS from 'vite-plugin-windicss'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    vueDevTools(),
    WindiCSS(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  // 服务
  server: {
      // 代理
      proxy: {
          '/api': {
              target: 'http://ceshi13.dishait.cn', // 代理后台服务器地址
              changeOrigin: true, //允许跨域               
              rewrite: path => path.replace(/^\/api/,'') // 将请求地址中的 /ok 替换成空
          }
      }
  }
})
