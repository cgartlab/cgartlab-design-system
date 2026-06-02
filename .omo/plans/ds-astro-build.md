# CGArtLab Design System — Astro 构建计划

## TL;DR

> **Quick Summary**: 将现有 Penpot 导出的静态设计系统视觉手册（styles.css + index.html）升级为 Astro 5 架构的展示网站，保留现有样式和内容结构，添加暗色模式（系统自动+手动）、打印适配（名片/明信片/A6/A4）、SVG 图标 sprite 加载，并预留 React Islands 入口。
>
> **Deliverables**:
> - Astro 5 项目（apps/docs/）
> - 保留现有 styles.css 为全局样式
> - 内容从 index.html 迁移到 Astro 组件
> - 暗色模式切换（system pref + manual toggle）
> - 打印适配 CSS + 打印预览页面
> - SVG 图标 sprite 加载
> - Cloudflare Pages 部署配置
>
> **Estimated Effort**: Medium
> **Parallel Execution**: YES — 3 waves
> **Critical Path**: Init → Layout → Content Migration → Dark Mode → Print → Deploy

---

## Context

### Original Request
将 cgartlab-design-system 项目构建为 Astro 架构的设计系统展示网站，支持多载体适配（桌面、移动、印刷、明信片等），目前只做静态设计，未来扩展到动态 UI。

### Interview Summary

**Key Discussions**:
- 定位：对内规范参考 + 对外品牌展示
- 多载体策略：先统一令牌，后按需拆分
- 未来方向：交互式组件预览 + npm 包发布
- CSS 策略：【不动】保留现有 styles.css 作为 vanilla CSS
- 布局策略：【不动】保留单页滚动结构
- 暗色模式：自动跟随系统偏好 + 手动按钮切换
- 图标：SVG sprite 一次性加载

**Research Findings**:
- 项目已有完整资产：styles.css (32KB, 130+ CSS vars, 暗色模式, 23 组件), index.html (41KB, 6 章视觉手册), scripts.js (16KB, 57 图标 + 令牌表), tokens.json, icons.svg
- Penpot MCP Local 模式可通过 `npx @penpot/mcp@stable` + OpenCode remote type 配置本地 MCP
- 选型确认：Astro 5 + React (未来) + pnpm workspace + Cloudflare Pages

---

## Work Objectives

### Core Objective
将 Penpot 导出的静态设计系统规范，工程化为 Astro 5 架构的展示网站，零改动现有样式和内容结构，附加暗色模式、打印适配、图标加载等增强功能。

### Concrete Deliverables
- Astro 5 项目（apps/docs/）可本地 `pnpm dev` 运行
- 首页完整展示 6 大章节（Cover → TOC → 色彩 → 字体 → 间距 → 组件 → 图标 → 令牌）
- 暗色模式系统（自动跟随 + 单按钮手动切换）
- 打印预览页面（名片 90×54mm、明信片 102×152mm、A6 卡片、A4 文档）
- Cloudflare Pages 部署配置

### Definition of Done
- [ ] `pnpm build` 产出 `/dist/` 文件夹
- [ ] `pnpm dev` 本地开发运行正常
- [ ] 暗色模式在系统暗色时自动切换，按钮可手动切换
- [ ] 打印预览页面输出正确尺寸
- [ ] Cloudflare Pages 部署成功

### Must Have
- 保留现有 styles.css 和所有类名/变量名不变
- 保留现有 index.html 的内容结构和章节顺序
- 暗色模式同时支持 system pref 和 manual toggle
- 图标通过 SVG sprite 一次性加载

### Must NOT Have (Guardrails)
- 不修改 styles.css 内容
- 不修改 index.html 现有内容结构（内容可直接复制而不改动）
- 不引入 Tailwind（等 OpenDesign 定稿后再统一处理）
- 不改写单页滚动为多路由页面
- 不创建 React 组件（等后续 Phase）

---

## Verification Strategy

> **ZERO HUMAN INTERVENTION** — ALL verification is agent-executed.

### Test Decision
- **Infrastructure exists**: NO (greenfield)
- **Automated tests**: None for initial build
- **Agent-Executed QA**: Yes — all tasks include QA scenarios

