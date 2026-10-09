# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

这是一个基于Vue 3 + Vite构建的在线工具集合项目，提供各种实用工具包括时间戳转换、JSON格式化、CRON表达式生成等。项目采用单页应用架构，部署在GitHub Pages上。

## 开发命令

### 基础开发命令
```bash
npm run dev          # 启动开发服务器 (http://localhost:5173)
npm run build        # 构建生产版本到 dist/ 目录
npm run preview      # 预览构建后的应用
npm run deploy       # 构建并部署到 GitHub Pages
```

### 部署相关
- 项目使用 `gh-pages` 进行GitHub Pages部署
- GitHub Actions配置在 `.github/workflows/deploy.yml`，main分支推送时自动部署
- Vite配置 `base: '/tools/'` 用于GitHub Pages子路径部署

## 架构和代码结构

### 技术栈
- **前端**: Vue 3 (Composition API), Vue Router 4
- **UI组件**: Element Plus 2.9.4
- **构建工具**: Vite 6.1.0
- **路由模式**: Hash路由 (`createWebHashHistory()`)
- **模块系统**: ESM (`"type": "module"`)

### 核心目录结构
```
src/
├── views/              # 页面组件 (每个工具独立页面)
│   ├── MyHome.vue      # 首页和导航
│   ├── TimeTools.vue   # 时间戳转换工具
│   ├── ParseJson.vue   # JSON格式化工具
│   ├── CronGenerator.vue # CRON表达式生成器
│   └── SecurityPage.vue # 安全工具页面
├── components/         # 可复用组件
│   └── TreeMenu.vue    # 树形导航菜单
├── utils/              # 业务逻辑工具函数
│   ├── cronParser.js   # Quartz CRON解析器 (核心算法)
│   ├── cronUtils.js    # CRON工具函数和常量
│   ├── security.js     # 安全相关工具
│   ├── errorHandler.js # 统一错误处理
│   └── performance.js  # 性能监控
├── router/             # 路由配置
│   └── index.js        # 路由映射定义
└── main.js             # 应用入口点
```

### 应用架构模式
- **页面路由映射**: 每个工具对应独立路由和组件
- **组件复用**: TreeMenu组件提供统一导航体验
- **工具函数分层**: utils目录按功能模块组织业务逻辑
- **错误处理**: errorHandler.js提供统一的错误处理机制

## 开发模式

### 添加新工具
1. 在 `src/views/` 创建新的Vue组件
2. 在 `src/router/index.js` 添加路由映射
3. 如需导航菜单，更新 `MyHome.vue` 中的菜单配置

### 代码约定
- 使用Vue 3 Composition API的 `<script setup>` 语法
- 遵循Vue 3最佳实践和组件化设计
- 业务逻辑抽取到utils目录的纯函数中
- 使用Element Plus组件库保持UI一致性

### CRON解析器特别注意
- `cronParser.js` 实现了完整的Quartz CRON表达式解析
- 支持秒级字段和时区处理
- 包含性能优化的时间增量算法
- 错误处理和边界情况处理完善

## 测试

### 测试框架
- 测试文件位于 `tests/unit/` 目录
- 使用Vue Test Utils进行组件测试
- 当前测试覆盖TimeTools组件功能

### 运行测试
```bash
# 注意：项目中未配置测试脚本，建议添加
npm run test:unit    # 建议配置，运行单元测试
npm run test         # 建议配置，运行所有测试
```

## 部署

### GitHub Pages部署
- 构建输出目录: `dist/`
- 部署基础路径: `/tools/`
- 自动部署: main分支推送触发GitHub Actions
- 手动部署: `npm run deploy` (需要gh-pages配置)

### 环境要求
- Node.js 18+ (GitHub Actions配置)
- npm 包管理器

## 项目特定配置

### Vite配置特点
- 插件: `@vitejs/plugin-vue`
- 基础路径: `/tools/` (GitHub Pages适配)
- 现代ES模块构建

### 路由配置
- 使用Hash路由模式 (`createWebHashHistory()`)
- 路径映射: `/timeTools`, `/parseJson`, `/cronGenerator`, `/security`

### 依赖管理
主要依赖:
- `vue`: 3.5.13
- `vue-router`: 4.5.0
- `element-plus`: 2.9.4 (UI组件库)
- `vue-json-pretty`: 2.4.0 (JSON格式化展示)

开发依赖:
- `vite`: 6.1.0 (构建工具)
- `gh-pages`: 6.3.0 (GitHub Pages部署)