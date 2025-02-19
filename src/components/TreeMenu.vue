<template>
    <div class="tree-menu-container">
        <!-- 只在顶层显示搜索框 -->
        <input
                v-if="isRoot"
                :value="searchQuery"
                @input="onInput"
                placeholder="🔍 搜索工具..."
                class="search-input"
        />
        <!-- 树形菜单 -->
        <ul class="tree-menu">
            <li v-for="item in filteredMenu" :key="item.name">
                <div @click="handleItemClick(item)" class="menu-item">
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
        menuData: { type: Array, required: true },
        searchQuery: { type: String, default: '' },
        isRoot: { type: Boolean, default: true },
    },
    computed: {
        // 过滤菜单项
        filteredMenu() {
            const query = this.searchQuery.toLowerCase();
            if (!query) return this.menuData;

            const filterItems = (items) => {
                return items
                        .map((item) => {
                            const newItem = { ...item };
                            if (newItem.children) {
                                newItem.children = filterItems(newItem.children);
                                if (newItem.children.length > 0) {
                                    newItem.isOpen = true;
                                }
                            }
                            return newItem;
                        })
                        .filter((item) => item.name.toLowerCase().includes(query) || (item.children && item.children.length > 0));
            };

            return filterItems(this.menuData);
        },
    },
    methods: {
        handleItemClick(item) {
            if (item.children) {
                item.isOpen = !item.isOpen;
            } else {
                this.$emit('item-selected', item);
                this.$router.push(item.path);
            }
        },
        highlightMatch(text) {
            const query = this.searchQuery.toLowerCase();
            if (!query) return text;

            const regex = new RegExp(`(${query})`, 'gi');
            return text.replace(regex, '<span class="highlight">$1</span>');
        },
        onInput(event) {
            this.$emit('update:searchQuery', event.target.value);
        },
        handleItemSelected(item) {
            this.$emit('item-selected', item);
        },
    },
};
</script>

<style scoped>
/* 容器样式 */
.tree-menu-container {
    width: 90%;
    background: #ffffff;
    border-radius: 8px;
    padding: 5px;
}

/* 搜索框 */
.search-input {
    width: 100%;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 14px;
    outline: none;
    transition: 0.3s;
    box-shadow: inset 0 1px 4px rgba(0, 0, 0, 0.05);
}

.search-input:focus {
    border-color: #42b983;
    box-shadow: 0 0 5px rgba(66, 185, 131, 0.5);
}

/* 树形菜单 */
.tree-menu {
    list-style: none;
    padding: 0;
    margin-top: 10px;
}

/* 菜单项 */
.menu-item {
    padding: 8px 12px;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 14px;
    border-radius: 6px;
    transition: background 0.3s, transform 0.1s;
}

.menu-item:hover {
    background: #e0f2f1;
}

.menu-item:active {
    transform: scale(0.98);
}

/* 箭头样式 */
.arrow {
    font-size: 12px;
    color: #666;
    transition: transform 0.2s ease-in-out;
}

/* 高亮匹配 */
.highlight {
    background: #ffee58;
    color: #333;
    font-weight: bold;
    padding: 2px 4px;
    border-radius: 3px;
}
</style>
