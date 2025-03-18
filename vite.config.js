import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  base: './', // 设置为相对路径，适合部署到任何目录
  // 或者 base: '/TransToWhat/', // 如果部署到特定子目录
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  }
})