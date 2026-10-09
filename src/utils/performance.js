/**
 * 性能监控工具
 */
export const performanceMonitor = {
  // 性能数据存储
  metrics: {
    pageLoad: null,
    componentRender: new Map(),
    apiCalls: new Map(),
    userInteractions: new Map(),
    memoryUsage: []
  },

  // 配置选项
  config: {
    enableConsoleLog: true,
    enableLocalStorage: true,
    maxMetricsCount: 100,
    slowThreshold: {
      component: 100, // 组件渲染超过100ms认为是慢
      api: 2000, // API调用超过2s认为是慢
      pageLoad: 3000 // 页面加载超过3s认为是慢
    }
  },

  /**
   * 初始化性能监控
   */
  init() {
    if (typeof performance === 'undefined') {
      console.warn('Performance API not supported')
      return
    }

    this.monitorPageLoad()
    this.observePerformanceEntries()
    this.setupMemoryMonitoring()
    this.setupErrorMonitoring()

    if (this.config.enableConsoleLog) {
      console.log('🚀 性能监控已启动')
    }
  },

  /**
   * 监控页面加载性能
   */
  monitorPageLoad() {
    if (document.readyState === 'complete') {
      this.collectPageLoadMetrics()
    } else {
      window.addEventListener('load', () => {
        setTimeout(() => this.collectPageLoadMetrics(), 0)
      })
    }
  },

  /**
   * 收集页面加载指标
   */
  collectPageLoadMetrics() {
    try {
      const navigation = performance.getEntriesByType('navigation')[0]
      if (!navigation) return

      const metrics = {
        // 基础时间指标
        dns: navigation.domainLookupEnd - navigation.domainLookupStart,
        tcp: navigation.connectEnd - navigation.connectStart,
        request: navigation.responseStart - navigation.requestStart,
        response: navigation.responseEnd - navigation.responseStart,
        dom: navigation.domContentLoadedEventStart - navigation.domLoading,
        load: navigation.loadEventEnd - navigation.navigationStart,

        // Web Vitals 指标（如果支持）
        fcp: this.getFirstContentfulPaint(),
        lcp: this.getLargestContentfulPaint(),
        fid: this.getFirstInputDelay(),
        cls: this.getCumulativeLayoutShift(),

        // 资源加载统计
        resourceCount: performance.getEntriesByType('resource').length,
        totalResourceSize: this.getTotalResourceSize(),

        // 时间戳
        timestamp: Date.now()
      }

      this.metrics.pageLoad = metrics

      // 检查性能问题
      this.checkPerformanceIssues('pageLoad', metrics)

      if (this.config.enableConsoleLog) {
        console.group('📊 页面加载性能')
        console.log('DNS查询:', `${metrics.dns.toFixed(2)}ms`)
        console.log('TCP连接:', `${metrics.tcp.toFixed(2)}ms`)
        console.log('请求响应:', `${(metrics.request + metrics.response).toFixed(2)}ms`)
        console.log('DOM解析:', `${metrics.dom.toFixed(2)}ms`)
        console.log('页面加载完成:', `${metrics.load.toFixed(2)}ms`)
        console.log('资源数量:', metrics.resourceCount)
        console.groupEnd()
      }

      // 存储到本地
      this.saveMetricsToLocalStorage()
    } catch (error) {
      console.error('收集页面加载指标失败:', error)
    }
  },

  /**
   * 获取首次内容绘制时间
   */
  getFirstContentfulPaint() {
    try {
      const paintEntries = performance.getEntriesByType('paint')
      const fcpEntry = paintEntries.find(entry => entry.name === 'first-contentful-paint')
      return fcpEntry ? Math.round(fcpEntry.startTime) : null
    } catch {
      return null
    }
  },

  /**
   * 获取最大内容绘制时间（简化版）
   */
  getLargestContentfulPaint() {
    try {
      // 这里简化处理，实际项目中需要使用 PerformanceObserver
      const navEntry = performance.getEntriesByType('navigation')[0]
      return navEntry ? Math.round(navEntry.loadEventEnd - navEntry.startTime) : null
    } catch {
      return null
    }
  },

  /**
   * 获取首次输入延迟
   */
  getFirstInputDelay() {
    try {
      // 简化处理，实际项目中需要使用 PerformanceObserver
      return 0
    } catch {
      return null
    }
  },

  /**
   * 获取累积布局偏移
   */
  getCumulativeLayoutShift() {
    try {
      // 简化处理，实际项目中需要使用 PerformanceObserver
      return 0
    } catch {
      return null
    }
  },

  /**
   * 获取总资源大小
   */
  getTotalResourceSize() {
    try {
      const resources = performance.getEntriesByType('resource')
      return resources.reduce((total, resource) => {
        return total + (resource.transferSize || 0)
      }, 0)
    } catch {
      return 0
    }
  },

  /**
   * 观察性能条目
   */
  observePerformanceEntries() {
    try {
      const observer = new PerformanceObserver(list => {
        for (const entry of list.getEntries()) {
          this.handlePerformanceEntry(entry)
        }
      })

      observer.observe({ entryTypes: ['measure', 'navigation', 'resource'] })
    } catch (error) {
      console.warn('PerformanceObserver not supported:', error)
    }
  },

  /**
   * 处理性能条目
   */
  handlePerformanceEntry(entry) {
    switch (entry.entryType) {
      case 'measure':
        this.recordComponentMetric(entry.name, entry.duration)
        break
      case 'resource':
        this.recordResourceMetric(entry)
        break
    }
  },

  /**
   * 设置内存监控
   */
  setupMemoryMonitoring() {
    if (!performance.memory) return

    const monitorMemory = () => {
      try {
        const memoryInfo = {
          used: Math.round(performance.memory.usedJSHeapSize / 1024 / 1024),
          total: Math.round(performance.memory.totalJSHeapSize / 1024 / 1024),
          limit: Math.round(performance.memory.jsHeapSizeLimit / 1024 / 1024),
          timestamp: Date.now()
        }

        this.metrics.memoryUsage.push(memoryInfo)

        // 限制数据量
        if (this.metrics.memoryUsage.length > 100) {
          this.metrics.memoryUsage.splice(0, 50)
        }

        // 检查内存使用率
        const usagePercent = (memoryInfo.used / memoryInfo.limit) * 100
        if (usagePercent > 80) {
          console.warn(`⚠️ 内存使用率过高: ${usagePercent.toFixed(1)}%`)
        }
      } catch (error) {
        console.warn('内存监控失败:', error)
      }
    }

    // 每5秒监控一次
    setInterval(monitorMemory, 5000)
    monitorMemory() // 立即执行一次
  },

  /**
   * 设置错误监控
   */
  setupErrorMonitoring() {
    window.addEventListener('error', event => {
      this.recordUserInteraction('error', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno
      })
    })
  },

  /**
   * 记录组件性能指标
   */
  recordComponentMetric(componentName, duration) {
    if (!this.metrics.componentRender.has(componentName)) {
      this.metrics.componentRender.set(componentName, {
        count: 0,
        totalTime: 0,
        avgTime: 0,
        maxTime: 0,
        minTime: Infinity
      })
    }

    const metric = this.metrics.componentRender.get(componentName)
    metric.count++
    metric.totalTime += duration
    metric.avgTime = metric.totalTime / metric.count
    metric.maxTime = Math.max(metric.maxTime, duration)
    metric.minTime = Math.min(metric.minTime, duration)

    this.checkPerformanceIssues('component', {
      name: componentName,
      duration
    })

    if (this.config.enableConsoleLog && duration > this.config.slowThreshold.component) {
      console.warn(`🐌 慢组件: ${componentName} (${duration.toFixed(2)}ms)`)
    }
  },

  /**
   * 记录资源性能指标
   */
  recordResourceMetric(entry) {
    if (entry.duration > this.config.slowThreshold.api) {
      console.warn(`🐌 慢资源: ${entry.name} (${entry.duration.toFixed(2)}ms)`)
    }

    this.recordUserInteraction('resource', {
      name: entry.name,
      duration: entry.duration,
      size: entry.transferSize || 0
    })
  },

  /**
   * 记录用户交互
   */
  recordUserInteraction(type, data) {
    if (!this.metrics.userInteractions.has(type)) {
      this.metrics.userInteractions.set(type, [])
    }

    const interactions = this.metrics.userInteractions.get(type)
    interactions.push({
      ...data,
      timestamp: Date.now()
    })

    // 限制数据量
    if (interactions.length > this.config.maxMetricsCount) {
      interactions.splice(0, this.config.maxMetricsCount / 2)
    }
  },

  /**
   * 记录API调用性能
   */
  startApiMeasure(url) {
    const startTime = performance.now()
    return {
      url,
      startTime,
      end: () => {
        const duration = performance.now() - startTime
        this.recordApiMetric(url, duration)
        return duration
      }
    }
  },

  /**
   * 记录API指标
   */
  recordApiMetric(url, duration) {
    const urlObj = new URL(url, window.location.origin)
    const endpoint = `${urlObj.pathname}${urlObj.search}`

    if (!this.metrics.apiCalls.has(endpoint)) {
      this.metrics.apiCalls.set(endpoint, {
        count: 0,
        totalTime: 0,
        avgTime: 0,
        maxTime: 0
      })
    }

    const metric = this.metrics.apiCalls.get(endpoint)
    metric.count++
    metric.totalTime += duration
    metric.avgTime = metric.totalTime / metric.count
    metric.maxTime = Math.max(metric.maxTime, duration)

    if (duration > this.config.slowThreshold.api) {
      console.warn(`🐌 慢API: ${endpoint} (${duration.toFixed(2)}ms)`)
    }
  },

  /**
   * 检查性能问题
   */
  checkPerformanceIssues(type, data) {
    const thresholds = this.config.slowThreshold
    let issue = null

    switch (type) {
      case 'pageLoad':
        if (data.load > thresholds.pageLoad) {
          issue = `页面加载过慢 (${data.load.toFixed(2)}ms)`
        }
        break
      case 'component':
        if (data.duration > thresholds.component) {
          issue = `组件渲染过慢: ${data.name} (${data.duration.toFixed(2)}ms)`
        }
        break
    }

    if (issue && this.config.enableConsoleLog) {
      console.warn(`⚠️ 性能问题: ${issue}`)
    }
  },

  /**
   * 测量组件性能（返回一个结束函数）
   */
  measureComponent(componentName) {
    const markName = `${componentName}-${Date.now()}`
    performance.mark(`${markName}-start`)

    return {
      end: () => {
        try {
          performance.mark(`${markName}-end`)
          performance.measure(componentName, `${markName}-start`, `${markName}-end`)

          const measure = performance.getEntriesByName(componentName, 'measure').pop()
          if (measure) {
            this.recordComponentMetric(componentName, measure.duration)
          }

          // 清理标记
          performance.clearMarks(`${markName}-start`)
          performance.clearMarks(`${markName}-end`)
        } catch (error) {
          console.warn(`组件性能测量失败: ${componentName}`, error)
        }
      }
    }
  },

  /**
   * 获取性能报告
   */
  getPerformanceReport() {
    return {
      pageLoad: this.metrics.pageLoad,
      components: Object.fromEntries(this.metrics.componentRender),
      apiCalls: Object.fromEntries(this.metrics.apiCalls),
      memoryUsage: this.metrics.memoryUsage.slice(-10), // 最近10次
      timestamp: Date.now()
    }
  },

  /**
   * 保存指标到本地存储
   */
  saveMetricsToLocalStorage() {
    if (!this.config.enableLocalStorage) return

    try {
      localStorage.setItem(
        'performanceMetrics',
        JSON.stringify({
          ...this.metrics,
          componentRender: Object.fromEntries(this.metrics.componentRender),
          apiCalls: Object.fromEntries(this.metrics.apiCalls),
          userInteractions: Object.fromEntries(this.metrics.userInteractions)
        })
      )
    } catch (error) {
      console.warn('保存性能指标失败:', error)
    }
  },

  /**
   * 从本地存储加载指标
   */
  loadMetricsFromLocalStorage() {
    if (!this.config.enableLocalStorage) return

    try {
      const stored = localStorage.getItem('performanceMetrics')
      if (stored) {
        const data = JSON.parse(stored)
        this.metrics.pageLoad = data.pageLoad
        this.metrics.componentRender = new Map(Object.entries(data.componentRender || {}))
        this.metrics.apiCalls = new Map(Object.entries(data.apiCalls || {}))
        this.metrics.userInteractions = new Map(Object.entries(data.userInteractions || {}))
        this.metrics.memoryUsage = data.memoryUsage || []
      }
    } catch (error) {
      console.warn('加载性能指标失败:', error)
    }
  },

  /**
   * 清除所有性能指标
   */
  clearMetrics() {
    this.metrics.pageLoad = null
    this.metrics.componentRender.clear()
    this.metrics.apiCalls.clear()
    this.metrics.userInteractions.clear()
    this.metrics.memoryUsage = []

    if (this.config.enableLocalStorage) {
      localStorage.removeItem('performanceMetrics')
    }

    console.log('🧹 性能指标已清除')
  }
}
