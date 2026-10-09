import { createRouter, createWebHashHistory } from 'vue-router'
import TimeTools from '../views/TimeTools.vue'
import ParseJson from '../views/ParseJson.vue'
import CronGenerator from '../views/CronGenerator.vue'
import Security from '../views/SecurityPage.vue'

const routes = [
  {
    path: '/',
    redirect: '/timeTools',
    meta: {
      title: '时间戳转换工具'
    }
  },
  {
    path: '/timeTools',
    component: TimeTools,
    meta: {
      title: '时间戳转换工具'
    }
  },
  {
    path: '/parseJson',
    component: ParseJson,
    meta: {
      title: 'JSON格式化工具'
    }
  },
  {
    path: '/cronGenerator',
    component: CronGenerator,
    meta: {
      title: 'CRON表达式生成器'
    }
  },
  {
    path: '/security',
    component: Security,
    meta: {
      title: '安全工具'
    }
  },
  // 处理404情况
  {
    path: '/:pathMatch(.*)*',
    redirect: '/timeTools',
    meta: {
      title: '页面未找到 - 重定向到时间戳工具'
    }
  }
]

const router = createRouter({
  history: createWebHashHistory(), // 使用 hash 模式
  routes,
  scrollBehavior(to, from, savedPosition) {
    // 页面切换时滚动到顶部
    return savedPosition || { top: 0 }
  }
})

// 全局前置守卫
router.beforeEach((to, from, next) => {
  // 设置页面标题
  if (to.meta?.title) {
    document.title = to.meta.title
  } else {
    document.title = '在线工具集合'
  }
  next()
})

// 全局后置钩子
router.afterEach((to, from) => {
  // 路由切换完成后的处理
  if (import.meta.env.DEV) {
    console.log(`路由切换: ${from.path} -> ${to.path}`)
  }
})

export default router
