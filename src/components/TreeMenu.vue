<template>
  <div class="tree-menu-container">
    <!-- 只在顶层显示搜索框 -->
    <div v-if="isRoot" class="search-container">
      <input
        ref="searchInput"
        :value="searchQuery"
        placeholder="🔍 搜索工具..."
        class="search-input"
        @input="debouncedSearch"
      />
    </div>

    <!-- 树形菜单 -->
    <ul v-show="hasItems" class="tree-menu">
      <li
        v-for="item in filteredMenu"
        :key="getItemKey(item)"
        :class="{ 'has-children': item.children }"
      >
        <div
          class="menu-item"
          :class="{ 'is-active': isActiveItem(item) }"
          @click="handleItemClick(item)"
        >
          <span class="item-content">
            <span v-if="item.icon" class="item-icon" :class="item.icon"></span>
            <span class="item-name" v-html="highlightMatch(item.name)"></span>
            <span v-if="item.badge" class="item-badge">{{ item.badge }}</span>
          </span>
          <span v-if="item.children" class="arrow" :class="{ 'is-open': item.isOpen }">▼</span>
        </div>

        <!-- 递归渲染子菜单 -->
        <transition name="slide">
          <TreeMenu
            v-if="item.children && item.isOpen"
            :menu-data="item.children"
            :search-query="searchQuery"
            :is-root="false"
            @update:search-query="value => $emit('update:searchQuery', value)"
            @item-selected="handleItemSelected"
          />
        </transition>
      </li>
    </ul>

    <!-- 无结果提示 -->
    <div v-if="!hasItems && searchQuery" class="no-results">
      <span class="no-results-icon">🔍</span>
      <p class="no-results-text">未找到相关工具</p>
      <button class="clear-search-btn" @click="clearSearch">清除搜索</button>
    </div>
  </div>
</template>

<script setup>
  import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
  import { useRouter, useRoute } from 'vue-router'
  import { commonUtils } from '@/utils/commonUtils.js'

  const props = defineProps({
    menuData: { type: Array, required: true },
    searchQuery: { type: String, default: '' },
    isRoot: { type: Boolean, default: true }
  })

  const emit = defineEmits(['update:searchQuery', 'item-selected'])
  const router = useRouter()
  const route = useRoute()

  const searchInput = ref(null)
  const filterCache = new Map()
  const lastSearchQuery = ''

  // 防抖搜索函数
  const debouncedSearch = commonUtils.debounce(event => {
    emit('update:searchQuery', event.target.value)
  }, 300)

  // 检查是否有菜单项
  const hasItems = computed(() => {
    return filteredMenu.value.length > 0
  })

  // 优化的过滤菜单项（带缓存）
  const filteredMenu = computed(() => {
    const query = props.searchQuery.toLowerCase().trim()

    // 空查询直接返回原数据
    if (!query) {
      return props.menuData
    }

    // 检查缓存
    const cacheKey = `${props.menuData.length}-${query}`
    if (filterCache.has(cacheKey)) {
      return filterCache.get(cacheKey)
    }

    // 过滤函数
    const filterItems = items => {
      return items
        .map(item => {
          const newItem = { ...item }
          if (newItem.children) {
            newItem.children = filterItems(newItem.children)
            // 如果有匹配的子项，自动展开并显示父项
            if (newItem.children.length > 0) {
              newItem.isOpen = true
            }
          }
          return newItem
        })
        .filter(item => {
          const nameMatch = item.name.toLowerCase().includes(query)
          const hasMatchingChildren = item.children && item.children.length > 0
          const descriptionMatch =
            item.description && item.description.toLowerCase().includes(query)
          return nameMatch || hasMatchingChildren || descriptionMatch
        })
    }

    const result = filterItems(props.menuData)

    // 缓存结果（限制缓存大小）
    if (filterCache.size > 50) {
      const firstKey = filterCache.keys().next().value
      filterCache.delete(firstKey)
    }
    filterCache.set(cacheKey, result)

    return result
  })

  // 获取项目唯一key
  const getItemKey = (item, prefix = '') => {
    return `${prefix}${item.name}-${item.path || ''}`
  }

  // 检查是否为当前激活项
  const isActiveItem = item => {
    return (
      route.path === item.path ||
      (item.children && item.children.some(child => route.path === child.path))
    )
  }

  // 处理项目点击
  const handleItemClick = item => {
    if (item.children) {
      // 切换展开状态
      item.isOpen = !item.isOpen
    } else if (item.path) {
      // 导航到对应页面
      emit('item-selected', item)
      router.push(item.path)
    } else {
      // 其他情况发射事件
      emit('item-selected', item)
    }
  }

  // 高亮匹配文本
  const highlightMatch = text => {
    const query = props.searchQuery.trim()
    if (!query) return text

    try {
      const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
      return text.replace(regex, '<span class="highlight">$1</span>')
    } catch (error) {
      // 正则表达式错误时返回原文本
      return text
    }
  }

  // 清除搜索
  const clearSearch = () => {
    emit('update:searchQuery', '')
    filterCache.clear()
  }

  // 键盘快捷键支持
  const handleKeyboardShortcuts = event => {
    if (!props.isRoot) return

    // Ctrl/Cmd + F 聚焦搜索框
    if ((event.ctrlKey || event.metaKey) && event.key === 'f') {
      event.preventDefault()
      searchInput.value?.focus()
    }

    // Escape 清除搜索
    if (event.key === 'Escape' && props.searchQuery) {
      clearSearch()
    }
  }

  // 生命周期
  onMounted(() => {
    document.addEventListener('keydown', handleKeyboardShortcuts)
  })

  onUnmounted(() => {
    document.removeEventListener('keydown', handleKeyboardShortcuts)
    filterCache.clear()
  })
