import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  base: '/tools/',

  // 构建优化
  build: {
    rollupOptions: {
      output: {
        // 代码分割
        manualChunks: {
          'element-plus': ['element-plus'],
          'vue-vendor': ['vue', 'vue-router'],
          'vue-json-pretty': ['vue-json-pretty']
        }
      }
    },
    // 警告限制
    chunkSizeWarningLimit: 1000,
    // 启用sourcemap
    sourcemap: true
  },

  // 路径解析
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@components': resolve(__dirname, 'src/components'),
      '@views': resolve(__dirname, 'src/views'),
      '@utils': resolve(__dirname, 'src/utils')
    }
  },

  // 依赖预构建优化
  optimizeDeps: {
    include: ['vue', 'vue-router', 'element-plus', 'vue-json-pretty']
  },

  // 开发服务器优化
  server: {
    port: 3000,
    open: true,
    cors: true,
    hmr: {
      overlay: true
    }
  },

  // CSS 优化
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: '@import "@/assets/styles/variables.css";'
      }
    }
  }
})
