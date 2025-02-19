<template>
    <div class="unix-timestamp">
        <div class="container">
            <!-- 实时时间戳 -->
            <div class="section">
                <h2>当前 Unix 时间戳</h2>
                <p class="timestamp">{{ timestamp }}</p>
                <button @click="copyTimestamp(timestamp)">复制时间戳</button>
            </div>

            <!-- 时间转时间戳 -->
            <div class="section">
                <h2>时间转时间戳</h2>
                <div class="input-group">
                    <input v-model="timeInput" placeholder="YYYY-MM-DD HH:mm:ss" class="input" />
                    <button @click="convertTimeToTimestamp">转换</button>
                </div>
                <p v-if="convertedTimestamp" class="result">
                    时间戳：{{ convertedTimestamp }}
                    <button @click="copyTimestamp(convertedTimestamp)">复制</button>
                </p>
            </div>

            <!-- 时间戳转时间 -->
            <div class="section">
                <h2>时间戳转时间</h2>
                <div class="input-group">
                    <input v-model="timestampInput" placeholder="输入时间戳（毫秒）" class="input" />
                    <button @click="convertTimestampToTime">转换</button>
                </div>
                <p v-if="convertedTime" class="result">
                    时间：{{ convertedTime }}
                    <button @click="copyTimestamp(convertedTime)">复制</button>
                </p>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from "vue";

export default {
    name: "TimeTools",
    setup() {
        const timestamp = ref(Date.now());
        const timeInput = ref("");
        const timestampInput = ref("");
        const convertedTimestamp = ref(null);
        const convertedTime = ref(null);
        let intervalId = null;

        const updateTimestamp = () => {
            timestamp.value = Date.now();
        };

        onMounted(() => {
            intervalId = setInterval(updateTimestamp, 100);
        });

        onUnmounted(() => {
            if (intervalId) {
                clearInterval(intervalId);
            }
        });

        const copyTimestamp = (text) => {
            navigator.clipboard
                    .writeText(text.toString())
                    .then(() => alert("已复制到剪贴板！"))
                    .catch((err) => console.error("复制失败：", err));
        };

        const convertTimeToTimestamp = () => {
            const date = new Date(timeInput.value);
            if (isNaN(date.getTime())) {
                alert("请输入正确的时间格式（YYYY-MM-DD HH:mm:ss）");
                return;
            }
            convertedTimestamp.value = date.getTime();
        };

        const convertTimestampToTime = () => {
            const timestampValue = parseInt(timestampInput.value, 10);
            if (isNaN(timestampValue)) {
                alert("请输入正确的时间戳（毫秒）");
                return;
            }
            const date = new Date(timestampValue);
            convertedTime.value = formatDate(date);
        };

        const formatDate = (date) => {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, "0");
            const day = String(date.getDate()).padStart(2, "0");
            const hours = String(date.getHours()).padStart(2, "0");
            const minutes = String(date.getMinutes()).padStart(2, "0");
            const seconds = String(date.getSeconds()).padStart(2, "0");
            return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
        };

        return {
            timestamp,
            timeInput,
            timestampInput,
            convertedTimestamp,
            convertedTime,
            copyTimestamp,
            convertTimeToTimestamp,
            convertTimestampToTime,
        };
    },
};
</script>

<style scoped>
/* 页面居中 */
.unix-timestamp {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 91vh;
    background-color: #f4f4f4;
}

/* 容器样式 */
.container {
    width: 90%;
    max-width: 600px;
    background: white;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    border-radius: 10px;
    padding: 20px;
    text-align: center;
}

/* 每个模块 */
.section {
    margin-bottom: 30px;
    padding: 20px;
    border-radius: 8px;
    background: #f9f9f9;
}

/* 标题 */
h2 {
    font-size: 18px;
    font-weight: bold;
    color: #333;
    margin-bottom: 15px;
}

/* 实时时间戳 */
.timestamp {
    font-size: 24px;
    font-weight: bold;
    color: #42b983;
    margin: 10px 0;
}

/* 输入框 + 按钮横向排列 */
.input-group {
    display: flex;
    justify-content: center;
    gap: 10px;
}

/* 输入框 */
.input {
    flex: 1;
    padding: 10px;
    font-size: 16px;
    border: 1px solid #ccc;
    border-radius: 6px;
    text-align: center;
}

/* 按钮 */
button {
    padding: 10px 16px;
    font-size: 16px;
    background-color: #42b983;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    transition: background 0.3s;
}

button:hover {
    background-color: #369f6e;
}

/* 转换结果 */
.result {
    font-size: 18px;
    color: #333;
    margin-top: 10px;
}

/* 复制按钮 */
.result button {
    margin-left: 10px;
    padding: 6px 10px;
    font-size: 14px;
}
</style>
