import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path';
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    createSvgIconsPlugin({
      // 指定需要缓存的图标文件夹
      iconDirs: [path.resolve(process.cwd(), 'src/assets/icons')],
      // 指定symbolId格式
      symbolId: 'icon-[dir]-[name]'
    })
  ],
  // 配置别名，如果使用了typescript，需要配置tsconfig.js文件，确保 compilerOptions 字段中存在 baseUrl 和 paths 属性
  resolve: {
    alias: {
      // __dirname 是一个 Node.js 的全局变量，它指向当前执行脚本所在的目录，path.resolve 方法用于将路径或路径段解析为绝对路径。
      '@': path.resolve(__dirname, 'src'),
    }
  }
})
