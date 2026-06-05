# EDIC Design System — 知识库

**生成时间:** 2026-05-14
**Updated:** 2026-06-04
**分层**: 基础设施 (Infrastructure) — 设计系统
**状态:** v1.5.0 — 设计令牌 + 组件手册 + 图标库 + 暗色模式 + 展示网站 + AI 提示词/Skill + 品牌 Logo + 动效系统 + **完整工程治理层（CI/验证/流程文档）** + **品牌重塑为 EDIC（Editorial Design Interface for Content）** 已完成

> **v1.5.0 新增（2026-06-04）**: **品牌重塑为 EDIC（Editorial Design Interface for Content）** — 新定位为同时面向人类和 Agent 的编辑主义设计系统，新理念是为纷繁的数字内容建立温暖而克制的秩序。包名 `cgartlab-design-system` → `edic-design-system`，目录 `skills/cgartlab-design-system/` → `skills/edic-design-system/`，二维码 `cgartlabcom_qrcode.svg` → `ediccom_qrcode.svg`。GitHub 仓库、域名与 URL 引用保持不变（管理员操作延后到后续 PR）。

> **v1.3.x 新增（2026-06-01）**: 在 v1.1 视觉层之上补齐**工程治理层**——`.editorconfig` / `.gitattributes` / `.github/` 完整模板、`CONTRIBUTING.md` / `CHANGELOG.md` / `CODE_OF_CONDUCT.md` / `SECURITY.md` / `LICENSE`、流程文档（`docs/VERSIONING.md` / `COMPONENT-DEVELOPMENT.md` / `TESTING.md` / `RELEASE-CHECKLIST.md`）、6 个 Python 验证脚本（`tools/validate_*.py`）、CI 流水线（`ci.yml` + `release.yml`）、本地开发辅助（`Makefile` + `scripts/dev.*` + `.nvmrc`）、测试夹具（`tests/fixtures/`）。保持项目**零运行时依赖**原貌，仅添加开发期工具。

> **v1.1 关键特性**: 设计系统已升级为一个**多页静态展示网站**（首页 / 视觉手册 / 使用文档 / 提示词 / 下载），网站本身严格遵循设计系统规范，可经 GitHub Pages 公开访问（`designsystem.cgartlab.com`）。新增品牌 Logo、CSS/SVG 动效系统、滚动揭示、复制交互，以及可复制给任意 Agent 的系统提示词与 Skill 技能包，并生成真实示例 PDF。`company.html`（EDIC 公司官网示例）是首个采用 `--ds-*` 令牌的生产级页面。

## OVERVIEW

EDIC 设计系统。编辑主义 — 温暖、克制、秩序。基于 OKLch 色彩系统、衬线 Display + 无衬线 Body 经典搭配。

**视觉气质:** Editorial / 杂志感 + Warm / 温暖克制 + Restrained / 秩序井然
**目标平台:** Penpot 设计工具（SVG 拖入即用）
**色系:** 暖白纸色基底 + 橄榄绿强调色 + 语义色（success/warning/error/info）

## 已完成交付物

