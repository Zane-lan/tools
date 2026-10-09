<template>
  <div class="unix-timestamp">
    <div class="container">
      <!-- 实时时间戳 -->
      <div class="section">
        <h2>当前 Unix 时间戳</h2>
        <div class="timestamp-container">
          <p class="timestamp">{{ timestamp }}</p>
          <p class="formatted-time">{{ formattedTime }}</p>
        </div>
        <button class="btn btn-primary" @click="copyToClipboard(timestamp, '时间戳已复制')">
          复制时间戳
        </button>
      </div>

      <!-- 时间转时间戳 -->
      <div class="section">
        <h2>时间转时间戳</h2>
        <div class="input-group">
          <input
            v-model="timeInput"
            placeholder="YYYY-MM-DD HH:mm:ss"
            class="input"
            :class="{ 'input-error': timeInputError }"
            @keyup.enter="convertTimeToTimestamp"
          />
          <button
            :disabled="!timeInput.trim()"
            class="btn btn-primary"
            @click="convertTimeToTimestamp"
          >
            转换
          </button>
        </div>
        <p v-if="timeInputError" class="error-message">{{ timeInputError }}</p>
        <p v-if="convertedTimestamp" class="result">
          时间戳：{{ convertedTimestamp }}
          <button
            class="btn btn-sm btn-success"
            @click="copyToClipboard(convertedTimestamp, '时间戳已复制')"
          >
            复制
          </button>
        </p>
      </div>

      <!-- 时间戳转时间 -->
      <div class="section">
        <h2>时间戳转时间</h2>
        <div class="input-group">
          <input
            v-model="timestampInput"
            placeholder="输入时间戳（毫秒）"
            class="input"
            :class="{ 'input-error': timestampInputError }"
            @keyup.enter="convertTimestampToTime"
          />
          <button
            :disabled="!timestampInput.trim()"
            class="btn btn-primary"
            @click="convertTimestampToTime"
          >
            转换
          </button>
        </div>
        <p v-if="timestampInputError" class="error-message">{{ timestampInputError }}</p>
        <p v-if="convertedTime" class="result">
          时间：{{ convertedTime }}
          <button
            class="btn btn-sm btn-success"
            @click="copyToClipboard(convertedTime, '时间已复制')"
          >
            复制
          </button>
        </p>
      </div>

      <!-- 快捷操作 -->
      <div class="section">
        <h2>快捷操作</h2>
        <div class="quick-actions">
          <button class="btn btn-ghost" @click="setCurrentTime">填充当前时间</button>
          <button class="btn btn-ghost" @click="clearAll">清空所有</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref, onMounted, onUnmounted, computed } from 'vue'
  import { ElNotification } from 'element-plus'
  import { commonUtils, validators } from '@/utils/commonUtils.js'

  // 响应式数据
  const timestamp = ref(Date.now())
  const timeInput = ref('')
  const timestampInput = ref('')
  const convertedTimestamp = ref(null)
  const convertedTime = ref(null)
  const timeInputError = ref('')
  const timestampInputError = ref('')

  let animationFrameId = null

  // 计算属性
  const formattedTime = computed(() => {
    return commonUtils.formatDateTime(timestamp.value)
  })

  // 更新时间戳 - 使用 requestAnimationFrame 优化性能
  const updateTimestamp = () => {
    timestamp.value = Date.now()
    animationFrameId = requestAnimationFrame(updateTimestamp)
  }

  // 组件生命周期
  onMounted(() => {
    updateTimestamp()
  })

  onUnmounted(() => {
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId)
    }
  })

  // 复制功能
  const copyToClipboard = (text, message) => {
    commonUtils.copyToClipboard(text, message)
  }

  // 验证时间输入
  const validateTimeInput = input => {
    if (!input.trim()) {
      timeInputError.value = '请输入时间'
      return false
    }

    const date = new Date(input)
    if (isNaN(date.getTime())) {
      timeInputError.value = '时间格式不正确，请使用 YYYY-MM-DD HH:mm:ss 格式'
      return false
    }

    timeInputError.value = ''
    return true
  }

  // 验证时间戳输入
  const validateTimestampInput = input => {
    if (!input.trim()) {
      timestampInputError.value = '请输入时间戳'
      return false
    }

    const timestampValue = parseInt(input, 10)
    if (isNaN(timestampValue) || timestampValue < 0) {
      timestampInputError.value = '请输入有效的时间戳（正整数）'
      return false
    }

    timestampInputError.value = ''
    return true
  }

  // 时间转时间戳
  const convertTimeToTimestamp = () => {
    if (!validateTimeInput(timeInput.value)) {
      return
    }

    try {
      const date = new Date(timeInput.value)
      convertedTimestamp.value = date.getTime()

      ElNotification({
        title: '成功',
        message: '时间转换成功',
        type: 'success',
        duration: 2000
      })
    } catch (error) {
      ElNotification({
        title: '错误',
        message: '时间转换失败',
        type: 'error',
        duration: 3000
      })
    }
  }

  // 时间戳转时间
  const convertTimestampToTime = () => {
    if (!validateTimestampInput(timestampInput.value)) {
      return
    }

    try {
      const timestampValue = parseInt(timestampInput.value, 10)
      const date = new Date(timestampValue)
      convertedTime.value = commonUtils.formatDateTime(date)

      ElNotification({
        title: '成功',
        message: '时间戳转换成功',
        type: 'success',
        duration: 2000
      })
    } catch (error) {
      ElNotification({
        title: '错误',
        message: '时间戳转换失败',
        type: 'error',
        duration: 3000
      })
    }
  }

  // 填充当前时间
  const setCurrentTime = () => {
    const now = new Date()
    timeInput.value = commonUtils.formatDateTime(now)
    timestampInput.value = now.getTime().toString()
    timeInputError.value = ''
    timestampInputError.value = ''
  }

  // 清空所有
  const clearAll = () => {
    timeInput.value = ''
    timestampInput.value = ''
    convertedTimestamp.value = null
    convertedTime.value = null
    timeInputError.value = ''
    timestampInputError.value = ''
  }