### QA Policy
Every task MUST include agent-executed QA scenarios:
- **Build**: `pnpm build` exit code 0, dist/ exists
- **Dev**: `pnpm dev` starts without error
- **Dark mode**: Browser console toggle, verify data-theme attribute
- **Print**: View print preview, verify page sizes

---

## Execution Strategy

### Parallel Execution Waves

```
Wave 1 (Foundation — 4 parallel tasks):
├── Task 1: Astro project scaffolding
├── Task 2: Public assets migration (icons.svg, styles.css, scripts.js)
├── Task 3: Layout.astro + global.css
└── Task 4: Dark mode system (toggle + auto-follow)

Wave 2 (Content — 3 parallel tasks):
├── Task 5: Page sections (Cover, TOC, Colors, Typography, Spacing)
├── Task 6: Component showcase sections
└── Task 7: Icons + Tokens sections

Wave 3 (Print + Deploy — 4 parallel tasks):
├── Task 8: Print CSS (@media print rules)
├── Task 9: Print preview pages
├── Task 10: Cloudflare Pages config
└── Task 11: Final QA + polish
```

---

## TODOs

- [ ] 1. **Astro 项目脚手架初始化**

  **What to do**:
  - 在 `apps/docs/` 目录下用 pnpm 初始化 Astro 5 项目
  - package.json：scripts (`dev`, `build`, `preview`), dependencies (`astro`), devDependencies
  - `astro.config.mjs`：配置 site URL（暂用 `https://design.cgartlab.com`），output: 'static'
  - `tsconfig.json`：strict 模式，paths 别名 `@/*` → `./src/*`
  - `src/env.d.ts`：Astro 类型声明
  - 运行 `pnpm install` 确认依赖安装成功
  - `pnpm dev` 确认开发服务器启动

  **Must NOT do**:
  - 不初始化 React（等后续 Phase）
  - 不添加 Tailwind 集成

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Blocks**: Tasks 2, 3, 4, 5, 6, 7, 8

  **References**:
  - `D:\github-repos\cgartlab-design-system\index.html` — 内容源
  - `D:\github-repos\cgartlab-design-system\styles.css` — 全局样式源
  - `D:\github-repos\cgartlab-design-system\scripts.js` — 图标数据源

  **Acceptance Criteria**:
  - [ ] `apps/docs/package.json` exists with correct scripts
  - [ ] `pnpm install` succeeds (exit 0)
  - [ ] `pnpm dev` starts dev server on localhost:4321
  - [ ] `pnpm build` outputs to `apps/docs/dist/` with no errors

  **QA Scenarios**:
  ```
  Scenario: Fresh project builds
    Tool: Bash
    Preconditions: apps/docs/ directory exists
    Steps:
      1. cd apps/docs && pnpm install
      2. pnpm build
    Expected Result: Build succeeds, dist/ folder exists
    Evidence: .sisyphus/evidence/task-1-build.log

  Scenario: Dev server starts
    Tool: Bash (with timeout)
    Preconditions: Dependencies installed
    Steps:
      1. cd apps/docs && pnpm dev --host 2>&1
      2. Wait for "Local" URL to appear
    Expected Result: Server starts on 4321
    Evidence: .sisyphus/evidence/task-1-dev.log
  ```

  **Commit**: YES
  - Message: `feat(astro): init Astro 5 project in apps/docs`
  - Files: apps/docs/

