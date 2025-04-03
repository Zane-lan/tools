<template>
    <div class="cron-generator">
        <el-card class="cron-card">
            <template #header>
                <div class="card-header">
                    <span>Cron 表达式生成器</span>
                    <el-select v-model="timezone" placeholder="选择时区">
                        <el-option v-for="tz in timezones" 
                                 :key="tz" :label="tz" :value="tz" />
                    </el-select>
                </div>
            </template>

            <el-tabs v-model="activeTab">
                <el-tab-pane label="秒" name="second">
                    <CronField v-model="cronFields[0]" unit="秒" type="second" 
                              @field-error="handleFieldError" />
                </el-tab-pane>
                <el-tab-pane label="分钟" name="minute">
                    <CronField v-model="cronFields[1]" unit="分钟" type="minute" 
                              @field-error="handleFieldError" />
                </el-tab-pane>
                <el-tab-pane label="小时" name="hour">
                    <CronField v-model="cronFields[2]" unit="小时" type="hour" 
                              @field-error="handleFieldError" />
                </el-tab-pane>
                <el-tab-pane label="日" name="day">
                    <CronField v-model="cronFields[3]" unit="日" type="day" 
                              @field-error="handleFieldError" />
                </el-tab-pane>
                <el-tab-pane label="月" name="month">
                    <CronField v-model="cronFields[4]" unit="月" type="month" 
                              @field-error="handleFieldError" />
                </el-tab-pane>
                <el-tab-pane label="周" name="week">
                    <CronField v-model="cronFields[5]" unit="周" type="week" 
                              @field-error="handleFieldError" />
                </el-tab-pane>
                <el-tab-pane label="年" name="year">
                    <CronField v-model="cronFields[6]" unit="年" type="year" 
                              @field-error="handleFieldError" optional />
                </el-tab-pane>
            </el-tabs>
        </el-card>

        <el-card class="expression-card">
            <template #header>
                <div class="card-header">
                    <span>生成的表达式</span>
                    <div class="expression-actions">
                        <el-button type="primary" @click="copyExpression" 
                                 :disabled="hasError">
                            复制
                        </el-button>
                        <el-button type="success" @click="runCronSimulation" 
                                 :disabled="hasError">
                            预览
                        </el-button>
                    </div>
                </div>
            </template>

            <el-input v-model="cronExpression" readonly :class="{ 'has-error': hasError }">
                <template #append>
                    <el-tooltip content="点击查看表达式说明" placement="top">
                        <el-button @click="showExpressionHelp">
                            <el-icon><QuestionFilled /></el-icon>
                        </el-button>
                    </el-tooltip>
                </template>
            </el-input>

            <div v-if="hasError" class="error-message">
                {{ errorMessage }}
            </div>
        </el-card>

        <el-card v-if="executionTimes.length > 0" class="preview-card">
            <template #header>
                <div class="card-header">
                    <span>未来 10 次执行时间</span>
                    <span class="timezone-info">时区: {{ timezone }}</span>
                </div>
            </template>

            <el-timeline>
                <el-timeline-item v-for="(time, index) in executionTimes" 
                                :key="index" :timestamp="time" 
                                type="primary">
                    <span>第 {{ index + 1 }} 次执行</span>
                </el-timeline-item>
            </el-timeline>
        </el-card>
    </div>
</template>

<script>
import { ref, computed, watch } from 'vue';
import { ElMessage } from 'element-plus';
import CronField from './CronField.vue';
import { QuestionFilled } from '@element-plus/icons-vue';
import { validateCronExpression } from '../utils/cronUtils';
import { parseQuartzCron } from '../utils/cronParser';

export default {
    name: 'CronGenerator',
    components: { 
        CronField,
        QuestionFilled
    },

    setup() {
        const activeTab = ref('second');
        const cronFields = ref(['*', '*', '*', '*', '*', '*', '?']);
        const executionTimes = ref([]);
        const hasError = ref(false);
        const errorMessage = ref('');
        const timezone = ref('Asia/Shanghai');

        // 获取系统支持的时区列表
        const timezones = computed(() => {
            return Intl.supportedValuesOf('timeZone');
        });

        // 计算完整的 Cron 表达式
        const cronExpression = computed(() => cronFields.value.join(' '));

        // 处理字段错误
        const handleFieldError = (error) => {
            hasError.value = error;
            if (error) {
                errorMessage.value = '表达式格式错误';
            } else {
                errorMessage.value = '';
            }
        };

        // 复制表达式
        const copyExpression = async () => {
            try {
                await navigator.clipboard.writeText(cronExpression.value);
                ElMessage.success('已复制到剪贴板');
            } catch (err) {
                ElMessage.error('复制失败');
            }
        };

        // 运行 Cron 模拟
        const runCronSimulation = () => {
            try {
                if (!validateCronExpression(cronExpression.value)) {
                    throw new Error('无效的 Cron 表达式');
                }

                executionTimes.value = parseQuartzCron(
                    cronExpression.value,
                    10,
                    timezone.value
                ).map(time => {
                    return new Date(time).toLocaleString('zh-CN', {
                        timeZone: timezone.value,
                        hour12: false,
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit'
                    });
                });
            } catch (e) {
                ElMessage.error(`Cron 解析失败: ${e.message}`);
                executionTimes.value = [];
            }
        };

        // 显示表达式帮助
        const showExpressionHelp = () => {
            ElMessage({
                message: '秒 分 时 日 月 周 年',
                duration: 5000,
                dangerouslyUseHTMLString: true
            });
        };

        // 监听日期和星期的互斥关系
        watch([
            () => cronFields.value[3],
            () => cronFields.value[5]
        ], ([day, week]) => {
            if (day !== '*' && day !== '?' && week !== '*' && week !== '?') {
                if (activeTab.value === 'day') {
                    cronFields.value[5] = '?';
                } else {
                    cronFields.value[3] = '?';
                }
            }
        });

        return {
            activeTab,
            cronFields,
            cronExpression,
            executionTimes,
            hasError,
            errorMessage,
            timezone,
            timezones,
            handleFieldError,
            copyExpression,
            runCronSimulation,
            showExpressionHelp
        };
    }
};
</script>

<style scoped>
.cron-generator {
    padding: 20px;
    max-width: 1200px;
    margin: 0 auto;
}

.cron-card,
.expression-card,
.preview-card {
    margin-bottom: 20px;
}

.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.expression-actions {
    display: flex;
    gap: 10px;
}

.has-error {
    border-color: #f56c6c;
}

.error-message {
    color: #f56c6c;
    font-size: 12px;
    margin-top: 5px;
}

.timezone-info {
    font-size: 14px;
    color: #666;
}

.el-timeline {
    margin-top: 20px;
}
</style>