```
edic-design-system/
├── index.html          # 网站首页（亮点 · 兼容性 · AI 协作 · 系统组成 · 真实示例）
├── handbook.html       # 视觉手册（色彩/字体/间距/组件/图标/效果/令牌 — live 展示）
├── docs.html           # 使用文档（安装/令牌/主题/排版/组件/动效/可访问性/定制/FAQ）
├── prompts.html        # Agent 提示词与 Skill（完整/精简/Skill 三版，含各家接入位置）
├── downloads.html      # 下载（示例 PDF · 令牌 · 样式表 · 品牌素材 · 真实示例）
├── terms.html          # 使用条款（CC BY 4.0）
├── styles.css          # 独立样式表（:root 令牌 + 暗色 + 全部组件 + v1.1 动效/站点壳）
├── scripts.js          # 独立脚本（图标渲染 + 令牌表 + 暗色 + 滚动揭示 + 复制 + 标签页）
├── tokens.json         # 结构化令牌数据（颜色/字体/间距/圆角）
├── favicon.svg         # 站点图标（45° 钢笔头 monogram · 双封闭曲线）
├── VERSION             # 单行版本号文件（唯一真相源；stamp 工具会同步到 HTML/MD）
├── package.json        # 仅用于开发体验（serve / clean / 验证 wrapper）；运行时无 Node 依赖
├── Makefile            # 跨平台任务编排（make validate / make stamp-version / make serve）
├── .editorconfig       # 编辑器一致性（缩进/换行/编码）
├── .gitattributes      # Git 属性（行尾/二进制/Markdown diff）
├── .nvmrc              # Node 版本锁定（20）
│
├── assets/brand/       # 品牌 Logo：logo.svg / logo-on-dark.svg / logo-mark.svg
├── assets/downloads/   # 生成的示例 PDF（reference / color-card）
│
├── prompts/            # system-prompt.md · quick-prompt.md
├── skills/edic-design-system/SKILL.md   # Agent 技能包
│
├── tools/              # 验证脚本（纯 Python stdlib，零依赖）
│   ├── validate_tokens.py     # tokens.json ↔ styles.css 一致性
│   ├── validate_naming.py     # BEM / token 命名 + 反模式
│   ├── validate_html.py       # HTML 结构、引用有效性
│   ├── validate_a11y.py       # 可访问性（img alt、标题层级、对比度）
│   ├── validate_versions.py   # 资源 ?v= 与 VERSION 同步
│   ├── validate_links.py      # 内部/跨页锚点、资源引用
│   ├── stamp_version.py       # 把占位符替换为 VERSION（单一真相源）
│   └── generate_pdfs.py       # 无依赖 PDF 生成器（页脚读取 VERSION）
│
├── scripts/            # 本地开发辅助
│   ├── dev.sh                  # Bash 跨平台入口
│   ├── dev.ps1                 # PowerShell 入口
│   ├── pre-commit.sh           # Git hook 提交前自检
│   ├── run-validators.js       # Node 包装器（无 Python 也能用）
│   └── clean.js                # 跨平台清理
│
├── tests/              # 验证工具自检夹具
│   ├── README.md
│   ├── fixtures/html/          # minimal / with-errors / good-classes / bad-classes
│   ├── fixtures/tokens/        # tokens-good / tokens-bad
│   ├── fixtures/css/           # styles-sample
│   └── snapshots/              # 视觉回归占位
│
├── docs/               # 流程文档（v1.2）
│   ├── VERSIONING.md           # SemVer 适配设计系统的版本策略
│   ├── COMPONENT-DEVELOPMENT.md # 组件开发完整工作流
│   ├── TESTING.md              # 测试策略与各 validate_*.py 规范
│   └── RELEASE-CHECKLIST.md    # 发布流程检查清单
│
├── .github/            # GitHub 集成（v1.2）
│   ├── ISSUE_TEMPLATE/         # bug / feature / component / token / icon / docs / discussion
│   ├── PULL_REQUEST_TEMPLATE.md
│   ├── CODEOWNERS              # 路径 → 维护者团队映射
│   └── workflows/
│       ├── ci.yml              # 主验证流水线（PR / push 触发）
│       └── release.yml         # Tag 触发：构建 PDF + 创建 GitHub Release
│
├── 治理文件（v1.2）
│   ├── CONTRIBUTING.md         # 贡献流程
│   ├── CHANGELOG.md            # 版本历史（Keep a Changelog 格式）
│   ├── CODE_OF_CONDUCT.md      # 行为准则（Contributor Covenant 2.1）
│   ├── SECURITY.md             # 漏洞披露策略
│   └── LICENSE                 # CC BY 4.0 完整许可证文本
│
├── CNAME · .nojekyll   # GitHub Pages（自定义域名 designsystem.cgartlab.com）
├── README.md           # 仓库说明 + 部署指南
├── AGENTS.md           # 本文件
│
└── 真实示例：blog.html · company.html · resume.html · report.html
```

### 品牌 Logo（v1.3 重绘 — 45° 钢笔头 monogram）

- 精致钢笔头（fountain-pen nib）monogram，笔尖朝左下 45°，呼应 EDIC「编辑、秩序、克制」的理念。整个图形**仅由两根封闭曲线绘制**——笔尖轮廓（笔缝为尖端处的开放凹口）+ 透气孔圆。
- 实现为单一复合路径（轮廓 + 透气孔，`evenodd`），`transform="rotate(45 16 16)"` 旋转到 45°；笔缝由轮廓在笔尖处的凹口表达，透气孔与笔缝相连成「钥匙孔」，均为负空间。
- 渐变色板取自 OKLch 橄榄色阶（olive-200…600）的 hex 近似值，保证各端（favicon / og:image / 社交抓取）稳定渲染；站点 CSS 仍用 OKLch 令牌。
- `logo-mark.svg`：纯 `currentColor` 单一复合路径（两条封闭曲线），深浅主题自适配，作最简归一。
- `logo.svg`（浅底锁版）/ `logo-on-dark.svg`（深底，笔头提亮）/ `favicon.svg`（透明底）为完整彩色版：橄榄渐变笔头。
- 站点内导航/页脚 `.ds-logo-mark` 仍以橄榄渐变瓷砖（olive-300→accent→olive-600）作 CSS 容器承载白色笔头图形（笔缝/透气孔为负空间透出渐变）；Hero `.ds-logo-hero` 为三段渐变 + `::before` 柔光泽面，笔头先描边绘制再淡入填充。

### 动效系统（v1.1）