- [ ] 2. **静态资源迁移（styles.css / scripts.js / icons.svg）**

  **What to do**:
  - 将 `styles.css` 复制到 `apps/docs/public/styles.css`
  - 将 `scripts.js` 复制到 `apps/docs/public/scripts.js`
  - 将 `icons.svg` 复制到 `apps/docs/public/icons.svg`
  - 确保路径在 Astro 中可直接 `/styles.css` 访问
  - `optimize: false` in build config（不处理已有 CSS）

  **Must NOT do**:
  - 不修改 styles.css 内容（哪怕是格式化）
  - 不修改 scripts.js 内容
  - 不修改 icons.svg 内容

  **Parallelization**:
  - **Can Run In Parallel**: YES (with Task 1? depends on dir existing)
  - **Blocked By**: Task 1
  - **Blocks**: Task 3, 5, 6, 7

  **Acceptance Criteria**:
  - [ ] `/styles.css` returns 200 in dev server
  - [ ] `/scripts.js` returns 200 in dev server
  - [ ] `/icons.svg` returns 200 in dev server
  - [ ] Content matches source files exactly

  **QA Scenarios**:
  ```
  Scenario: Assets accessible via HTTP
    Tool: Bash (curl)
    Preconditions: Dev server running on :4321
    Steps:
      1. curl -s -o /dev/null -w "%{http_code}" http://localhost:4321/styles.css
      2. curl -s -o /dev/null -w "%{http_code}" http://localhost:4321/scripts.js
      3. curl -s -o /dev/null -w "%{http_code}" http://localhost:4321/icons.svg
    Expected Result: All return 200
    Evidence: .sisyphus/evidence/task-2-assets-http.log
  ```

  **Commit**: YES (group with Task 1)
  - Message: `feat(astro): migrate static assets to apps/docs/public`

- [ ] 3. **Layout.astro 全局布局组件**

  **What to do**:
  - 创建 `apps/docs/src/layouts/Layout.astro`
  - `<html lang="zh-CN">`，包含 viewport meta
  - 引入 `/styles.css` 通过 `<link>` 标签
  - 引入 `/scripts.js` 通过 `<script>` 标签（defer）
  - 包含 `<slot />` 用于页面内容
  - 创建 `apps/docs/src/pages/index.astro` 使用 Layout
  - 在 index.astro 中先放一个占位 `<h1>` 确认渲染

  **Must NOT do**:
  - 不添加 Tailwind
  - 不修改现有样式

  **Parallelization**:
  - **Blocked By**: Tasks 1, 2
  - **Blocks**: Tasks 5, 6, 7

  **Acceptance Criteria**:
  - [ ] Layout.astro 正确引入 styles.css
  - [ ] scripts.js 以 defer 方式加载
  - [ ] 页面渲染后 styles.css 样式生效

  **QA Scenarios**:
  ```
  Scenario: Layout renders correctly
    Tool: Bash (curl)
    Preconditions: Dev server running
    Steps:
      1. curl -s http://localhost:4321/ | grep -c "styles.css"
      2. Check if stylesheet link is present in <head>
    Expected Result: styles.css referenced in HTML
    Evidence: .sisyphus/evidence/task-3-layout-html.log
  ```

  **Commit**: YES (group with Task 1, 2)
  - Message: `feat(astro): add Layout.astro with styles.css and scripts.js`

- [ ] 4. **暗色模式系统（自动跟随系统 + 手动切换）**

  **What to do**:
  - 在 `apps/docs/src/components/DarkToggle.astro` 中实现：
    - `<button>` 带 sun/moon SVG 图标（用 icons.svg sprite `<use href="/icons.svg#sun">`）
    - 内联 `<script>`（is:inline）处理暗色切换逻辑
  - JS 逻辑：
    1. 页面加载时检查 `localStorage.getItem('theme')`
    2. 如果有存储值 → 使用存储值
    3. 如果没有 → 读取 `prefers-color-scheme: dark` media query
    4. 设置 `document.documentElement.dataset.theme`
    5. 监听 `prefers-color-scheme` 变化（当没有手动设置时跟随）
    6. 按钮点击：切换 `data-theme`，保存到 `localStorage`
    7. 切换图标：暗色显示 moon，亮色显示 sun
  - 在 Layout.astro 的 `<head>` 中添加阻塞脚本（flashing prevention）：
    ```html
    <script is:inline>
      const t = localStorage.getItem('theme');
      if (t) document.documentElement.dataset.theme = t;
      else if (matchMedia('(prefers-color-scheme: dark)').matches)
        document.documentElement.dataset.theme = 'dark';
    </script>
    ```
  - DarkToggle 组件放在 Layout.astro 的 `<header>` 或固定位置

  **Must NOT do**:
  - 不修改 styles.css 的 `[data-theme="dark"]` 规则
  - 不引入任何第三方暗色切换库

  **Parallelization**:
  - **Blocked By**: Task 1 (project setup)
  - **Blocks**: Task 5 (content pages need dark mode working)

  **References**:
  - `styles.css:133-160` — 现有 `[data-theme="dark"]` 变量定义
  - `index.html` — 现有页面结构

  **Acceptance Criteria**:
  - [ ] 系统暗色模式时页面自动变暗
  - [ ] 按钮点击切换亮/暗
  - [ ] 手动选择后刷新页面保持选择
  - [ ] 删除 localStorage 后恢复系统跟随
  - [ ] 切换时无页面闪烁（flashing prevention 生效）

  **QA Scenarios**:
  ```
  Scenario: Dark mode toggle works
    Tool: Bash (tmux + browser console)
    Preconditions: Dev server running, browser open
    Steps:
      1. Open http://localhost:4321
      2. Check initial theme (should match system)
      3. Click toggle button
      4. Verify data-theme attribute on <html>
      5. Refresh page, verify theme persists
    Expected Result: Toggle cycles light/dark, persists on refresh
    Evidence: .sisyphus/evidence/task-4-darkmode.console

  Scenario: System preference auto-follow
    Tool: Bash
    Preconditions: No localStorage theme set
    Steps:
      1. Clear localStorage for localhost:4321
      2. Reload page
      3. Change system theme in OS
      4. Verify page follows
    Expected Result: Dark mode auto-follows OS preference
    Evidence: .sisyphus/evidence/task-4-system-follow.log
  ```

  **Commit**: YES
  - Message: `feat(astro): add dark mode with system auto-follow and manual toggle`

