# Design

## Context

现有 Octop dashboard 使用 React/TypeScript、Ant Design、Lucide、i18next 和页面级 Less modules。`PageShell`、`ThemeContext`、`theme-vars.css` 与中央 locale JSON 已提供页面容器、主题变量和语言切换。`/tasks` 是定时任务页面，不能被复用或改名为派工中心。

## Goals / Non-Goals

**Goals:** 新增独立 `/dispatch` 页面；实现桌面三栏和窄屏切换；提供任务内存状态隔离、示例确认和结果占位；复用 Octop 现有语言、主题、组件和导航机制；让页面代码长期集中在 `dashboard/src/pages/Dispatch/`。

**Non-Goals:** 不新增 API、数据库迁移、Agent runtime、Matrix 连接器、真实模型调用、代码执行、预览服务或新的 UI/主题框架；不改变 `/chat`、`/tasks` 或全局偏好机制。

## Decisions

### 页面模块

页面、局部组件、示例类型/状态、Less module 和测试放入 `dashboard/src/pages/Dispatch/`。使用现有 `PageShell`、Ant Design `Card`/`Form`/`Empty`/`Alert` 等组件和 Lucide 图标；只有页面复杂度确实需要时才拆局部文件。

### 最小外围接入

在 `routes/index.tsx` 增加懒加载、`/dispatch` 路由和选中态；在 `routes/prefetch.ts` 增加页面预加载；在 `layouts/sidebarNav.tsx` 和后端 preferences 白名单增加菜单键；在 `locales/zh.json`、`en.json` 增加 `nav.dispatch` 与派工命名空间。外围文件不放派工业务逻辑。

### 内存示例状态

每个任务维护独立的 id、角色、标题、草稿、消息、确认状态、供应商选择和结果状态。创建/加载示例只更新 React 页面状态；确认、模拟重试和失败状态不调用网络。补充消息清除当前任务确认状态，刷新自然清空内存状态。

### 响应式与可访问性

宽屏使用三列 grid；窄屏由现有移动断点切换为 Segment/按钮区域。所有自定义可点击元素使用 button，表单字段使用 Ant Design Form，提供 label/aria-label、可见 focus 样式和键盘提交。颜色使用 `--fn-*` 语义变量与 Ant Design token，避免硬编码亮暗色。

### 验证

新增页面测试覆盖任务隔离、确认重置、空/加载/失败状态、路由和菜单映射；运行 dashboard TypeScript、相关测试、完整前端测试与构建。浏览器验收记录桌面、窄屏、语言和主题切换；模拟登录或 API 时明确注明，不能将其视为真实后端验收。

## Risks / Trade-offs

- [示例状态容易被误认为真实任务] → 页面、卡片、供应商区域和预览持续显示示例/未接入提示，并在刷新后说明内存重置。
- [外围导航文件影响长期 fork 合并] → 只添加单个路由、菜单、文案和白名单条目，页面业务不散落到外围文件。
- [窄屏三栏信息不足] → 使用区域切换而非压缩三栏，并保留任务状态和草稿。

## Migration Plan

无数据迁移。部署前构建 dashboard；回滚时移除 `/dispatch` 路由和菜单接入即可，现有聊天、定时任务和用户偏好不受影响。
