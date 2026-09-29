# Proposal

## Why

Octop 需要一个独立的派工中心入口，让用户在一个页面中查看任务、确认需求并查看执行结果。第一步只交付可验证的界面骨架和明确标注的示例交互，为后续真实任务持久化、采购通信和软件执行保留稳定的页面边界。

## What Changes

- 新增 `/dispatch` 页面和侧栏入口，保留 `/chat` 与 `/tasks` 原有语义。
- 按 Octop 现有方式实现宽屏三栏：任务列表、主对话与需求确认、执行与结果；窄屏提供三栏切换。
- 支持新建派工、显式选择采购经理或软件工程师、任务切换和任务内示例状态隔离。
- 使用明确标记的内存示例展示需求确认卡、供应商聊天/报价占位、软件执行/预览占位，以及空态、加载态、失败态和模拟重试。
- 沿用 Octop 的 i18next 中英文、明暗模式、跟随系统、主题色和 Ant Design 主题变量；页面不建立第二套主题或语言机制。
- 将页面、局部组件、示例状态、样式和测试集中在 `dashboard/src/pages/Dispatch/`；路由、菜单、语言资源和导航白名单只做必要接入。
- 本变更不接入真实模型、数据库、Matrix/供应商 IM、代码执行或预览服务；示例不宣称为已完成的派工闭环。

## Capabilities

### New Capabilities

- `dispatch-workspace-ui`: 派工中心第一阶段的页面、示例交互、语言主题一致性和可访问交互。

### Modified Capabilities

无。

## Impact

前端影响 `dashboard/src/pages/Dispatch/`，以及路由、侧栏、hover 预加载、中文/英文资源和导航偏好白名单的最小接入。复用 `PageShell`、Ant Design、Lucide、i18next、ThemeContext 和 `--fn-*` 主题变量。不新增依赖、不新增 API 或数据库迁移；后端和真实外部服务留给后续 OpenSpec 变更。