---

- [ ] 5. **页面内容迁移 — 前半部分（Cover / TOC / 色彩 / 字体 / 间距）**

  **What to do**:
  - 从 `index.html` 提取 Cover section 到 `apps/docs/src/components/Hero.astro`
  - 从 `index.html` 提取 TOC section 到 `apps/docs/src/components/Toc.astro`
  - 从 `index.html` 提取 Colors section 到 `apps/docs/src/components/Colors.astro`
  - 从 `index.html` 提取 Typography section 到 `apps/docs/src/components/Typography.astro`
  - 从 `index.html` 提取 Spacing section 到 `apps/docs/src/components/Spacing.astro`
  - 在 `apps/docs/src/pages/index.astro` 中按顺序引入所有组件
  - 所有组件使用 Astro 模板语法（`.astro`），不引入 React
  - 保持与 index.html 完全相同的 DOM 结构、类名、内联样式
  - 添加章节锚点 id（已在 index.html 中存在）
  - 添加平滑滚动：`html { scroll-behavior: smooth; }`（在 Layout.astro 中 inline style 或 styles.css 中已有）

  **Must NOT do**:
  - 不修改任何 CSS 类名
  - 不修改 HTML 结构
  - 不添加新内容

  **Parallelization**:
  - **Blocked By**: Task 1, 3
  - **Can Run In Parallel**: YES (all sections independent)
  - **Blocks**: — (no dependent tasks)

  **References**:
  - `index.html:8-180` — Cover, TOC, Colors, Typography, Spacing sections
  - `styles.css` — All `.ds-*` classes already defined

  **Acceptance Criteria**:
  - [ ] All 5 sections render correctly
  - [ ] Section order matches index.html
  - [ ] All class names match existing styles.css
  - [ ] Smooth scroll navigation works via TOC links

  **QA Scenarios**:
  ```
  Scenario: All sections render
    Tool: Bash (curl)
    Preconditions: Dev server running
    Steps:
      1. curl -s http://localhost:4321/ > /tmp/page.html
      2. grep -c 'ds-cover' /tmp/page.html
      3. grep -c 'id="colors"' /tmp/page.html
      4. grep -c 'id="typography"' /tmp/page.html
      5. grep -c 'id="spacing"' /tmp/page.html
    Expected Result: All section markers found
    Evidence: .sisyphus/evidence/task-5-sections.log
  ```

  **Commit**: YES (group with Tasks 6, 7)
  - Message: `feat(pages): migrate cover, toc, colors, typography, spacing sections`

