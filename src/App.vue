<template>
    <div class="app">
        <div class="sidebar">
            <h2 class="sidebar-title">工具菜单</h2>
            <TreeMenu
                    :menu-data="menuData"
                    v-model:searchQuery="searchQuery"
                    @item-selected="handleItemSelected"
            />
        </div>
        <div class="content">
            <router-view />
        </div>
    </div>
</template>

<script>
import TreeMenu from './components/TreeMenu.vue';

export default {
    components: {
        TreeMenu,
    },
    data() {
        return {
            searchQuery: '',
            menuData: [
                {
                    name: '时间戳转换',
                    path: '/timeTools',
                },
                {
                    name: 'JSON格式化',
                    path: '/parseJson',
                },
                {
                    name: '更多',
                    isOpen: false,
                    children: [
                        {
                            name: 'CRON表达式',
                            path: '/cronGenerator',
                        },
                        {
                            name: 'Security',
                            path: '/security',
                        },
                    ],
                },
            ],
        };
    },
    methods: {
        handleItemSelected(item) {
            this.searchQuery = '';
            this.expandParentMenu(item);
        },
        expandParentMenu(item) {
            const findParent = (menu, target) => {
                for (const menuItem of menu) {
                    if (menuItem.children && menuItem.children.includes(target)) {
                        menuItem.isOpen = true;
                        return;
                    }
                    if (menuItem.children) {
                        findParent(menuItem.children, target);
                    }
                }
            };
            findParent(this.menuData, item);
        },
    },
};
</script>

<style scoped>
/* 统一全局样式 */
body {
    margin: 0;
    font-family: 'Poppins', Arial, sans-serif;
    background-color: #f4f6f9;
}

/* 页面布局 */
.app {
    display: flex;
    height: 96vh;
}

/* 侧边栏样式 */
.sidebar {
    height: 94vh;
    width: 280px;
    //background: linear-gradient(135deg, #4caf50, #2e7d32);
    color: black;
    padding: 20px;
    box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
}

.sidebar-title {
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 15px;
    text-align: center;
}

/* 内容区域样式 */
.content {
    flex: 1;
    padding: 20px;
    height: 94vh;
    background-color: #fff;
    box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.05);
    border-radius: 10px;
    overflow: auto;
}
</style>
