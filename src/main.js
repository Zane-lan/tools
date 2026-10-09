import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

// 导入样式文件
import '@/assets/styles/variables.css'
import '@/assets/styles/common.css'

// 导入工具函数
import { performanceMonitor } from '@/utils/performance.js'
import { createGlobalErrorHandler, AppError } from '@/utils/errorHandler.js'

// 创建应用实例
const app = createApp(App)

// 配置全局错误处理
const globalErrorHandler = createGlobalErrorHandler()
app.config.errorHandler = globalErrorHandler.handler
app.config.warnHandler = (msg, vm, trace) => {
  console.warn(`[Vue Warning]: ${msg}`)
  if (import.meta.env.DEV) {
    console.warn('Trace:', trace)
  }
}

// 配置全局属性
app.config.globalProperties.$filters = {
  // 可以在这里添加全局过滤器
}

// 性能监控初始化
if (import.meta.env.PROD || import.meta.env.DEV) {
  performanceMonitor.init()
}

// 开发环境下的调试工具
if (import.meta.env.DEV) {
  // 添加全局调试工具
  window.__app__ = app
  window.__performance__ = performanceMonitor
  window.__errorHandler__ = globalErrorHandler

  // 添加错误模拟工具（用于测试）
  window.__simulateError__ = (type = 'general') => {
    switch (type) {
      case 'vue':
        throw new AppError('这是一个Vue应用错误', 'VueError', 'medium')
      case 'network':
        throw new AppError('网络连接失败', 'NetworkError', 'high')
      case 'validation':
        throw new AppError('输入数据验证失败', 'ValidationError', 'low')
      default:
        throw new Error('这是一个普通错误')
    }
  }

  console.log('🛠️ 开发工具已加载，使用 window.__simulateError__(type) 模拟错误')
}

// 生产环境下的优化
if (import.meta.env.PROD) {
  // 移除开发工具警告
  app.config.warnHandler = null

  // 添加生产环境错误上报
  app.config.errorHandler = (error, instance, info) => {
    globalErrorHandler.handler(error, instance, info)

    // 生产环境下可以添加额外的错误上报逻辑
    if (window.gtag) {
      window.gtag('event', 'exception', {
        description: error.message,
        fatal: false
      })
    }
  }
}

// 插件注册
app.use(router)
app.use(ElementPlus, {
  // Element Plus 全局配置
  size: 'default',
  zIndex: 3000
})

// 全局组件注册（可选）
// app.component('BaseButton', BaseButton)

// 挂载应用
app.mount('#app')

// 应用启动后的初始化
setTimeout(() => {
  // 检查浏览器兼容性
  if (!window.Promise || !window.Map || !window.Set) {
    console.warn('⚠️ 检测到浏览器兼容性问题，建议升级浏览器')
  }

  // 检查网络连接状态
  if (navigator.connection) {
    const connection = navigator.connection
    if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
      console.warn('⚠️ 检测到网络连接较慢，可能会影响用户体验')
    }
  }

  // 记录应用启动完成
  console.log('✅ 应用启动完成')

  // 开发环境下显示性能指标
  if (import.meta.env.DEV && performanceMonitor.metrics.pageLoad) {
    const metrics = performanceMonitor.metrics.pageLoad
    console.group('🚀 启动性能指标')
    console.log(`页面加载时间: ${metrics.load.toFixed(2)}ms`)
    console.log(`DOM解析时间: ${metrics.dom.toFixed(2)}ms`)
    console.log(`资源数量: ${metrics.resourceCount}`)
    console.groupEnd()
  }
}, 100)