- [ ] 6. **页面内容迁移 — 组件展示部分**

  **What to do**:
  - 从 `index.html` 提取 Components section 到 `apps/docs/src/components/Components.astro`
  - 保留所有组件的 HTML 演示代码（与 index.html 完全相同）
  - 组件展示包括所有 23 个组件的示例代码
  - 保持原有类名 `ds-component-preview`, `ds-component-group` 等
  - 按原有顺序排列：Button → Card → Badge → Input → Select → Checkbox → Radio → Toggle → Chip → Alert → Modal → Tooltip → Accordion → Avatar → Breadcrumb → Dropdown → Pagination → Progress → Skeleton → Tabs → Table

  **Must NOT do**:
  - 不修改组件展示的 HTML
  - 不添加 React 交互（后续 Phase）
  - 不改动类名

  **Parallelization**:
  - **Blocked By**: Task 1, 3
  - **Can Run In Parallel**: YES (with Tasks 5, 7)

  **References**:
  - `index.html:180-600` (approximate) — Components section HTML
  - `styles.css` — All `.ds-btn`, `.ds-card`, etc. class definitions

  **Acceptance Criteria**:
  - [ ] All 23 component groups render correctly
  - [ ] Component display matches index.html exactly
  - [ ] All demo HTML renders properly with styles

  **QA Scenarios**:
  ```
  Scenario: Component showcase renders
    Tool: Bash (curl)
    Preconditions: Dev server running
    Steps:
      1. curl -s http://localhost:4321/ | grep -c 'ds-component-preview'
      2. curl -s http://localhost:4321/ | grep -c 'ds-btn--primary'
      3. curl -s http://localhost:4321/ | grep -c 'ds-card'
    Expected Result: Component preview sections found
    Evidence: .sisyphus/evidence/task-6-components.log
  ```

  **Commit**: YES (group with Tasks 5, 7)
  - Message: `feat(pages): migrate 23 component showcase sections`

- [ ] 7. **页面内容迁移 — 图标 + 令牌索引**

  **What to do**:
  - 从 `index.html` 提取 Icons section 到 `apps/docs/src/components/Icons.astro`
  - 保留图标列表的展示方式
  - 确认图标使用 `/icons.svg` sprite 引用（通过 `<use href="/icons.svg#icon-name">`）
  - 从 `index.html` 提取 Tokens section 到 `apps/docs/src/components/Tokens.astro`
  - 保留令牌表格的 HTML 结构
  - 注意：scripts.js 中的 `ICONS` 和 `TOKENS` 数组是 JS 数据结构。图标网格可以用 scripts.js 渲染，也可以静态输出。优先使用 SVG sprite `<use>` 方式。

  **Must NOT do**:
  - 不修改 index.html 中的图标和令牌内容
  - 不重写 icons 布局，保持与 index.html 一致

  **Parallelization**:
  - **Blocked By**: Task 1, 3
  - **Can Run In Parallel**: YES (with Tasks 5, 6)

  **References**:
  - `index.html:600-890` (approximate) — Icons and Tokens sections
  - `scripts.js` — ICONS array, TOKENS array data
  - `icons.svg` — SVG icon definitions

  **Acceptance Criteria**:
  - [ ] Icons section renders with SVG sprite references
  - [ ] Tokens table renders all CSS variables
  - [ ] Icon SVG references use correct `/icons.svg#id` paths

  **QA Scenarios**:
  ```
  Scenario: Icons and tokens sections render
    Tool: Bash (curl)
    Preconditions: Dev server running
    Steps:
      1. curl -s http://localhost:4321/ | grep -c 'id="icons"'
      2. curl -s http://localhost:4321/ | grep -c 'id="tokens"'
      3. curl -s http://localhost:4321/ | grep -c 'icons.svg#'
    Expected Result: Both sections found, SVG sprite referenced
    Evidence: .sisyphus/evidence/task-7-icons-tokens.log
  ```

  **Commit**: YES (group with Tasks 5, 6)
  - Message: `feat(pages): migrate icons and tokens sections`

