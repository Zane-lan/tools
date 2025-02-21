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
import { parseQuartzCron } from "../utils/cronParser"; // ✅ 直接导入解析器

export default {
    name: "CronGenerator",
    components: { CronField },
    setup() {
        const activeTab = ref("second");
        const cronFields = ref(["*", "*", "*", "*", "*", "*", "?"]);
        const executionTimes = ref([]);

        // 计算完整的 Cron 表达式
        const cronExpression = computed(() => cronFields.value.join(" "));

        // 运行 Cron 模拟（使用自定义解析器）
        const runCronSimulation = () => {
            try {
                executionTimes.value = parseQuartzCron(cronExpression.value, 10);
            } catch (e) {
                console.error("Cron 解析失败:", e);
                executionTimes.value = ["无效的 Cron 表达式"];
            }
        };

        return {
            activeTab,
            cronFields,
            cronExpression,
            executionTimes,
            runCronSimulation,
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
