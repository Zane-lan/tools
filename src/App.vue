<template>
  <div class="app">
    <div class="sidebar">
      <h2 class="sidebar-title">工具菜单</h2>
      <TreeMenu
        v-model:search-query="searchQuery"
        :menu-data="menuData"
        @item-selected="handleItemSelected"
      />
    </div>
    <div class="content">
      <router-view />
    </div>
  </div>
</template>

<script>
  import { ref, onMounted } from 'vue'
  import TreeMenu from './components/TreeMenu.vue'

  export default {
    name: 'App',
    components: {
      TreeMenu
    },
    setup() {
      const isDark = ref(false)

      // 切换主题
      const toggleDark = () => {
        isDark.value = !isDark.value
        savePreferences()
      }

      // 保存用户偏好
      const savePreferences = () => {
        try {
          localStorage.setItem(
            'preferences',
            JSON.stringify({
              isDark: isDark.value
            })
          )
        } catch (error) {
          console.warn('保存用户偏好失败:', error)
        }
      }

      // 加载用户偏好
      const loadPreferences = () => {
        try {
          const preferences = JSON.parse(localStorage.getItem('preferences'))
          if (preferences && typeof preferences.isDark === 'boolean') {
            isDark.value = preferences.isDark
          }
        } catch (error) {
          console.warn('加载用户偏好失败:', error)
        }
      }

      onMounted(() => {
        loadPreferences()
      })

      return {
        isDark,
        toggleDark
      }
    },
    data() {
      return {
        searchQuery: '',
        menuData: [
          {
            name: '时间戳转换',
            path: '/timeTools',
            icon: 'icon-clock',
            description: 'Unix时间戳与日期时间相互转换'
          },
          {
            name: 'JSON格式化',
            path: '/parseJson',
            icon: 'icon-code',
            description: 'JSON数据格式化和压缩工具'
          },
          {
            name: 'CRON表达式',
            path: '/cronGenerator',
            icon: 'icon-calendar',
            description: 'CRON表达式生成和解析工具'
          },
          {
            name: '更多工具',
            isOpen: false,
            icon: 'icon-more',
            description: '其他实用工具',
            children: [
              {
                name: 'Security',
                path: '/security',
                icon: 'icon-shield',
                description: '安全相关工具'
              }
            ]
          }
        ]
      }
    },
    methods: {
      handleItemSelected(item) {
        this.searchQuery = ''
        this.expandParentMenu(item)
      },
      expandParentMenu(item) {
        const findParent = (menu, target) => {
          for (const menuItem of menu) {
            if (menuItem.children && menuItem.children.includes(target)) {
              menuItem.isOpen = true
              return
            }
            if (menuItem.children) {
              findParent(menuItem.children, target)
            }
          }
        }
        findParent(this.menuData, item)
      }
    }
  }
</script>

<style scoped>
  @import '@/assets/styles/variables.css';

  /* 统一全局样式 */
  body {
    margin: 0;
    font-family:
      -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    background-color: var(--background-base);
    color: var(--text-primary);
  }

  /* 页面布局 */
  .app {
    display: flex;
    height: 100vh;
    overflow: hidden;
  }

  /* 侧边栏样式 */
  .sidebar {
    height: 100vh;
    width: 300px;
    background: var(--background-white);
    color: var(--text-primary);
    padding: var(--spacing-large);
    box-shadow: 2px 0 12px 0 rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    border-right: 1px solid var(--border-lighter);
  }

  .sidebar-title {
    font-size: var(--font-size-large);
    font-weight: 600;
    margin-bottom: var(--spacing-large);
    text-align: center;
    color: var(--text-primary);
    padding-bottom: var(--spacing-base);
    border-bottom: 1px solid var(--border-lighter);
  }

  /* 内容区域样式 */
  .content {
    flex: 1;
    padding: var(--spacing-large);
    height: 100vh;
    background-color: var(--background-base);
    overflow: auto;
    position: relative;
  }

  /* 滚动条样式 */
  .content::-webkit-scrollbar {
    width: 8px;
  }

  .content::-webkit-scrollbar-track {
    background: var(--background-base);
  }

  .content::-webkit-scrollbar-thumb {
    background: var(--border-base);
    border-radius: 4px;
  }

  .content::-webkit-scrollbar-thumb:hover {
    background: var(--border-light);
  }

  /* 响应式设计 */
  @media (max-width: 768px) {
    .app {
      flex-direction: column;
    }

    .sidebar {
      width: 100%;
      height: auto;
      max-height: 40vh;
      padding: var(--spacing-base);
      border-right: none;
      border-bottom: 1px solid var(--border-lighter);
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    }

    .sidebar-title {
      font-size: var(--font-size-base);
      margin-bottom: var(--spacing-base);
    }

    .content {
      height: auto;
      flex: 1;
      padding: var(--spacing-base);
    }
  }

  /* 深色主题支持 */
  @media (prefers-color-scheme: dark) {
    body {
      background-color: #1a1a1a;
    }

    .sidebar {
      background: #2d2d2d;
      border-right-color: #404040;
    }

    .content {
      background-color: #1a1a1a;
    }

    .content::-webkit-scrollbar-track {
      background: #2d2d2d;
    }

    .content::-webkit-scrollbar-thumb {
      background: #555555;
    }
  }
</style>
