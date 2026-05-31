# cgartlab Design System — 知识库

**生成时间:** 2026-05-14
**Updated:** 2026-05-31
**分层**: 基础设施 (Infrastructure) — 设计系统
**状态:** v1.1 — 设计令牌 + 组件手册 + 图标库 + 暗色模式 + **展示网站 + AI 提示词/Skill + 品牌 Logo + 动效系统** 已完成

> **v1.1 新增**: 设计系统已升级为一个**多页静态展示网站**（首页 / 视觉手册 / 使用文档 / 提示词 / 下载），网站本身严格遵循设计系统规范，可经 GitHub Pages 公开访问（`designsystem.cgartlab.com`）。新增品牌 Logo、CSS/SVG 动效系统、滚动揭示、复制交互，以及可复制给任意 Agent 的系统提示词与 Skill 技能包，并生成真实示例 PDF。`company.html`（CGArtLab 公司官网示例）是首个采用 `--ds-*` 令牌的生产级页面。

## OVERVIEW

CGArtLab 设计系统。编辑主义 × 橄榄绿 — 温暖、自信、精致。基于 OKLch 色彩系统、衬线 Display + 无衬线 Body 经典搭配。

**视觉气质:** Editorial / 杂志感 + Warm / 温暖友好
**目标平台:** Penpot 设计工具（SVG 拖入即用）
**色系:** 暖白纸色基底 + 橄榄绿强调色 + 语义色（success/warning/error/info）

## 已完成交付物

```
cgartlab-design-system/
├── index.html          # 网站首页（亮点 · 兼容性 · AI 协作 · 系统组成 · 真实示例）
├── handbook.html       # 视觉手册（色彩/字体/间距/组件/图标/效果/令牌 — live 展示）
├── docs.html           # 使用文档（安装/令牌/主题/排版/组件/动效/可访问性/定制/FAQ）
├── prompts.html        # Agent 提示词与 Skill（完整/精简/Skill 三版，含各家接入位置）
├── downloads.html      # 下载（示例 PDF · 令牌 · 样式表 · 品牌素材 · 真实示例）
├── styles.css          # 独立样式表（:root 令牌 + 暗色 + 全部组件 + v1.1 动效/站点壳）
├── scripts.js          # 独立脚本（图标渲染 + 令牌表 + 暗色 + 滚动揭示 + 复制 + 标签页）
├── tokens.json         # 结构化令牌数据（颜色/字体/间距/圆角）
├── favicon.svg         # 站点图标（橄榄叶 monogram 瓷砖）
├── assets/brand/       # 品牌 Logo：logo.svg / logo-on-dark.svg / logo-mark.svg
├── assets/downloads/   # 生成的示例 PDF（reference / color-card）
├── prompts/            # system-prompt.md · quick-prompt.md
├── skills/cgartlab-design-system/SKILL.md   # Agent 技能包
├── tools/generate_pdfs.py                   # 无依赖 PDF 生成器
├── CNAME · .nojekyll   # GitHub Pages（自定义域名 designsystem.cgartlab.com）
├── README.md           # 仓库说明 + 部署指南
├── AGENTS.md           # 本文件
└── 真实示例：blog.html · company.html · resume.html · report.html
```

### 品牌 Logo

- 编辑主义橄榄叶 monogram：**单一封闭曲线填充形状**（含负空间中脉），`currentColor` 着色，深浅主题自适配。
- `logo-mark.svg`（自适配）/ `logo.svg`（浅底锁版）/ `logo-on-dark.svg`（深底）/ `favicon.svg`（瓷砖）。
- 站点内（导航/页脚/Hero）使用同一内联填充叶形；Hero 版本先描边绘制再淡入填充。

### 动效系统（v1.1）

- 关键帧：`ds-fade-up/in/down`、`ds-zoom-in`、`ds-float`、`ds-spin-slow`、`ds-pulse-*`、`ds-gradient-pan`、`ds-draw`（SVG 描边）。
- 滚动揭示：`.ds-reveal`(+`--left/--right/--scale`，错峰用内联 `--d`)，IntersectionObserver 驱动。
- 全面尊重 `prefers-reduced-motion: reduce`。

### AI 协作交付物

