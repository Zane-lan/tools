import { MONTH_ALIASES, WEEK_ALIASES } from './cronUtils';

export function parseQuartzCron(expression, count = 10, timezone = 'UTC') {
    const parts = expression.split(' ');
    if (parts.length !== 7) throw new Error('无效的 Quartz Cron 表达式');
    
    const [sec, min, hour, day, month, week, year] = parts;
    
    // 获取当前时间
    let now = new Date();
    // 转换为目标时区
    now = new Date(now.toLocaleString('en-US', { timeZone: timezone }));
    now.setMilliseconds(0);
    
    const results = [];
    let iterations = 0;
    const MAX_ITERATIONS = 1000; // 防止无限循环
    
    // 优化：根据表达式类型选择合适的时间增量
    const timeIncrement = getTimeIncrement(sec, min, hour);
    
    while (results.length < count && iterations < MAX_ITERATIONS) {
        iterations++;
        
        // 根据表达式类型增加时间
        if (timeIncrement === 'second') {
            now.setSeconds(now.getSeconds() + 1);
        } else if (timeIncrement === 'minute') {
            now.setMinutes(now.getMinutes() + 1);
            now.setSeconds(0);
        } else if (timeIncrement === 'hour') {
            now.setHours(now.getHours() + 1);
            now.setMinutes(0);
            now.setSeconds(0);
        } else if (timeIncrement === 'day') {
            now.setDate(now.getDate() + 1);
            now.setHours(0);
            now.setMinutes(0);
            now.setSeconds(0);
        }
        
        if (matchField(now.getSeconds(), sec, 'second', now) &&
            matchField(now.getMinutes(), min, 'minute', now) &&
            matchField(now.getHours(), hour, 'hour', now) &&
            matchField(now.getDate(), day, 'day', now) &&
            matchField(now.getMonth() + 1, month, 'month', now) &&
            matchField(now.getDay(), week, 'week', now) &&
            matchField(now.getFullYear(), year, 'year', now)) {
            results.push(now.getTime());
        }
    }
    
    if (iterations >= MAX_ITERATIONS) {
        throw new Error('无法计算下次执行时间，请检查表达式');
    }
    
    return results;
}

// 根据表达式类型确定合适的时间增量
function getTimeIncrement(sec, min, hour) {
    if (sec !== '*' && sec !== '?') return 'second';
    if (min !== '*' && min !== '?') return 'minute';
    if (hour !== '*' && hour !== '?') return 'hour';
    return 'day';
}

function matchField(value, field, type, date) {
    // 处理特殊字符
    if (field === '*' || field === '?') return true;
    
    // 替换别名
    field = replaceAliases(field, type);
    
    // 处理特殊字符
    if (field.includes('L')) {
        return isLastDayMatch(value, field, type, date);
    }
    if (field.includes('W')) {
        return isWorkdayMatch(value, field, date);
    }
    if (field.includes('#')) {
        return isNthDayMatch(value, field, date);
    }
    
    // 处理列表
    if (field.includes(',')) {
        return field.split(',').some(part => matchField(value, part, type, date));
    }
    
    // 处理范围
    if (field.includes('-')) {
        const [start, end] = field.split('-').map(Number);
        return value >= start && value <= end;
    }
    
    // 处理步长
    if (field.includes('/')) {
        const [start, step] = field.split('/');
        const startNum = start === '*' ? 0 : parseInt(start);
        return (value - startNum) % parseInt(step) === 0;
    }
    
    return parseInt(field) === value;
}

function replaceAliases(field, type) {
    if (type === 'month') {
        Object.entries(MONTH_ALIASES).forEach(([alias, num]) => {
            field = field.replace(new RegExp(alias, 'gi'), num);
        });
    } else if (type === 'week') {
        Object.entries(WEEK_ALIASES).forEach(([alias, num]) => {
            field = field.replace(new RegExp(alias, 'gi'), num);
        });
    }
    return field;
}

function isLastDayMatch(value, field, type, date) {
    if (type === 'day') {
        const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
        return value === lastDay;
    }
    if (type === 'week') {
        const lastWeek = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDay();
        return value === lastWeek;
    }
    return false;
}

function isWorkdayMatch(value, field, date) {
    const dayValue = parseInt(field.replace('W', ''));
    const targetDate = new Date(date.getFullYear(), date.getMonth(), dayValue);
    const dayOfWeek = targetDate.getDay();
    
    // 如果是周末，调整到最近的工作日
    if (dayOfWeek === 0) { // 周日
        targetDate.setDate(targetDate.getDate() + 1);
    } else if (dayOfWeek === 6) { // 周六
        targetDate.setDate(targetDate.getDate() - 1);
    }
    
    return value === targetDate.getDate();
}

function isNthDayMatch(value, field, date) {
    const [dayOfWeek, nth] = field.split('#').map(Number);
    
    // 计算当月第n个星期几
    let count = 0;
    let currentDate = new Date(date.getFullYear(), date.getMonth(), 1);
    
    while (currentDate.getMonth() === date.getMonth()) {
        if (currentDate.getDay() === dayOfWeek) {
            count++;
            if (count === nth) {
                return value === currentDate.getDate();
            }
        }
        currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return false;
}
