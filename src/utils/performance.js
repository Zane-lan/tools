export const performanceMonitor = {
    init() {
        // 监控页面加载性能
        window.addEventListener('load', () => {
            const timing = performance.getEntriesByType('navigation')[0];
            console.log('Page Load Time:', timing.loadEventEnd - timing.navigationStart);
        });
        
        // 监控组件渲染性能
        const observer = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                console.log('Component Render Time:', entry.duration);
            }
        });
        observer.observe({ entryTypes: ['measure'] });
    },
    
    // 记录组件渲染时间
    measureComponent(componentName) {
        performance.mark(`${componentName}-start`);
        return () => {
            performance.mark(`${componentName}-end`);
            performance.measure(
                componentName,
                `${componentName}-start`,
                `${componentName}-end`
            );
        };
    }
}; 