</script>

<style scoped>
  @import '@/assets/styles/variables.css';
  @import '@/assets/styles/common.css';

  /* 页面居中 */
  .unix-timestamp {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 91vh;
    background-color: var(--background-base);
    padding: var(--spacing-large);
  }

  /* 容器样式 */
  .container {
    width: 100%;
    max-width: 600px;
    background: var(--background-white);
    box-shadow: var(--shadow-light);
    border-radius: var(--border-radius-large);
    padding: var(--spacing-large);
    text-align: center;
  }

  /* 每个模块 */
  .section {
    margin-bottom: var(--spacing-large);
    padding: var(--spacing-large);
    border-radius: var(--border-radius-base);
    background: var(--background-base);
    border: 1px solid var(--border-lighter);
    transition: var(--transition-all);
  }

  .section:hover {
    box-shadow: var(--shadow-base);
  }

  /* 标题 */
  h2 {
    font-size: var(--font-size-large);
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: var(--spacing-large);
  }

  /* 时间戳容器 */
  .timestamp-container {
    display: flex;
    align-items: center;
    gap: var(--spacing-base);
    margin: var(--spacing-base) 0;
    padding: var(--spacing-base);
    background-color: var(--background-white);
    border-radius: var(--border-radius-base);
    border: 1px solid var(--border-lighter);
  }

  /* 实时时间戳 */
  .timestamp {
    font-size: 24px;
    font-weight: bold;
    color: var(--primary-color);
    text-align: left;
    flex: 1;
    min-width: 120px;
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  }

  .formatted-time {
    font-size: var(--font-size-base);
    color: var(--text-regular);
    text-align: right;
    flex: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    min-width: 150px;
  }

  /* 输入框 + 按钮横向排列 */
  .input-group {
    display: flex;
    justify-content: center;
    gap: var(--spacing-small);
    margin-bottom: var(--spacing-small);
  }

  /* 输入框 */
  .input {
    flex: 1;
    padding: var(--spacing-base);
    font-size: var(--font-size-base);
    border: 1px solid var(--border-base);
    border-radius: var(--border-radius-base);
    text-align: center;
    transition: var(--transition-all);
  }

  .input:focus {
    border-color: var(--primary-color);
    box-shadow: 0 0 0 2px rgba(66, 185, 131, 0.2);
  }

  /* 错误消息 */
  .error-message {
    color: var(--error-color);
    font-size: var(--font-size-small);
    margin: var(--spacing-small) 0;
    text-align: left;
  }

  /* 转换结果 */
  .result {
    font-size: var(--font-size-base);
    color: var(--text-primary);
    margin-top: var(--spacing-base);
    padding: var(--spacing-base);
    background-color: var(--background-white);
    border-radius: var(--border-radius-small);
    border: 1px solid var(--border-lighter);
  }

  /* 快捷操作 */
  .quick-actions {
    display: flex;
    justify-content: center;
    gap: var(--spacing-small);
    flex-wrap: wrap;
  }

  /* 响应式优化 */
  @media (max-width: 768px) {
    .unix-timestamp {
      padding: var(--spacing-small);
      align-items: flex-start;
      padding-top: var(--spacing-large);
    }

    .container {
      padding: var(--spacing-base);
    }

    .input-group {
      flex-direction: column;
      gap: var(--spacing-base);
    }

    .quick-actions {
      flex-direction: column;
    }

    .result {
      font-size: var(--font-size-small);
    }

    /* 时间戳容器响应式 */
    .timestamp-container {
      flex-direction: column;
      align-items: stretch;
      gap: var(--spacing-small);
    }

    .timestamp {
      text-align: center;
      min-width: auto;
      font-size: 20px;
    }

    .formatted-time {
      text-align: center;
      min-width: auto;
      font-size: var(--font-size-small);
    }
  }
</style>
