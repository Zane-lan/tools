<template>
    <div class="cron-field">
        <div class="field-description">{{ fieldDescription }}</div>
        
        <el-radio-group v-model="selectedType" @change="handleTypeChange">
            <el-radio :value="'*'">每{{ unit }}</el-radio>
            <el-radio :value="'?'" v-if="canUseQuestionMark">不指定</el-radio>
            <el-radio :value="'range'">范围</el-radio>
            <el-radio :value="'step'">间隔</el-radio>
            <el-radio :value="'specific'">指定</el-radio>
            <el-radio :value="'last'" v-if="unit === '日'">最后一天</el-radio>
            <el-radio :value="'workday'" v-if="unit === '日'">工作日</el-radio>
        </el-radio-group>

        <div v-if="selectedType === 'range'" class="field-input">
            <el-select v-model="rangeStart" placeholder="起始值" @change="updateValue">
                <el-option v-for="opt in fieldOptions" :key="opt.value" 
                          :label="opt.label" :value="opt.value" />
            </el-select>
            <span>-</span>
            <el-select v-model="rangeEnd" placeholder="结束值" @change="updateValue">
                <el-option v-for="opt in fieldOptions" :key="opt.value" 
                          :label="opt.label" :value="opt.value" />
            </el-select>
        </div>

        <div v-if="selectedType === 'step'" class="field-input">
            <el-select v-model="stepStart" placeholder="起始值" @change="updateValue">
                <el-option v-for="opt in fieldOptions" :key="opt.value" 
                          :label="opt.label" :value="opt.value" />
            </el-select>
            <span>/</span>
            <el-input-number v-model="stepValue" :min="1" :max="maxStep" 
                           @change="updateValue" />
        </div>

        <div v-if="selectedType === 'specific'" class="field-input">
            <el-select v-model="selectedValues" multiple placeholder="选择值" 
                      @change="updateValue">
                <el-option v-for="opt in fieldOptions" :key="opt.value" 
                          :label="opt.label" :value="opt.value" />
            </el-select>
        </div>

        <div v-if="error" class="error-message">
            {{ error }}
        </div>
    </div>
</template>

<script>
import { ref, computed, watch } from 'vue';
import { 
    FIELD_DESCRIPTIONS, 
    validateCronField, 
    getFieldOptions 
} from '../utils/cronUtils';

export default {
    props: {
        modelValue: String,
        unit: String,
        type: {
            type: String,
            required: true
        }
    },
    
    emits: ['update:modelValue', 'field-error'],
    
    setup(props, { emit }) {
        const selectedType = ref('*');
        const rangeStart = ref('');
        const rangeEnd = ref('');
        const stepStart = ref('');
        const stepValue = ref(1);
        const selectedValues = ref([]);
        const error = ref('');

        // 计算属性
        const fieldDescription = computed(() => FIELD_DESCRIPTIONS[props.type]);
        const fieldOptions = computed(() => getFieldOptions(props.type));
        const maxStep = computed(() => {
            const range = fieldOptions.value;
            return range.length > 0 ? range[range.length - 1].value : 1;
        });
        const canUseQuestionMark = computed(() => 
            props.type === 'day' || props.type === 'week'
        );

        // 更新值
        const updateValue = () => {
            let newValue = '*';
            
            switch (selectedType.value) {
                case 'range':
                    if (rangeStart.value && rangeEnd.value) {
                        newValue = `${rangeStart.value}-${rangeEnd.value}`;
                    }
                    break;
                case 'step':
                    if (stepStart.value && stepValue.value) {
                        newValue = `${stepStart.value}/${stepValue.value}`;
                    }
                    break;
                case 'specific':
                    if (selectedValues.value.length > 0) {
                        newValue = selectedValues.value.sort((a, b) => a - b).join(',');
                    }
                    break;
                case '?':
                case '*':
                    newValue = selectedType.value;
                    break;
                case 'last':
                    newValue = 'L';
                    break;
                case 'workday':
                    newValue = 'W';
                    break;
            }

            // 验证新值
            if (validateCronField(newValue, props.type)) {
                error.value = '';
                emit('update:modelValue', newValue);
            } else {
                error.value = '无效的值';
                emit('field-error', true);
            }
        };

        // 处理类型变化
        const handleTypeChange = () => {
            rangeStart.value = '';
            rangeEnd.value = '';
            stepStart.value = '';
            stepValue.value = 1;
            selectedValues.value = [];
            updateValue();
        };

        // 监听外部值变化
        watch(() => props.modelValue, (newValue) => {
            if (newValue === '*') selectedType.value = '*';
            else if (newValue === '?') selectedType.value = '?';
            else if (newValue === 'L') selectedType.value = 'last';
            else if (newValue === 'W') selectedType.value = 'workday';
            else if (newValue.includes('-')) {
                selectedType.value = 'range';
                const [start, end] = newValue.split('-');
                rangeStart.value = start;
                rangeEnd.value = end;
            } else if (newValue.includes('/')) {
                selectedType.value = 'step';
                const [start, step] = newValue.split('/');
                stepStart.value = start;
                stepValue.value = parseInt(step);
            } else if (newValue.includes(',')) {
                selectedType.value = 'specific';
                selectedValues.value = newValue.split(',');
            }
        });

        return {
            selectedType,
            rangeStart,
            rangeEnd,
            stepStart,
            stepValue,
            selectedValues,
            fieldDescription,
            fieldOptions,
            maxStep,
            canUseQuestionMark,
            error,
            handleTypeChange,
            updateValue
        };
    }
};
</script>

<style scoped>
.cron-field {
    padding: 15px;
    border: 1px solid #eee;
    border-radius: 4px;
    margin-bottom: 15px;
}

.field-description {
    color: #666;
    font-size: 14px;
    margin-bottom: 10px;
}

.field-input {
    margin-top: 15px;
    display: flex;
    align-items: center;
    gap: 10px;
}

.error-message {
    color: #f56c6c;
    font-size: 12px;
    margin-top: 5px;
}

.el-select {
    width: 120px;
}
</style>