</script>

<style scoped>
  @import '@/assets/styles/variables.css';

  /* 容器样式 */
  .tree-menu-container {
    width: 100%;
    background: var(--background-white);
    border-radius: var(--border-radius-base);
    overflow: hidden;
  }

  /* 搜索容器 */
  .search-container {
    padding: var(--spacing-base) var(--spacing-large);
    border-bottom: 1px solid var(--border-lighter);
    background: var(--background-base);
  }

  /* 搜索框 */
  .search-input {
    width: 70%;
    max-width: 280px;
    padding: var(--spacing-small) var(--spacing-base);
    border: 1px solid var(--border-base);
    border-radius: var(--border-radius-base);
    font-size: var(--font-size-small);
    outline: none;
    transition: var(--transition-all);
    box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
    background: var(--background-white);
    margin: 0 auto;
    display: block;
  }

  .search-input:focus {
    border-color: var(--primary-color);
    box-shadow: 0 0 0 2px rgba(66, 185, 131, 0.2);
  }

  .search-input::placeholder {
    color: var(--text-placeholder);
  }

  /* 树形菜单 */
  .tree-menu {
    list-style: none;
    padding: 0;
    margin: 0;
    max-height: 60vh;
    overflow-y: auto;
  }

  /* 树形菜单滚动条样式 */
  .tree-menu::-webkit-scrollbar {
    width: 6px;
  }

  .tree-menu::-webkit-scrollbar-track {
    background: var(--background-base);
  }

  .tree-menu::-webkit-scrollbar-thumb {
    background: var(--border-base);
    border-radius: 3px;
  }

  .tree-menu::-webkit-scrollbar-thumb:hover {
    background: var(--border-light);
  }

  /* 菜单项 */
  .menu-item {
    padding: var(--spacing-base) var(--spacing-large);
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: var(--font-size-base);
    color: var(--text-primary);
    border-radius: var(--border-radius-small);
    transition: var(--transition-all);
    position: relative;
    margin: 1px var(--spacing-small);
  }

  .menu-item:hover {
    background: linear-gradient(90deg, rgba(66, 185, 131, 0.1) 0%, rgba(66, 185, 131, 0.05) 100%);
    transform: translateX(2px);
  }

  .menu-item.is-active {
    background: var(--primary-color);
    color: white;
    font-weight: 500;
  }

  .menu-item.is-active::before {
    content: '';
    position: absolute;
    left: -8px;
    top: 50%;
    transform: translateY(-50%);
    width: 4px;
    height: 60%;
    background: var(--primary-color);
    border-radius: 2px;
  }

  /* 菜单项内容 */
  .item-content {
    display: flex;
    align-items: center;
    gap: var(--spacing-small);
    flex: 1;
    overflow: hidden;
  }

  .item-icon {
    font-size: var(--font-size-base);
    opacity: 0.7;
  }

  .item-name {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .item-badge {
    padding: 2px 6px;
    background: var(--warning-color);
    color: white;
    border-radius: var(--border-radius-round);
    font-size: var(--font-size-extra-small);
    font-weight: 500;
    min-width: 20px;
    text-align: center;
  }

  /* 箭头样式 */
  .arrow {
    font-size: 10px;
    color: var(--text-secondary);
    transition: var(--transition-transform);
    transform: rotate(-90deg);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 16px;
    height: 16px;
  }

  .arrow.is-open {
    transform: rotate(0deg);
  }

  .menu-item:hover .arrow {
    color: var(--primary-color);
  }

  .menu-item.is-active .arrow {
    color: white;
  }

  /* 高亮匹配 */
  .highlight {
    background: var(--warning-color);
    color: white;
    font-weight: 600;
    padding: 1px 3px;
    border-radius: var(--border-radius-small);
    display: inline-block;
  }

  /* 无结果提示 */
  .no-results {
    text-align: center;
    padding: var(--spacing-extra-large) var(--spacing-large);
    color: var(--text-secondary);
  }

  .no-results-icon {
    font-size: 48px;
    display: block;
    margin-bottom: var(--spacing-base);
    opacity: 0.5;
  }

  .no-results-text {
    margin: var(--spacing-base) 0;
    font-size: var(--font-size-base);
  }

  .clear-search-btn {
    padding: var(--spacing-small) var(--spacing-large);
    background: var(--primary-color);
    color: white;
    border: none;
    border-radius: var(--border-radius-base);
    cursor: pointer;
    font-size: var(--font-size-small);
    transition: var(--transition-all);
  }

  .clear-search-btn:hover {
    background: var(--primary-hover);
    transform: translateY(-1px);
  }

  /* 过渡动画 */
  .slide-enter-active,
  .slide-leave-active {
    transition: all 0.3s ease;
    overflow: hidden;
  }

  .slide-enter-from {
    max-height: 0;
    opacity: 0;
    transform: translateY(-10px);
  }

  .slide-leave-to {
    max-height: 0;
    opacity: 0;
    transform: translateY(-10px);
  }

  /* 响应式优化 */
  @media (max-width: 768px) {
    .search-container {
      padding: var(--spacing-small);
    }

    .menu-item {
      padding: var(--spacing-base);
      margin: 0;
    }

    .tree-menu {
      max-height: 50vh;
    }

    .no-results {
      padding: var(--spacing-large) var(--spacing-base);
    }
  }

  /* 深色主题支持 */
  @media (prefers-color-scheme: dark) {
    .tree-menu-container {
      background: #2d2d2d;
      color: #ffffff;
    }

    .search-container {
      background: #252525;
      border-bottom-color: #444444;
    }

    .search-input {
      background: #333333;
      border-color: #555555;
      color: #ffffff;
    }

    .menu-item:hover {
      background: rgba(66, 185, 131, 0.2);
    }

    .tree-menu::-webkit-scrollbar-track {
      background: #252525;
    }

    .tree-menu::-webkit-scrollbar-thumb {
      background: #555555;
    }
  }
</style>