- 关键帧：`ds-fade-up/in/down`、`ds-zoom-in`、`ds-float`、`ds-spin-slow`、`ds-pulse-*`、`ds-gradient-pan`、`ds-draw`（SVG 描边）。
- 滚动揭示：`.ds-reveal`(+`--left/--right/--scale`，错峰用内联 `--d`)，IntersectionObserver 驱动。
- 全面尊重 `prefers-reduced-motion: reduce`。

### AI 协作交付物

- `prompts/system-prompt.md` — 完整系统提示词（最严格）。
- `prompts/quick-prompt.md` — 精简提示词（对话开场白）。
- `skills/edic-design-system/SKILL.md` — Skill 技能包（持久化）。
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

## CODE STYLE（代码样式规范）

### 代码块组件

使用 `ds-code` 系列 class 构建代码块，搭配 **Prism.js** 做语法高亮。

- `.ds-code` — 容器（暗背景、圆角、边框）
- `.ds-code-bar` — 顶栏（语言标签 + 复制按钮）
- `.ds-code-lang` — 语言标签（大写小字，mono 字族）
- `.ds-copy-btn[data-copy="#id"]` — 复制按钮
- `<pre><code class="language-*">` — Prism 高亮体

### Prism 集成

- 通过 CDN 加载 `prism.min.js`（零安装、零构建）
- 语法主题由 `styles.css` 中的 `--ds-token-*` 变量驱动，与 OKLch 色彩体系一致
- 推荐结构：`<figure class="ds-code"><div class="ds-code-bar">…</div><pre id="…"><code class="language-xxxx">…</code></pre></figure>`
- Prism 自动识别 `<code>` 上的 `language-*` / `lang-*` class

### 支持语言

默认支持 HTML（含 SVG/XML）、CSS、JavaScript。更多语言需引入对应 Prism 组件。

### 代码块令牌（`--ds-token-*`）

| 令牌 | OKLch 值 | 描述 |
|------|----------|------|
| `--ds-code-bg` | `oklch(14% 0.025 60)` → `oklch(18% 0.01 75)`（暗色） | 代码块背景 |
| `--ds-code-text` | `oklch(90% 0.015 85)` → `oklch(88% 0.01 85)`（暗色） | 基础文字色 |
| `--ds-token-comment` | `oklch(55% 0.035 130)` | 注释 |
| `--ds-token-keyword` | `oklch(78% 0.10 25)` | 关键字 |
| `--ds-token-string` | `oklch(82% 0.10 130)` | 字符串 |
| `--ds-token-function` | `oklch(85% 0.08 85)` | 函数/类名 |
| `--ds-token-number` | `oklch(80% 0.09 60)` | 数字/布尔 |
| `--ds-token-tag` | `oklch(78% 0.09 60)` | HTML 标签 |
| `--ds-token-attr-name` | `oklch(75% 0.06 180)` | 属性名 |
| `--ds-token-operator` | `oklch(70% 0.02 80)` | 运算符 |
| `--ds-token-punctuation` | `oklch(65% 0.02 80)` | 标点 |

> 代码块背景始终暗色（不随页面主题反转），语法颜色在两种主题下一致。

### 代码高亮反模式

- ❌ 在已有 Prism 的代码块中手动添加 `<span class="token-*">` — Prism 自动处理
- ❌ 代码块使用纯色硬编码 — 必须使用 `--ds-token-*` 变量
- ❌ 在暗色主题下代码块使用浅背景 — 代码块应始终暗色
- ❌ 在 `<code>` 中写入未转义的 HTML — 必须用 `&lt;` `&amp;`

## 构建与部署

**零运行时依赖 / 零构建。** 纯静态站点。GitHub Pages「Deploy from branch」直接托管 `main` 根目录，`.nojekyll` 关闭 Jekyll；`CNAME` 指向 `designsystem.cgartlab.com`。

> 唯一**开发时**依赖：Python 3.11+（验证工具）和 Node 20+（可选 `npx serve`）。**生产部署无需任何依赖**。
>
> 详细见 `docs/VERSIONING.md` 中"资源版本号同步"一节。

- 这是有意为之的设计取舍——保持框架无关、零运行时依赖。请勿引入打包/转译步骤。
- **v1.2 新增**：引入轻量**开发期**工具链（Python 验证脚本 + Makefile + Node 包装器），不影响运行时。
- 唯一运行时脚本 `tools/generate_pdfs.py` 为手动运行的示例 PDF 生成器，不在任何自动链路中（但 `release.yml` 会在 tag 触发时跑）。
- 缓存刷新：见上文「文件大小」备注（手动 bump `?v=`，由 `validate_versions.py` 自动校验）。
- **CI**：[`.github/workflows/ci.yml`](./.github/workflows/ci.yml) 在 PR / push / 每周一自动跑全部 6 个验证脚本。
- **Release**：[`.github/workflows/release.yml`](./.github/workflows/release.yml) 在 `v*` tag 触发，自动构建 PDF + 创建 GitHub Release。