- `prompts/system-prompt.md` — 完整系统提示词（最严格）。
- `prompts/quick-prompt.md` — 精简提示词（对话开场白）。
- `skills/cgartlab-design-system/SKILL.md` — Skill 技能包（持久化）。
- 三者在 `prompts.html` 提供一键复制与各家工具（ChatGPT/Claude/Cursor/Kiro/Copilot…）接入位置。

### handbook.html — 视觉手册

单页 HTML（引用外部 `styles.css` 和 `scripts.js`），包含 6 个章节：

| 章节 | 内容 |
|------|------|
| Cover | 系统名称 + 版本 + 视觉方向 |
| 01 色彩系统 | 中性色 (10级) + 橄榄绿 (10级) + 语义色 (4组) |
| 02 字体系统 | Display/Body/Mono/UI 四字族 + Type Scale (hero→caption) |
| 03 间距·圆角·阴影 | 间距比例尺 4px→128px + 6级阴影 + 7级圆角 |
| 04 组件库 | 23 核心组件 + 所有变体和状态 |
| 05 图标库 | 100 枚 SVG 图标，点击下载单枚 SVG |
| 06 令牌索引 | 全部 200+ CSS 自定义属性汇总表 |

### 暗色模式

- `[data-theme="dark"]` 完整暗色令牌覆盖
- 暖灰基底 `oklch(15% 0.008 75)` — 不是纯黑，不是冷灰
- 橄榄绿强调色在暗底亮化至 `oklch(57% ...)`
- 浮动切换按钮（右下角毛玻璃圆钮）
- `localStorage` 持久化 + `prefers-color-scheme` 系统偏好兜底
- `html` + `body` 0.4s 平滑过渡

### 23 核心组件

| # | 组件 | 说明 |
|---|------|------|
| 01 | Button | Primary / Secondary / Ghost / Disabled / Small / Large / Icon+text |
| 02 | Card | 默认 / Hoverable / Flat |
| 03 | Text Input | 正常 / Error / Hint |
| 04 | Select | 自定义箭头 |
| 05 | Checkbox | 选中 / 未选 / 禁用 |
| 06 | Radio | 三个选项 |
| 07 | Toggle / Switch | 带 Track + Thumb 动画 |
| 08 | Badge | Default / Accent / Success / Warning / Error |
| 09 | Chip / Pill | 默认 / Active / 可移除 |
| 10 | Alert | Info / Success / Warning / Error |
| 11 | Modal | Header + Body + Footer |
| 12 | Tooltip | 上方向箭头气泡 |
| 13 | Accordion | 可折叠面板，开合箭头动画 |
| 14 | Tabs | Pill 风格，温润圆角 |
| 15 | Progress | 标签 + 进度条 |
| 16 | Avatar | Small / Default / Large / Icon |
| 17 | Breadcrumb | 面包屑导航 |
| 18 | Pagination | 页码按钮 |
| 19 | Table | 表头 + 行 Hover |
| 20 | Navigation | 侧栏导航 + Dropdown 菜单 |
| 21 | Slider | 自定义 Range，橄榄绿轨道 + 圆润 Thumb |
| 22 | Date / Time Picker | 日历格 + 选中态 + 确定/取消 |
| 23 | Article TOC | 侧栏目录，H2/H3 层级缩进 + 活跃指示点 |

附加：Skeleton Loading（骨架屏）、Icon Button（图标按钮）

### 文件大小（约值）

| 文件 | 说明 |
|------|------|
| `index.html` | 网站首页，仅 HTML 结构，引用外部 `styles.css?v=*` / `scripts.js?v=*` |
| `styles.css` | `:root` 令牌 + 暗色模式 + 全部组件 + v1.1 站点壳/动效/导航 |
| `scripts.js` | 100 图标渲染 + 令牌表 + 暗色切换 + 滚动揭示 + 复制 + 移动端导航 |

> 资源通过 `?v=x.y.z` 查询串做缓存刷新（纯静态、无构建）。**改动 `styles.css`/`scripts.js` 后，务必在所有 HTML 中同步 bump 该版本号**，否则浏览器/CDN 会继续命中旧缓存。

## DESIGN TOKENS（已定义）

### 色彩 — 中性色（OKLch）

