import { ElNotification, ElMessage } from 'element-plus'

/**
 * 增强的错误处理器
 */
export const errorHandler = (error, instance, info) => {
  console.group('🚨 应用错误')
  console.error('Error:', error)
  console.error('Instance:', instance)
  console.error('Info:', info)
  console.groupEnd()

  // 分析错误类型并显示相应的提示
  const errorInfo = analyzeError(error)

  // 显示用户友好的错误提示
  showErrorNotification(errorInfo)

  // 记录错误日志
  logError({
    ...errorInfo,
    originalError: error,
    instance,
    info,
    userAgent: navigator.userAgent,
    url: window.location.href,
    timestamp: Date.now()
  })

  // 如果是严重错误，上报到服务器
  if (errorInfo.severity === 'critical') {
    reportError(errorInfo)
  }
}

/**
 * 分析错误类型
 */
export const analyzeError = error => {
  const errorMap = {
    // 网络相关错误
    NetworkError: {
      type: '网络错误',
      message: '网络连接失败，请检查网络设置',
      severity: 'high',
      suggestion: '检查网络连接或稍后重试'
    },
    TimeoutError: {
      type: '超时错误',
      message: '请求超时，请稍后重试',
      severity: 'medium',
      suggestion: '检查网络连接或减少请求量'
    },

    // 验证相关错误
    ValidationError: {
      type: '验证错误',
      message: '输入数据格式不正确',
      severity: 'low',
      suggestion: '请检查输入的数据格式'
    },
    TypeError: {
      type: '类型错误',
      message: '数据类型错误',
      severity: 'medium',
      suggestion: '检查传入的数据类型'
    },

    // 权限相关错误
    PermissionError: {
      type: '权限错误',
      message: '没有执行此操作的权限',
      severity: 'high',
      suggestion: '请联系管理员获取相应权限'
    },

    // 文件相关错误
    FileError: {
      type: '文件错误',
      message: '文件操作失败',
      severity: 'medium',
      suggestion: '检查文件格式或重新选择文件'
    }
  }

  // 根据错误名称或消息匹配错误类型
  const errorName = error.name || 'UnknownError'
  const matchedError = errorMap[errorName] || {
    type: '未知错误',
    message: error.message || '发生了未知错误',
    severity: 'medium',
    suggestion: '请刷新页面重试'
  }

  return {
    ...matchedError,
    originalMessage: error.message,
    stack: error.stack,
    code: error.code
  }
}

/**
 * 显示错误通知
 */
const showErrorNotification = errorInfo => {
  const { type, message, severity, suggestion } = errorInfo

  // 根据严重程度选择通知类型
  let notificationType = 'error'
  let duration = 5000

  switch (severity) {
    case 'low':
      notificationType = 'warning'
      duration = 3000
      break
    case 'medium':
      notificationType = 'error'
      duration = 4000
      break
    case 'high':
      notificationType = 'error'
      duration = 5000
      break
    case 'critical':
      notificationType = 'error'
      duration = 6000
      break
  }

  ElNotification({
    title: type,
    message: `${message}${suggestion ? `\n\n建议：${suggestion}` : ''}`,
    type: notificationType,
    duration,
    position: 'top-right',
    showClose: true,
    dangerouslyUseHTMLString: true
  })
}

/**
 * 错误日志收集
 */
const logError = errorInfo => {
  try {
    // 本地存储错误日志
    const errorLogs = JSON.parse(localStorage.getItem('errorLogs') || '[]')

    // 限制日志数量
    if (errorLogs.length >= 100) {
      errorLogs.splice(0, 50) // 删除最旧的50条记录
    }

    errorLogs.push({
      ...errorInfo,
      id: generateErrorId(),
      timestamp: Date.now()
    })

    localStorage.setItem('errorLogs', JSON.stringify(errorLogs))

    // 开发环境下输出详细错误信息
    if (import.meta.env.DEV) {
      console.group('📝 错误日志已记录')
      console.log('错误ID:', errorInfo.id)
      console.log('错误类型:', errorInfo.type)
      console.log('错误信息:', errorInfo.message)
      console.log('严重程度:', errorInfo.severity)
      console.groupEnd()
    }
  } catch (logError) {
    console.error('记录错误日志失败:', logError)
  }
}