- [ ] 8. **打印样式表（print.css）**

  **What to do**:
  - 创建 `apps/docs/public/print.css` 包含所有打印相关样式
  - 对 `@media print` 的通用规则：
    - 隐藏导航、暗色切换、交互元素 (`display: none`)
    - 调整对比度用于打印（sRGB fallback for OKLCH）
    - 设置 `color-adjust: exact` 确保颜色打印
    - 分页控制 (`page-break-after`, `page-break-inside`)
  - 对特定载体的样式规则：
    - **名片** (90×54mm)：`.ds-print-business-card { width: 90mm; height: 54mm; }`
    - **明信片** (102×152mm)：`.ds-print-postcard { width: 102mm; height: 152mm; }`
    - **A6 卡片** (105×148mm)：`.ds-print-a6 { width: 105mm; height: 148mm; }`
    - **A4 文档**：`.ds-print-document { @page: A4; margin: 20mm; }`
  - 添加 `@page` 规则控制打印边距
  - 确保与现有 styles.css 的 token 变量兼容

  **Must NOT do**:
  - 不修改 styles.css 中的现有样式
  - 不在 print.css 中重复定义已存在的 token 变量

  **Parallelization**:
  - **Blocked By**: Task 1 (project exists)
  - **Can Run In Parallel**: YES (with Tasks 5, 6, 7)
  - **Blocks**: Task 9

  **Acceptance Criteria**:
  - [ ] print.css 文件存在
  - [ ] @media print 规则正确应用
  - [ ] 打印预览隐藏导航元素
  - [ ] 名片/明信片/A6/A4 尺寸定义正确

  **QA Scenarios**:
  ```
  Scenario: Print CSS rules exist
    Tool: Bash
    Preconditions: print.css exists
    Steps:
      1. grep -c '@media print' print.css
      2. grep -c 'business-card' print.css
      3. grep -c 'postcard' print.css
      4. grep -c '@page' print.css
    Expected Result: All print rules found
    Evidence: .sisyphus/evidence/task-8-print-css.log
  ```

  **Commit**: YES (group with Tasks 9, 10)
  - Message: `feat(print): add print.css with business card, postcard, A6, A4 support`

- [ ] 9. **打印预览页面**

  **What to do**:
  - 创建 `apps/docs/src/pages/print/business-card.astro` — 名片预览
  - 创建 `apps/docs/src/pages/print/postcard.astro` — 明信片预览
  - 创建 `apps/docs/src/pages/print/a6.astro` — A6 卡片预览
  - 创建 `apps/docs/src/pages/print/document.astro` — A4 文档规范预览
  - 每个页面使用 Layout.astro 但引入 print.css 替代/补充 styles.css
  - 页面内容：
    - 名片：CGArtLab logo + 名称 + 设计系统信息 + 色板
    - 明信片：视觉语言样本 + 颜色 + 字体展示
    - A6 卡片：核心令牌汇总
    - A4 文档：完整设计规范摘要
  - 每个页面包含打印按钮（`window.print()`）
  - 页面设置适当的 `<meta>` 标签

  **Must NOT do**:
  - 不修改现有主站内容

  **Parallelization**:
  - **Blocked By**: Tasks 1, 3, 8
  - **Can Run In Parallel**: YES (all print pages independent)

  **Acceptance Criteria**:
  - [ ] 4 print pages render at correct routes
  - [ ] Print button triggers print dialog
  - [ ] Print preview shows correct paper size
  - [ ] Print styles hide navigation elements

  **QA Scenarios**:
  ```
  Scenario: Print preview pages accessible
    Tool: Bash (curl)
    Preconditions: Dev server running
    Steps:
      1. curl -s -o /dev/null -w "%{http_code}" http://localhost:4321/print/business-card
      2. curl -s -o /dev/null -w "%{http_code}" http://localhost:4321/print/postcard
      3. curl -s -o /dev/null -w "%{http_code}" http://localhost:4321/print/a6
      4. curl -s -o /dev/null -w "%{http_code}" http://localhost:4321/print/document
    Expected Result: All return 200
    Evidence: .sisyphus/evidence/task-9-print-pages.log
  ```

  **Commit**: YES (group with Tasks 8, 10)
  - Message: `feat(print): add print preview pages for all form factors`

