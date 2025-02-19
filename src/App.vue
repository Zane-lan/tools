<template>
    <div class="app">
        <div class="sidebar">
            <!-- 使用 v-model 绑定 searchQuery -->
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
            searchQuery: '', // 搜索关键字
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
                            name: 'Profile',
                            path: '/profile',
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
        // 处理菜单项选中
        handleItemSelected(item) {
            this.searchQuery = ''; // 清除搜索框内容
            this.expandParentMenu(item); // 展开父菜单
        },
        // 展开父菜单
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

<style>
body {
    margin: 0;
    font-family: Arial, sans-serif;
}

.app {
    display: flex;
    height: 100vh;
}

.sidebar {
    width: 250px;
    background-color: #f5f5f5;
    border-right: 1px solid #ddd;
    padding: 20px;
    overflow-y: auto;
}

.content {
    flex: 1;
    padding-top: 20px;
    padding-left: 20px;
    padding-right: 20px;
    background-color: #fff;
}
</style>
