// Cron 字段范围定义
export const CRON_RANGES = {
    second: { min: 0, max: 59 },
    minute: { min: 0, max: 59 },
    hour: { min: 0, max: 23 },
    day: { min: 1, max: 31 },
    month: { min: 1, max: 12 },
    week: { min: 0, max: 7 },
    year: { min: 1970, max: 2099 }
};

// 字段描述
export const FIELD_DESCRIPTIONS = {
    second: '可用值: 0-59',
    minute: '可用值: 0-59',
    hour: '可用值: 0-23',
    day: '可用值: 1-31, L, W',
    month: '可用值: 1-12 或 JAN-DEC',
    week: '可用值: 0-7(0,7=SUN) 或 SUN-SAT',
    year: '可用值: 1970-2099 (可选)'
};

// 月份别名
export const MONTH_ALIASES = {
    JAN: 1, FEB: 2, MAR: 3, APR: 4, MAY: 5, JUN: 6,
    JUL: 7, AUG: 8, SEP: 9, OCT: 10, NOV: 11, DEC: 12
};

// 星期别名
export const WEEK_ALIASES = {
    SUN: 0, MON: 1, TUE: 2, WED: 3, THU: 4, FRI: 5, SAT: 6
};

// 验证 Cron 字段
export function validateCronField(value, type) {
    const range = CRON_RANGES[type];
    if (!range) return false;

    // 处理特殊字符
    if (value === '*' || value === '?') return true;
    
    // 处理 L、W、# 等特殊字符
    if (type === 'day' && /L|W$/.test(value)) return true;
    if (type === 'week' && /#\d$/.test(value)) return true;

    // 处理范围表达式
    if (value.includes('-')) {
        const [start, end] = value.split('-').map(Number);
        return start >= range.min && end <= range.max && start <= end;
    }

    // 处理间隔表达式
    if (value.includes('/')) {
        const [start, step] = value.split('/');
        const startNum = start === '*' ? range.min : parseInt(start);
        const stepNum = parseInt(step);
        return startNum >= range.min && 
               startNum <= range.max && 
               stepNum > 0 && 
               stepNum <= range.max;
    }

    // 处理列表
    if (value.includes(',')) {
        return value.split(',').every(v => validateCronField(v, type));
    }

    // 处理单个数值
    const num = parseInt(value);
    return !isNaN(num) && num >= range.min && num <= range.max;
}

// 验证完整的 Cron 表达式
export function validateCronExpression(expression) {
    const parts = expression.split(' ');
    if (parts.length !== 7) return false;

    const types = ['second', 'minute', 'hour', 'day', 'month', 'week', 'year'];
    return parts.every((part, index) => validateCronField(part, types[index]));
}

// 获取字段的可选值
export function getFieldOptions(type) {
    const range = CRON_RANGES[type];
    if (!range) return [];
    
    const options = [];
    for (let i = range.min; i <= range.max; i++) {
        let label = i.toString();
        if (type === 'month' && MONTH_ALIASES[i]) {
            label += `(${Object.keys(MONTH_ALIASES)[i-1]})`;
        } else if (type === 'week' && WEEK_ALIASES[i] !== undefined) {
            label += `(${Object.keys(WEEK_ALIASES)[i]})`;
        }
        options.push({
            value: i.toString(),
            label
        });
    }
    return options;
} 