- [ ] 10. **Cloudflare Pages 部署配置**

  **What to do**:
  - 在项目根目录创建 `wrangler.toml`（或使用 `adapters/cloudflare`）：
    ```toml
    name = "cgartlab-design-system"
    main = "./dist/_worker.js"
    compatibility_date = "2026-05-13"
    ```
  - 安装 `@astrojs/cloudflare` adapter
  - 更新 `astro.config.mjs` 添加 Cloudflare adapter：
    ```js
    import { defineConfig } from 'astro/config';
    import cloudflare from '@astrojs/cloudflare';
    
    export default defineConfig({
      output: 'static',
      adapter: cloudflare(),
      site: 'https://design.cgartlab.com',
    });
    ```
  - 创建 `apps/docs/.github/workflows/deploy.yml`（可选）：
    ```yaml
    name: Deploy to Cloudflare Pages
    on: [push]
    jobs:
      deploy:
        runs-on: ubuntu-latest
        steps:
          - uses: actions/checkout@v4
          - run: cd apps/docs && pnpm install && pnpm build
          - uses: cloudflare/wrangler-action@v3
    ```
  - 验证 `pnpm build` 后 dist/ 可用

  **Must NOT do**:
  - 不配置域名 DNS（等用户确认域名后）
  - 不推送任何密钥/令牌到 git

  **Parallelization**:
  - **Blocked By**: Task 1 (project exists)
  - **Can Run In Parallel**: YES (with Tasks 5-9)

  **Acceptance Criteria**:
  - [ ] wrangler.toml 配置正确
  - [ ] @astrojs/cloudflare 安装成功
  - [ ] pnpm build 产出兼容 Cloudflare 的输出
  - [ ] GitHub workflow 文件语法正确

  **QA Scenarios**:
  ```
  Scenario: Build succeeds with Cloudflare adapter
    Tool: Bash
    Preconditions: Dependencies installed
    Steps:
      1. cd apps/docs && pnpm build
      2. Test-Path dist/
      3. Test-Path dist/_worker.js (or equivalent)
    Expected Result: Build succeeds, static output exists
    Evidence: .sisyphus/evidence/task-10-cloudflare-build.log
  ```

  **Commit**: YES (group with Tasks 8, 9)
  - Message: `feat(deploy): add Cloudflare Pages adapter and config`

- [ ] 11. **最终 QA + 打磨**

  **What to do**:
  - 运行 `pnpm build` 确认无错误
  - 在 dev 模式下检查所有章节渲染正确
  - 确认暗色模式在系统亮/暗下都正常工作
  - 确认打印预览页面可用
  - 确认 TOC 链接导航正确
  - 检查是否有任何缺失的资产引用
  - 确认 icons.svg sprite 正确加载所有图标
  - 确保 no broken links

  **Must NOT do**:
  - 不修改功能逻辑
  - 不添加新功能

  **Parallelization**:
  - **Blocked By**: ALL previous tasks
  - **Can Run In Parallel**: NO (final verification)

  **Acceptance Criteria**:
  - [ ] pnpm build passes
  - [ ] All sections render in correct order
  - [ ] Dark mode works (system + manual)
  - [ ] Print pages accessible
  - [ ] No 404s or broken assets

  **QA Scenarios**:
  ```
  Scenario: Full build verification
    Tool: Bash
    Preconditions: All code in place
    Steps:
      1. cd apps/docs && pnpm build
      2. Get-ChildItem dist/ -Recurse
    Expected Result: Build succeeds, dist/ has expected files
    Evidence: .sisyphus/evidence/task-11-final-build.log
  ```

  **Commit**: YES
  - Message: `chore(qa): final polish and verification`

- [ ] F1. **Plan Compliance Audit** — `oracle`
- [ ] F2. **Code Quality Review** — `unspecified-high`
- [ ] F3. **Real Manual QA** — `unspecified-high`
- [ ] F4. **Scope Fidelity Check** — `deep`

---

## Commit Strategy

- Task 1-4: `feat(astro): init Astro project with layout and dark mode`
- Task 5-7: `feat(pages): migrate content sections from index.html`
- Task 8-10: `feat(print): add print support and Cloudflare deploy config`
- Task 11: `chore(qa): final polish and verification`

## Success Criteria

### Verification Commands
```bash
cd apps/docs
pnpm install        # dependencies install cleanly
pnpm dev            # dev server starts on :4321
pnpm build          # builds to dist/ without errors
```

### Final Checklist
- [ ] All Must Have items present
- [ ] All Must NOT Have items absent
- [ ] Build passes, dist/ exists
- [ ] Dark mode toggle works (system + manual)
- [ ] Print styles produce correct page sizes
- [ ] Cloudflare Pages deploys successfully
