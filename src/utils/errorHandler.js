import { ElMessage } from 'element-plus';

export const errorHandler = (error, instance, info) => {
    console.error('Error:', error);
    console.error('Info:', info);
    
    // 统一错误提示
    ElMessage.error({
        message: error.message || '操作失败',
        duration: 3000
    });
    
    // 错误日志收集
    logError({
        error: error.message,
        stack: error.stack,
        info,
        timestamp: Date.now()
    });
};

// 错误日志收集
const logError = (errorInfo) => {
    // 可以将错误信息发送到服务器或保存到本地
    console.log('Error logged:', errorInfo);
}; 