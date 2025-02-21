export function parseQuartzCron(expression, count = 10) {
    const parts = expression.split(" ");
    if (parts.length !== 7) throw new Error("无效的 Quartz Cron 表达式");
    
    const [sec, min, hour, day, month, week, year] = parts;
    
    // 获取当前时间
    let now = new Date();
    now.setMilliseconds(0); // 确保毫秒数为 0
    
    const results = [];
    
    while (results.length < count) {
        now.setSeconds(now.getSeconds() + 1); // 每秒递增
        
        if (
                matchField(now.getSeconds(), sec, 0, 59) &&
                matchField(now.getMinutes(), min, 0, 59) &&
                matchField(now.getHours(), hour, 0, 23) &&
                matchField(now.getDate(), day, 1, 31) &&
                matchField(now.getMonth() + 1, month, 1, 12) &&
                matchField(now.getDay(), week, 0, 6) &&
                matchField(now.getFullYear(), year, 1970, 2099)
        ) {
            results.push(now.toLocaleString("zh-CN", { hour12: false }));
        }
    }
    
    return results;
}

// 判断当前值是否匹配 Cron 规则
function matchField(value, field, min, max) {
    if (field === "*") return true;
    if (field === "?") return true;
    
    if (field.includes(",")) {
        return field.split(",").some(part => matchField(value, part, min, max));
    }
    
    if (field.includes("-")) {
        const [start, end] = field.split("-").map(Number);
        return value >= start && value <= end;
    }
    
    if (field.includes("/")) {
        const [start, step] = field.split("/").map(Number);
        return (value - start) % step === 0;
    }
    
    return Number(field) === value;
}
