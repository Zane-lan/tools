<template>
    <div class="tree-menu-container">
        <!-- 只在顶层显示搜索框 -->
        <input
                v-if="isRoot"
                :value="searchQuery"
                @input="onInput"
                placeholder="Search..."
                class="search-input"
        />
        <!-- 树形菜单 -->
        <ul class="tree-menu">
            <li v-for="item in filteredMenu" :key="item.name">
                <div @click="handleItemClick(item)" class="menu-item">
                    <!-- 高亮匹配项 -->
                    <span v-html="highlightMatch(item.name)"></span>
                    <span v-if="item.children" class="arrow">
            {{ item.isOpen ? '▼' : '▶' }}
          </span>
                </div>
                <!-- 递归渲染子菜单 -->
                <TreeMenu
                        v-if="item.children && item.isOpen"
                        :menu-data="item.children"
                        :search-query="searchQuery"
                        :is-root="false"
                        @update:searchQuery="(value) => $emit('update:searchQuery', value)"
                        @item-selected="handleItemSelected"
                />
            </li>
        </ul>
    </div>
</template>

<script>
export default {
    name: 'TreeMenu',
    props: {
        menuData: {
            type: Array,
            required: true,
        },
        searchQuery: {
            type: String,
            default: '',
        },
        isRoot: {
            type: Boolean,
            default: true,
        },
    },
    computed: {
        // 过滤菜单项
        filteredMenu() {
            const query = this.searchQuery.toLowerCase();
            if (!query) return this.menuData;

            const filterItems = (items) => {
                return items
                        .map((item) => {
                            // 复制对象以避免修改原始数据
                            const newItem = { ...item };
                            if (newItem.children) {
                                newItem.children = filterItems(newItem.children);
                                // 如果子菜单有匹配项，展开父菜单
                                if (newItem.children.length > 0) {
                                    newItem.isOpen = true;
                                }
                            }
                            return newItem;
                        })
                        .filter((item) => {
                            // 保留匹配项或其子项匹配的菜单项
                            return (
                                    item.name.toLowerCase().includes(query) ||
                                    (item.children && item.children.length > 0)
                            );
                        });
            };

            return filterItems(this.menuData);
        },
    },
    methods: {
        // 处理菜单项点击
        handleItemClick(item) {
            if (item.children) {
                item.isOpen = !item.isOpen;
            } else {
                this.$emit('item-selected', item); // 通知父组件选中了菜单项
                this.$router.push(item.path); // 跳转到对应页面
            }
        },
        // 高亮匹配的关键字
        highlightMatch(text) {
            const query = this.searchQuery.toLowerCase();
            if (!query) return text;

            const regex = new RegExp(`(${query})`, 'gi');
            return text.replace(regex, '<span class="highlight">$1</span>');
        },
        // 输入事件处理
        onInput(event) {
            this.$emit('update:searchQuery', event.target.value);
        },
        // 处理子菜单项选中
        handleItemSelected(item) {
            this.$emit('item-selected', item); // 向上传递选中事件
        },
    },
};
</script>

<style>
.tree-menu-container {
    width: 100%;
}

.search-input {
    width: 100%;
    padding: 8px;
    margin-bottom: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 14px;
}

.tree-menu {
    list-style-type: none;
    padding-left: 20px;
}

.menu-item {
    padding: 8px;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.menu-item:hover {
    background-color: #f0f0f0;
}

.arrow {
    font-size: 12px;
}

.highlight {
    background-color: yellow;
    font-weight: bold;
}
</style>