## WHERE TO LOOK

| 事项 | 位置 | 说明 |
|------|------|------|
| 设计令牌定义 | `styles.css` `:root` | 所有 CSS 自定义属性（暗色在 `[data-theme="dark"]`） |
| 结构化令牌数据 | `tokens.json` | 程序化导入用 |
| 组件预览 | `handbook.html` #components | 组件 live 展示 |
| 图标 SVG 合集 | `scripts.js` 的 `ICONS` 数组 | 100 枚图标，运行时渲染 + 单枚下载 |
| 图标 sprite 文件 | `icons.svg`（由 `tools/generate_icons.py` 生成） | 独立 SVG sprite，Penpot 导入 / 外部 `<use href="icons.svg#X"/>` 引用 |
| 暗色模式 | `styles.css` `[data-theme="dark"]` | 完整暗色令牌覆盖 |
| 移动端导航 | `styles.css` `.ds-navbar*` / `scripts.js` 「Mobile Navigation」 | 玻璃顶栏 + 右侧抽屉 |
| 品牌 Logo | `assets/brand/*.svg` + `favicon.svg` | 双曲线 45° 钢笔头 monogram |
| 版本号源 | `VERSION` 单行文件 | 供 `validate_versions.py` 读取 |
| 贡献流程 | `CONTRIBUTING.md` | 从提 Issue 到 PR 的完整指南 |
| 版本策略 | `docs/VERSIONING.md` | SemVer 适配设计系统的规则 |
| 组件开发工作流 | `docs/COMPONENT-DEVELOPMENT.md` | 提案 → 令牌 → 原型 → 评审 |
| 测试策略 | `docs/TESTING.md` | 各 `validate_*.py` 规范 + 未来工作 |
| 发布检查清单 | `docs/RELEASE-CHECKLIST.md` | T-7 → T+1 天的完整发布流程 |
| 验证工具 | `tools/validate_*.py` | 6 个独立校验脚本 |
| CI 配置 | `.github/workflows/ci.yml` | 主验证流水线 |
| 发布流水线 | `.github/workflows/release.yml` | tag 触发 PDF + Release |
| 本地开发 | `Makefile` / `scripts/dev.*` | 跨平台任务入口 |
| 验证夹具 | `tests/fixtures/` | validate_*.py 自检样本 |
| GitHub 模板 | `.github/ISSUE_TEMPLATE/*` + `PULL_REQUEST_TEMPLATE.md` | 7 种 Issue 模板 + PR 模板 |

## NOTES

- 所有颜色使用 OKLch 定义，确保跨设备色准和可访问性
- 强调色 Olive Green 可无障碍替换（改 `--ds-color-olive-*` 和 `--ds-accent` 系）
- 参考优秀设计系统：Monocle（排版克制）、Stripe（温暖 utility）、Mercury（精致沉稳）

## 工程治理（v1.2 新增）

### 本地开发快速开始

```bash
# 验证全部
make validate

# 单项
make validate-tokens
make validate-naming
make validate-html
make validate-a11y
make validate-versions
make validate-links

# 本地预览
make serve            # http://localhost:8000

# 清理
make clean
```

或用 Node 包装（无需 Python）：

```bash
npm run validate
npm run serve
npm run clean
```

或用 Bash / PowerShell 脚本：

```bash
./scripts/dev.sh validate
./scripts/dev.sh serve
```

```powershell
.\scripts\dev.ps1 -Command validate
.\scripts\dev.ps1 -Command serve
```

### 提交前自检（可选）

```bash
# 一次性安装
ln -s ../../scripts/pre-commit.sh .git/hooks/pre-commit
```

之后每次 `git commit` 都会自动跑相关验证（仅检查本次改动的相关工具）。

### 验证工具退出码

| 退出码 | 含义 | CI 行为 |
|--------|------|---------|
| 0 | 全部通过 | ✓ |
| 1 | 存在错误 | ✗ 阻塞合并 |
| 2 | 仅警告 | ⚠ 提示但不阻塞 |

### 强制执行的反模式（CI 拒收）

- ❌ `as any` / `@ts-expect-error` / `@ts-ignore` / `@ts-nocheck`（JS 注释）
- ❌ 空 `catch {}` 块
- ❌ 顶层 `var` 声明（`scripts.js`）
- ❌ 颜色 token 不用 OKLch
- ❌ 重复 HTML id
- ❌ 资源 `?v=` 与 `VERSION` 不一致
- ❌ 内部锚点 / 跨页锚点 / 资源引用不存在
- ❌ `<html>` 缺 `lang` / `<head>` 缺 `meta charset`
- ❌ `<img>` 缺 `alt`
