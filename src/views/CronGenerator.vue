<template>
    <div class="cron-generator">
        <el-card>
            <el-tabs v-model="activeTab">
                <el-tab-pane label="秒" name="second">
                    <CronField v-model="cronFields[0]" unit="秒" />
                </el-tab-pane>
                <el-tab-pane label="分钟" name="minute">
                    <CronField v-model="cronFields[1]" unit="分钟" />
                </el-tab-pane>
                <el-tab-pane label="小时" name="hour">
                    <CronField v-model="cronFields[2]" unit="小时" />
                </el-tab-pane>
                <el-tab-pane label="日" name="day">
                    <CronField v-model="cronFields[3]" unit="日" />
                </el-tab-pane>
                <el-tab-pane label="月" name="month">
                    <CronField v-model="cronFields[4]" unit="月" />
                </el-tab-pane>
                <el-tab-pane label="周" name="week">
                    <CronField v-model="cronFields[5]" unit="周" />
                </el-tab-pane>
                <el-tab-pane label="年份" name="year">
                    <CronField v-model="cronFields[6]" unit="年" optional />
                </el-tab-pane>
            </el-tabs>
        </el-card>

        <!-- 生成的 Cron 表达式 -->
        <el-card class="cron-expression">
            <div class="expression-fields">
                <el-input v-for="(value, index) in cronFields" :key="index" v-model="cronFields[index]" />
            </div>
            <el-input v-model="cronExpression" readonly />
        </el-card>

        <!-- 操作按钮 -->
        <div class="cron-actions">
            <el-button type="primary" @click="parseExpression">解析到 UI</el-button>
            <el-button type="success" @click="runCronSimulation">运行</el-button>
        </div>

        <!-- 执行示例 -->
        <el-card class="cron-preview">
            <h3>最近 10 次运行时间</h3>
            <ul>
                <li v-for="(time, index) in executionTimes" :key="index">{{ time }}</li>
            </ul>
        </el-card>
    </div>
</template>

<script>
import { ref, computed } from "vue";
import CronField from "./CronField.vue";
import parser from "cron-parser";

export default {
    name: "CronGenerator",
    components: { CronField },
    setup() {
        const activeTab = ref("second");
        const cronFields = ref(["*", "*", "*", "*", "*", "*", "?"]);
        const executionTimes = ref([]);

        // 计算完整的 Cron 表达式
        const cronExpression = computed(() => cronFields.value.join(" "));

        // 生成未来 10 次的执行时间
        const generateNextExecutions = (expression) => {
            try {
                const interval = parser.parseExpression(expression, {utc: true});
                return Array.from({length: 10}, () =>
                        new Date(interval.next().toISOString()).toLocaleString("zh-CN", {hour12: false})
                );
            } catch (e) {
                console.error("Cron 解析失败:", e);
                return ["无效的 Cron 表达式"];
            }
        };

        // 解析 Cron 表达式并更新 UI
        const parseExpression = () => {
            console.log("解析到 UI");
            // 这里可以添加你的解析逻辑，更新 UI
            // 例如：可以通过某种方式将 Cron 字段与 UI 进行映射
        };

        // 运行 Cron 模拟
        const runCronSimulation = () => {
            executionTimes.value = generateNextExecutions(cronExpression.value);
        };

        return {
            activeTab,
            cronFields,
            cronExpression,
            executionTimes,
            runCronSimulation,
            parseExpression, // 返回到模板中
        };
    },
};
</script>

<style scoped>
.cron-generator {
    padding: 20px;
}

.cron-expression {
    margin-top: 20px;
}

.expression-fields {
    display: flex;
    gap: 10px;
}

.cron-actions {
    margin-top: 20px;
    display: flex;
    gap: 10px;
}

.cron-preview {
    margin-top: 20px;
}
</style>