/**
 * 生成错误ID
 */
const generateErrorId = () => {
  return `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

/**
 * 上报严重错误到服务器
 */
const reportError = async errorInfo => {
  try {
    // 这里可以集成错误上报服务，如 Sentry、LogRocket 等
    const reportData = {
      ...errorInfo,
      version: import.meta.env.VITE_APP_VERSION || '1.0.0',
      environment: import.meta.env.MODE,
      timestamp: Date.now()
    }

    // 模拟上报（实际项目中替换为真实的上报接口）
    if (import.meta.env.PROD && window.location.hostname !== 'localhost') {
      // await fetch('/api/error-report', {
      //     method: 'POST',
      //     headers: { 'Content-Type': 'application/json' },
      //     body: JSON.stringify(reportData)
      // })
    }

    console.log('错误已上报:', reportData)
  } catch (reportError) {
    console.error('错误上报失败:', reportError)
  }
}

/**
 * 获取错误日志
 */
export const getErrorLogs = () => {
  try {
    return JSON.parse(localStorage.getItem('errorLogs') || '[]')
  } catch {
    return []
  }
}

/**
 * 清除错误日志
 */
export const clearErrorLogs = () => {
  try {
    localStorage.removeItem('errorLogs')
    ElMessage.success('错误日志已清除')
  } catch {
    ElMessage.error('清除错误日志失败')
  }
}

/**
 * 导出错误日志
 */
export const exportErrorLogs = () => {
  try {
    const logs = getErrorLogs()
    const logData = JSON.stringify(logs, null, 2)

    const blob = new Blob([logData], { type: 'application/json' })
    const url = URL.createObjectURL(blob)

    const a = document.createElement('a')
    a.href = url
    a.download = `error_logs_${new Date().toISOString().slice(0, 10)}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    ElMessage.success('错误日志已导出')
  } catch {
    ElMessage.error('导出错误日志失败')
  }
}

/**
 * 自定义错误类
 */
export class AppError extends Error {
  constructor(message, type = 'AppError', severity = 'medium', code = null) {
    super(message)
    this.name = type
    this.severity = severity
    this.code = code
    this.timestamp = Date.now()
  }
}

export class ValidationError extends AppError {
  constructor(message, field = null) {
    super(message, 'ValidationError', 'low')
    this.field = field
  }
}

export class NetworkError extends AppError {
  constructor(message = '网络连接失败') {
    super(message, 'NetworkError', 'high')
  }
}

export class TimeoutError extends AppError {
  constructor(message = '请求超时') {
    super(message, 'TimeoutError', 'medium')
  }
}

export class PermissionError extends AppError {
  constructor(message = '权限不足') {
    super(message, 'PermissionError', 'high')
  }
}

/**
 * 全局错误处理工厂
 */
export const createGlobalErrorHandler = () => {
  // 处理未捕获的 Promise 错误
  window.addEventListener('unhandledrejection', event => {
    errorHandler(
      new AppError(event.reason?.message || 'Promise rejected', 'UnhandledRejection'),
      null,
      'unhandledrejection'
    )
    event.preventDefault()
  })

  // 处理全局 JavaScript 错误
  window.addEventListener('error', event => {
    errorHandler(
      event.error || new AppError(event.message, 'JavaScriptError'),
      null,
      'javascript-error'
    )
  })

  // Vue 错误处理器（在 main.js 中使用）
  return {
    handler: errorHandler,
    analyzeError,
    getErrorLogs,
    clearErrorLogs,
    exportErrorLogs
  }
}
