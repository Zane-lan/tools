export const security = {
    // 清理用户输入
    sanitizeInput(input) {
        return input.replace(/<[^>]*>/g, '');
    },
    
    // XSS 防护
    escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
}; 
