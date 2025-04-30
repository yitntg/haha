import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import fs from 'fs'

// 阻止_headers生成的插件
const removeHeadersPlugin = {
  name: 'remove-headers',
  closeBundle() {
    const headersPath = path.resolve(__dirname, 'dist/_headers')
    if (fs.existsSync(headersPath)) {
      fs.unlinkSync(headersPath)
      console.log('已删除 _headers 文件')
    }
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  base: '/',
  plugins: [
    vue(),
    removeHeadersPlugin
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  server: {
    port: 3000,
    open: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true
      }
    }
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets'
  },
  optimizeDeps: {
    include: ['@amap/amap-jsapi-loader']
  }
}) 