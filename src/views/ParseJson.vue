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
                <button @click="compressJson" class="compress-btn">压缩 JSON</button>
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
import { ref } from "vue";
import JsonPretty from "vue-json-pretty";
import "vue-json-pretty/lib/styles.css";

export default {
    name: "JsonFormatter",
    components: {
        JsonPretty,
    },
    setup() {
        const jsonInput = ref("");
        const formattedJson = ref("");
        const parsedJson = ref(null);
        const errorMessage = ref("");

        // 格式化 JSON
        const formatJson = () => {
            try {
                parsedJson.value = JSON.parse(jsonInput.value);
                formattedJson.value = JSON.stringify(parsedJson.value, null, 2);
                errorMessage.value = "";
                jsonInput.value = formattedJson.value; // 更新输入框
            } catch (error) {
                errorMessage.value = `❌ JSON 格式错误：${error.message}`;
                formattedJson.value = "";
                parsedJson.value = null;
            }
        };

        // 压缩 JSON
        const compressJson = () => {
            try {
                parsedJson.value = JSON.parse(jsonInput.value);
                formattedJson.value = JSON.stringify(parsedJson.value); // 无空格压缩
                errorMessage.value = "";
                jsonInput.value = formattedJson.value; // 更新输入框
            } catch (error) {
                errorMessage.value = `❌ JSON 格式错误：${error.message}`;
                formattedJson.value = "";
                parsedJson.value = null;
            }
        };

        return {
            jsonInput,
            formattedJson,
            parsedJson,
            errorMessage,
            formatJson,
            compressJson,
        };
    },
};
</script>

<style scoped>
/* 页面整体 */
.json-formatter {
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 90vh; /* 让整体高度不超出屏幕 */
    background: linear-gradient(135deg, #e3f2fd, #f1f8e9);
    padding: 10px;
}

/* 输入、输出区域 */
.input-area,
.output-area {
    width: 90%;
    max-width: 800px;
    background: #ffffff;
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
    border-radius: 12px;
    padding: 15px;
    text-align: center;
    flex: 1; /* 让输入和输出框平均分配空间 */
    display: flex;
    flex-direction: column;
    overflow: hidden; /* 防止溢出 */
    margin-bottom: 20px;
}

/* 标题 */
h2 {
    font-size: 18px;
    font-weight: bold;
    color: #333;
    margin-bottom: 12px;
}

/* 输入框 */
.json-input {
    flex-grow: 1;
    padding: 12px;
    font-size: 14px;
    font-family: "Courier New", monospace;
    border: 1px solid #ccc;
    border-radius: 8px;
    resize: none;
    background: #fff;
    transition: border-color 0.3s;
    min-height: 100px;
    max-height: 200px; /* 限制高度 */
}

.json-input:focus {
    border-color: #42b983;
    outline: none;
}

.json-input.error {
    border-color: red;
    background-color: #ffe6e6;
}

/* 按钮区域 */
.button-group {
    display: flex;
    justify-content: center;
    gap: 10px;
}

/* 按钮 */
button {
    margin-top: 30px;
    padding: 10px 16px;
    font-size: 14px;
    background-color: #42b983;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease-in-out;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

button:hover {
    background-color: #2d8b68;
    transform: scale(1.05);
}

/* 压缩按钮 */
.compress-btn {
    background-color: #ff9800;
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
    padding: 15px;
    border-radius: 8px;
    font-size: 14px;
    font-family: "Courier New", monospace;
    overflow: auto; /* 允许滚动 */
    border: 1px solid #444;
    box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.05);
    white-space: pre-wrap;
    word-break: break-word;
}

/* 预览区域占位符 */
.placeholder {
    color: #999;
    font-size: 14px;
    text-align: center;
    margin-top: auto;
    margin-bottom: auto;
}
</style>
