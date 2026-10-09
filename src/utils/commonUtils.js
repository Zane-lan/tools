import { ElNotification } from 'element-plus'

/**
 * 通用工具函数
 */
export const commonUtils = {
  /**
   * 复制文本到剪贴板
   * @param {string|number} text - 要复制的文本
   * @param {string} successMessage - 成功提示消息
   */
  async copyToClipboard(text, successMessage = '已复制到剪贴板') {
    try {
      await navigator.clipboard.writeText(text.toString())
      ElNotification({
        title: '成功',
        message: successMessage,
        type: 'success',
        duration: 2000
      })
    } catch (err) {
      // 降级处理：使用传统复制方法
      try {
        const textArea = document.createElement('textarea')
        textArea.value = text.toString()
        textArea.style.position = 'fixed'
        textArea.style.opacity = '0'
        document.body.appendChild(textArea)
        textArea.select()
        document.execCommand('copy')
        document.body.removeChild(textArea)

        ElNotification({
          title: '成功',
          message: successMessage,
          type: 'success',
          duration: 2000
        })
      } catch (fallbackErr) {
        ElNotification({
          title: '错误',
          message: '复制失败，请手动复制',
          type: 'error',
          duration: 3000
        })
        console.error('复制失败：', fallbackErr)
      }
    }
  },

  /**
   * 验证输入
   * @param {any} input - 输入值
   * @param {Function} validator - 验证函数
   * @param {string} errorMessage - 错误消息
   * @returns {boolean} 验证结果
   */
  validateInput(input, validator, errorMessage) {
    if (!validator(input)) {
      ElNotification({
        title: '错误',
        message: errorMessage,
        type: 'error',
        duration: 3000
      })
      return false
    }
    return true
  },

  /**
   * 防抖函数
   * @param {Function} func - 要防抖的函数
   * @param {number} wait - 等待时间（毫秒）
   * @param {boolean} immediate - 是否立即执行
   * @returns {Function} 防抖后的函数
   */
  debounce(func, wait, immediate = false) {
    let timeout
    return function executedFunction(...args) {
      const later = () => {
        timeout = null
        if (!immediate) func.apply(this, args)
      }
      const callNow = immediate && !timeout
      clearTimeout(timeout)
      timeout = setTimeout(later, wait)
      if (callNow) func.apply(this, args)
    }
  },

  /**
   * 节流函数
   * @param {Function} func - 要节流的函数
   * @param {number} limit - 限制时间（毫秒）
   * @returns {Function} 节流后的函数
   */
  throttle(func, limit) {
    let inThrottle
    return function executedFunction(...args) {
      if (!inThrottle) {
        func.apply(this, args)
        inThrottle = true
        setTimeout(() => (inThrottle = false), limit)
      }
    }
  },

  /**
   * 格式化文件大小
   * @param {number} bytes - 字节数
   * @param {number} decimals - 小数位数
   * @returns {string} 格式化后的文件大小
   */
  formatFileSize(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes'

    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
  },

  /**
   * 深拷贝对象
   * @param {any} obj - 要拷贝的对象
   * @returns {any} 拷贝后的对象
   */
  deepClone(obj) {
    if (obj === null || typeof obj !== 'object') return obj
    if (obj instanceof Date) return new Date(obj.getTime())
    if (obj instanceof Array) return obj.map(item => this.deepClone(item))
    if (obj instanceof Object) {
      const clonedObj = {}
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          clonedObj[key] = this.deepClone(obj[key])
        }
      }
      return clonedObj
    }
    return obj
  },

  /**
   * 生成随机字符串
   * @param {number} length - 字符串长度
   * @param {string} chars - 字符集
   * @returns {string} 随机字符串
   */
  generateRandomString(
    length = 8,
    chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  ) {
    let result = ''
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
  },

  /**
   * 检查是否为空值
   * @param {any} value - 要检查的值
   * @returns {boolean} 是否为空
   */
  isEmpty(value) {
    return (
      value === null ||
      value === undefined ||
      value === '' ||
      (Array.isArray(value) && value.length === 0) ||
      (typeof value === 'object' && Object.keys(value).length === 0)
    )
  },

  /**
   * 格式化日期时间
   * @param {Date|string|number} date - 日期
   * @param {string} format - 格式化字符串
   * @returns {string} 格式化后的日期时间
   */
  formatDateTime(date, format = 'YYYY-MM-DD HH:mm:ss') {
    const d = new Date(date)
    if (isNaN(d.getTime())) return ''

    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    const hours = String(d.getHours()).padStart(2, '0')
    const minutes = String(d.getMinutes()).padStart(2, '0')
    const seconds = String(d.getSeconds()).padStart(2, '0')

    return format
      .replace('YYYY', year)
      .replace('MM', month)
      .replace('DD', day)
      .replace('HH', hours)
      .replace('mm', minutes)
      .replace('ss', seconds)
  },

  /**
   * 获取URL参数
   * @param {string} name - 参数名
   * @param {string} url - URL，默认为当前页面
   * @returns {string|null} 参数值
   */
  getUrlParam(name, url = window.location.href) {
    const urlObj = new URL(url)
    return urlObj.searchParams.get(name)
  },

  /**
   * 设置URL参数
   * @param {string} name - 参数名
   * @param {string} value - 参数值
   * @param {boolean} replace - 是否替换当前历史记录
   */
  setUrlParam(name, value, replace = false) {
    const url = new URL(window.location.href)
    url.searchParams.set(name, value)

    if (replace) {
      window.history.replaceState({}, '', url)
    } else {
      window.history.pushState({}, '', url)
    }
  },

  /**
   * 下载文件
   * @param {string} content - 文件内容
   * @param {string} filename - 文件名
   * @param {string} mimeType - MIME类型
   */
  downloadFile(content, filename, mimeType = 'text/plain') {
    const blob = new Blob([content], { type: mimeType })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }
}

/**
 * 验证规则集合
 */
export const validators = {
  /**
   * 验证邮箱格式
   */
  email: email => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  },

  /**
   * 验证手机号格式（中国大陆）
   */
  phone: phone => {
    const phoneRegex = /^1[3-9]\d{9}$/
    return phoneRegex.test(phone)
  },

  /**
   * 验证URL格式
   */
  url: url => {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  },

  /**
   * 验证JSON格式
   */
  json: jsonString => {
    try {
      JSON.parse(jsonString)
      return true
    } catch {
      return false
    }
  },

  /**
   * 验证数字
   */
  number: value => {
    return !isNaN(value) && !isNaN(parseFloat(value))
  },

  /**
   * 验证整数
   */
  integer: value => {
    return Number.isInteger(Number(value))
  },

  /**
   * 验证正整数
   */
  positiveInteger: value => {
    const num = Number(value)
    return Number.isInteger(num) && num > 0
  },

  /**
   * 验证非空字符串
   */
  nonEmptyString: value => {
    return typeof value === 'string' && value.trim().length > 0
  }
}