| Token | 值 | 用途 |
|-------|-----|------|
| `--ds-color-bg` | `oklch(97% 0.012 80)` | 整体背景 |
| `--ds-color-surface` | `oklch(99% 0.005 80)` | 卡片表面 |
| `--ds-color-surface-raised` | `oklch(100% 0 0)` | 弹出层/模态 |
| `--ds-color-fg` | `oklch(20% 0.02 60)` | 正文色 |
| `--ds-color-muted` | `oklch(48% 0.015 60)` | 辅助文字 |

### 色彩 — 橄榄绿（10 级色阶）

- Accent: `--ds-color-olive-400` → `oklch(52% 0.08 115)`
- Hover: `--ds-color-olive-500`
- Soft: `--ds-color-olive-100`
- 10 级从 `olive-50` (最浅) 到 `olive-900` (最深)

### 字体

| 角色 | 字族 |
|------|------|
| Display | Iowan Old Style / Charter / Georgia (serif) |
| Body | -apple-system / SF Pro / system-ui (sans) |
| Mono | JetBrains Mono / IBM Plex Mono |
| UI | -apple-system / system-ui |

### 间距

基于 4px 系统，4px → 128px 共 20 级（`--ds-space-1` 到 `--ds-space-32`）。

### 圆角

none(0) → full(9999px)，核心为 md(4px) / lg(8px) / xl(12px) / 2xl(16px)。

### 阴影

xs → 2xl 共 6 级，暗色模式 opacity 提高以保持层次。

## NAMING CONVENTIONS

- CSS 变量: `--ds-{category}-{name}`（`--ds-color-olive-400`）
- 组件 class: `ds-{component}`（`ds-btn`, `ds-card`, `ds-badge`）
- 变体 modifier: `ds-btn--primary`, `ds-card--hoverable`
- SVG 图标: `id.svg`（`search.svg`, `user.svg`）

## ANTI-PATTERNS（强制执行）

- ❌ 禁止 `as any` / `@ts-expect-error` / `@ts-ignore`
- ❌ 禁止空 catch 块
- ❌ 禁止内联 `style=`（除非动态计算无法用 class 表达）
- ❌ 禁止硬编码魔法数字（用 token）
- ❌ 暗色模式不要用纯黑 `#000` — 用暖灰 `oklch(15% ...)`
- ❌ 强调色在暗色模式不要直接用浅色模式的值 — 需要亮化 5-10%

## 构建与部署

**零构建。** 纯静态站点，无 `package.json`、无打包器、无 CI 工作流。GitHub Pages「Deploy from branch」直接托管 `main` 根目录，`.nojekyll` 关闭 Jekyll；`CNAME` 指向 `designsystem.cgartlab.com`。

- 这是有意为之的设计取舍——保持框架无关、零依赖。请勿引入打包/转译步骤。
- 唯一脚本 `tools/generate_pdfs.py` 为手动运行的示例 PDF 生成器，不在任何自动链路中。
- 缓存刷新：见上文「文件大小」备注（手动 bump `?v=`）。

## WHERE TO LOOK

| 事项 | 位置 | 说明 |
|------|------|------|
| 设计令牌定义 | `styles.css` `:root` | 所有 CSS 自定义属性（暗色在 `[data-theme="dark"]`） |
| 结构化令牌数据 | `tokens.json` | 程序化导入用 |
| 组件预览 | `handbook.html` #components | 组件 live 展示 |
| 图标 SVG 合集 | `scripts.js` 的 `ICONS` 数组 | 100 枚图标，运行时渲染 + 单枚下载 |
| 暗色模式 | `styles.css` `[data-theme="dark"]` | 完整暗色令牌覆盖 |
| 移动端导航 | `styles.css` `.ds-navbar*` / `scripts.js` 「Mobile Navigation」 | 玻璃顶栏 + 右侧抽屉 |
| 品牌 Logo | `assets/brand/*.svg` + `favicon.svg` | 填充叶形 monogram |

## NOTES

- 所有颜色使用 OKLch 定义，确保跨设备色准和可访问性
- 强调色 Olive Green 可无障碍替换（改 `--ds-color-olive-*` 和 `--ds-accent` 系）
- 参考优秀设计系统：Monocle（排版克制）、Stripe（温暖 utility）、Mercury（精致沉稳）
