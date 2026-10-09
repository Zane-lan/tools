<template>
  <div class="json-formatter">
    <div class="input-area">
      <h2>JSON 输入</h2>
      <textarea
        v-model="jsonInput"
        placeholder="请输入 JSON 字符串"
        class="json-input"
        :class="{ error: errorMessage }"
      ></textarea>
      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
      <div class="button-group">
        <button @click="formatJson">格式化 JSON</button>
        <button class="compress-btn" @click="compressJson">压缩 JSON</button>
      </div>
    </div>

    <div class="output-area">
      <h2>格式化 / 压缩结果</h2>
      <div v-if="formattedJson" class="json-output">
        <json-pretty :data="parsedJson" :deep="3"></json-pretty>
      </div>
      <p v-else class="placeholder">格式化或压缩后的 JSON 将在此显示</p>
    </div>
  </div>
</template>

<script>
  import { ref } from 'vue'
  import JsonPretty from 'vue-json-pretty'
  import 'vue-json-pretty/lib/styles.css'

  export default {
    name: 'JsonFormatter',
    components: {
      JsonPretty
    },
    setup() {
      const jsonInput = ref('')
      const formattedJson = ref('')
      const parsedJson = ref(null)
      const errorMessage = ref('')

      // 格式化 JSON
      const formatJson = () => {
        try {
          parsedJson.value = JSON.parse(jsonInput.value)
          formattedJson.value = JSON.stringify(parsedJson.value, null, 2)
          errorMessage.value = ''
          jsonInput.value = formattedJson.value // 更新输入框
        } catch (error) {
          errorMessage.value = `❌ JSON 格式错误：${error.message}`
          formattedJson.value = ''
          parsedJson.value = null
        }
      }

      // 压缩 JSON
      const compressJson = () => {
        try {
          parsedJson.value = JSON.parse(jsonInput.value)
          formattedJson.value = JSON.stringify(parsedJson.value) // 无空格压缩
          errorMessage.value = ''
          jsonInput.value = formattedJson.value // 更新输入框
        } catch (error) {
          errorMessage.value = `❌ JSON 格式错误：${error.message}`
          formattedJson.value = ''
          parsedJson.value = null
        }
      }

      return {
        jsonInput,
        formattedJson,
        parsedJson,
        errorMessage,
        formatJson,
        compressJson
      }
    }
  }
</script>

<style scoped>
  /* 页面整体 */
  .json-formatter {
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 90vh;
    background: var(--background-base);
    padding: var(--spacing-large);
  }

  /* 输入、输出区域 */
  .input-area,
  .output-area {
    width: 90%;
    max-width: 800px;
    background: var(--background-white);
    box-shadow: var(--shadow-light);
    border-radius: var(--border-radius-large);
    padding: var(--spacing-large);
    text-align: center;
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    margin-bottom: var(--spacing-large);
  }

  /* 标题 */
  h2 {
    font-size: var(--font-size-extra-large);
    font-weight: bold;
    color: var(--text-primary);
    margin-bottom: var(--spacing-base);
  }

  /* 输入框 */
  .json-input {
    flex-grow: 1;
    padding: var(--spacing-base);
    font-size: var(--font-size-base);
    font-family: 'Courier New', monospace;
    border: 1px solid var(--border-base);
    border-radius: var(--border-radius-large);
    resize: none;
    background: var(--background-white);
    transition: border-color 0.3s;
    min-height: 100px;
    max-height: 200px;
  }

  .json-input:focus {
    border-color: var(--primary-color);
    outline: none;
  }

  .json-input.error {
    border-color: var(--error-color);
    background-color: #ffe6e6;
  }

  /* 按钮区域 */
  .button-group {
    display: flex;
    justify-content: center;
    gap: var(--spacing-small);
  }

  /* 按钮 */
  button {
    margin-top: var(--spacing-extra-large);
    padding: var(--spacing-small) var(--spacing-large);
    font-size: var(--font-size-base);
    background-color: var(--primary-color);
    color: white;
    border: none;
    border-radius: var(--border-radius-large);
    cursor: pointer;
    transition: var(--transition-all);
    box-shadow: var(--shadow-base);
  }

  button:hover {
    background-color: var(--primary-hover);
    transform: scale(1.05);
  }

  /* 压缩按钮 */
  .compress-btn {
    background-color: var(--warning-color);
  }

  .compress-btn:hover {
    background-color: #e68900;
  }

  /* 输出区域 */
  .output-area {
    text-align: left;
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  /* JSON 预览区域 */
  .json-output {
    flex-grow: 1;
    padding: var(--spacing-large);
    border-radius: var(--border-radius-large);
    font-size: var(--font-size-base);
    font-family: 'Courier New', monospace;
    overflow: auto;
    border: 1px solid var(--border-base);
    box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.05);
    white-space: pre-wrap;
    word-break: break-word;
  }

  /* 预览区域占位符 */
  .placeholder {
    color: var(--text-secondary);
    font-size: var(--font-size-base);
    text-align: center;
    margin-top: auto;
    margin-bottom: auto;
  }
</style>
