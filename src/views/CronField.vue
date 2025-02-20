<template>
    <div class="cron-field">
        <el-radio-group v-model="selectedType">
            <el-radio :value=" '*' ">每{{ unit }}</el-radio>
            <el-radio :value="'range'">范围</el-radio>
            <el-radio :value="'step'">间隔</el-radio>
            <el-radio :value="'specific'">指定</el-radio>
        </el-radio-group>

        <div v-if="selectedType === 'range'">
            <el-input v-model="rangeStart" placeholder="起始值" @blur="formatRangeStart" />
            <el-input v-model="rangeEnd" placeholder="结束值" @blur="formatRangeEnd" />
        </div>

        <div v-if="selectedType === 'step'">
            <el-input v-model="stepStart" placeholder="起始值" @blur="formatStepStart" />
            <el-input v-model="stepValue" placeholder="步长" @blur="formatStepValue" />
        </div>

        <div v-if="selectedType === 'specific'">
            <el-checkbox-group v-model="selectedValues">
                <el-checkbox v-for="value in values" :key="value" :label="value">{{ value }}</el-checkbox>
            </el-checkbox-group>
        </div>
    </div>
</template>

<script>
import { ref, watch } from "vue";

export default {
    props: {
        modelValue: String,
        unit: String,
    },
    emits: ["update:modelValue"],
    setup(props, { emit }) {
        const selectedType = ref("*");
        const rangeStart = ref("");
        const rangeEnd = ref("");
        const stepStart = ref("");
        const stepValue = ref("");
        const selectedValues = ref([]);

        // 确保数值不会带前导 0
        const formatNumber = (num) => (num ? String(parseInt(num, 10)) : "");

        const formatRangeStart = () => (rangeStart.value = formatNumber(rangeStart.value));
        const formatRangeEnd = () => (rangeEnd.value = formatNumber(rangeEnd.value));
        const formatStepStart = () => (stepStart.value = formatNumber(stepStart.value));
        const formatStepValue = () => (stepValue.value = formatNumber(stepValue.value));

        watch([selectedType, rangeStart, rangeEnd, stepStart, stepValue, selectedValues], () => {
            let newValue = "*";
            if (selectedType.value === "range" && rangeStart.value && rangeEnd.value) {
                newValue = `${formatNumber(rangeStart.value)}-${formatNumber(rangeEnd.value)}`;
            } else if (selectedType.value === "step" && stepStart.value && stepValue.value) {
                newValue = `${formatNumber(stepStart.value)}/${formatNumber(stepValue.value)}`;
            } else if (selectedType.value === "specific") {
                newValue = selectedValues.value.map(formatNumber).join(",");
            }
            emit("update:modelValue", newValue);
        });

        return {
            selectedType,
            rangeStart,
            rangeEnd,
            stepStart,
            stepValue,
            selectedValues,
            values: Array.from({ length: 60 }, (_, i) => String(i)), // 这里去掉 `padStart`
            formatRangeStart,
            formatRangeEnd,
            formatStepStart,
            formatStepValue,
        };
    },
};
</script>

<style scoped>
.cron-field {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-top: 10px;
}
</style>
