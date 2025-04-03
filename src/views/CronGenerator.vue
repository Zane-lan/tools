<template>
    <div class="cron-generator">
        <el-card class="cron-card">
            <template #header>
                <div class="card-header">
                    <div class="header-left">
                        <h2>Cron 表达式生成器</h2>
                        <el-tag type="info" size="small">Quartz 格式</el-tag>
                    </div>
                    <div class="header-right">
                        <el-select v-model="timezone" placeholder="选择时区" size="small">
                            <el-option v-for="tz in timezones" 
                                     :key="tz" :label="tz" :value="tz" />
                        </el-select>
                    </div>
                </div>
            </template>

            <el-tabs v-model="activeTab" class="cron-tabs">
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
                    <div class="header-left">
                        <h3>生成的表达式</h3>
                        <el-tag :type="hasError ? 'danger' : 'success'" size="small">
                            {{ hasError ? '无效' : '有效' }}
                        </el-tag>
                    </div>
                    <div class="header-right">
                        <el-button-group>
                            <el-button type="primary" @click="copyExpression" 
                                     :disabled="hasError" size="small">
                                <el-icon><CopyDocument /></el-icon>
                                复制
                            </el-button>
                            <el-button type="success" @click="runCronSimulation" 
                                     :disabled="hasError" size="small">
                                <el-icon><View /></el-icon>
                                预览
                            </el-button>
                        </el-button-group>
                        <el-tooltip content="点击查看表达式说明" placement="top">
                            <el-button @click="showExpressionHelp" size="small">
                                <el-icon><QuestionFilled /></el-icon>
                            </el-button>
                        </el-tooltip>
                    </div>
                </div>
            </template>

            <div class="expression-content">
                <el-input v-model="cronExpression" readonly 
                         :class="{ 'has-error': hasError }"
                         class="expression-input">
                    <template #prepend>
                        <span class="expression-label">表达式</span>
                    </template>
                </el-input>

                <div v-if="hasError" class="error-message">
                    <el-icon><Warning /></el-icon>
                    {{ errorMessage }}
                </div>
            </div>
        </el-card>

        <el-card v-if="executionTimes.length > 0" class="preview-card">
            <template #header>
                <div class="card-header">
                    <div class="header-left">
                        <h3>未来 10 次执行时间</h3>
                        <el-tag type="info" size="small">时区: {{ timezone }}</el-tag>
                    </div>
                </div>
            </template>

            <el-timeline>
                <el-timeline-item v-for="(time, index) in executionTimes" 
                                :key="index" 
                                :timestamp="time" 
                                :type="index === 0 ? 'primary' : 'info'"
                                :hollow="index !== 0">
                    <div class="timeline-content">
                        <span class="execution-number">第 {{ index + 1 }} 次执行</span>
                        <el-tag size="small" type="success" class="time-tag">
                            {{ time }}
                        </el-tag>
                    </div>
                </el-timeline-item>
            </el-timeline>
        </el-card>
    </div>
</template>

<script>
import { ref, computed, watch } from 'vue';
import { ElMessage } from 'element-plus';
import CronField from './CronField.vue';
import { QuestionFilled, CopyDocument, View, Warning } from '@element-plus/icons-vue';
import { validateCronExpression } from '../utils/cronUtils';
import { parseQuartzCron } from '../utils/cronParser';

export default {
    name: 'CronGenerator',
    components: { 
        CronField,
        QuestionFilled,
        CopyDocument,
        View,
        Warning
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
    background-color: #f5f7fa;
    min-height: 100vh;
}

.cron-card,
.expression-card,
.preview-card {
    margin-bottom: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
    transition: all 0.3s ease;
}

.cron-card:hover,
.expression-card:hover,
.preview-card:hover {
    box-shadow: 0 4px 16px 0 rgba(0, 0, 0, 0.1);
}

.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 10px;
}

.header-left {
    display: flex;
    align-items: center;
    gap: 10px;
}

.header-right {
    display: flex;
    align-items: center;
    gap: 10px;
}

h2, h3 {
    margin: 0;
    font-weight: 600;
    color: #303133;
}

h2 {
    font-size: 20px;
}

h3 {
    font-size: 16px;
}

.cron-tabs {
    margin-top: 10px;
}

.expression-content {
    padding: 10px 0;
}

.expression-input {
    margin-bottom: 10px;
}

.expression-label {
    color: #606266;
    font-weight: 500;
}

.has-error {
    border-color: #f56c6c;
}

.error-message {
    color: #f56c6c;
    font-size: 14px;
    display: flex;
    align-items: center;
    gap: 5px;
    margin-top: 8px;
}

.timeline-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 5px 0;
}

.execution-number {
    color: #606266;
    font-size: 14px;
}

.time-tag {
    font-family: monospace;
    font-size: 13px;
}

:deep(.el-timeline-item__node) {
    background-color: #409eff;
}

:deep(.el-timeline-item__tail) {
    border-left-color: #e4e7ed;
}

:deep(.el-timeline-item__timestamp) {
    color: #909399;
    font-size: 13px;
}

:deep(.el-tabs__item) {
    font-size: 14px;
    padding: 0 20px;
    height: 40px;
    line-height: 40px;
}

:deep(.el-tabs__nav-wrap::after) {
    height: 1px;
}

:deep(.el-card__header) {
    padding: 15px 20px;
    border-bottom: 1px solid #ebeef5;
}

:deep(.el-button-group) {
    margin-right: 8px;
}

:deep(.el-select) {
    width: 200px;
}

:deep(.el-tag) {
    margin-left: 8px;
}

@media (max-width: 768px) {
    .cron-generator {
        padding: 10px;
    }
    
    .card-header {
        flex-direction: column;
        gap: 10px;
        align-items: flex-start;
    }
    
    .header-right {
        width: 100%;
        justify-content: flex-start;
    }
    
    :deep(.el-select) {
        width: 100%;
    }
}
</style>
