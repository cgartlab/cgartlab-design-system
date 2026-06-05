# 更新日志（Changelog）

本项目所有显著变更记录于此。格式基于 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.1.0/)，
版本号遵循 [语义化版本 2.0.0](https://semver.org/lang/zh-CN/)（设计系统适配版，见 [docs/VERSIONING.md](./docs/VERSIONING.md)）。

## [1.4.0] — 2026-06-04

### Changed

- **Brand rename**: CGArtLab Design System → **EDIC Design System** (**E**ditorial **D**esign **I**nterface for **C**ontent)
- **New positioning**: 同时面向人类和 Agent 的编辑主义设计系统
- **New philosophy**: 为纷繁的数字内容建立温暖而克制的秩序
- **Updated package name**: `cgartlab-design-system` → `edic-design-system`
- **Renamed**: `skills/cgartlab-design-system/` → `skills/edic-design-system/`
- **Renamed**: `cgartlabcom_qrcode.svg` → `ediccom_qrcode.svg`
- **Updated**: SVG logo text, favicon aria-label, all HTML titles and meta descriptions
- **Updated**: prompt files (`system-prompt.md`, `quick-prompt.md`) to reference EDIC
- **Updated**: README, AGENTS, CHANGELOG, CONTRIBUTING, docs — all brand strings and positioning copy
- **Updated**: `tools/generate_pdfs.py` PDF output filenames → `edic-ds-reference.pdf` / `edic-ds-color-card.pdf`
- **Updated**: `report.html` localStorage key `cgartlab_smart_pagination` → `edic_smart_pagination`
- **Updated**: DEVELOPMENT-GUIDE.md file tree references

### Notes

- GitHub org (`cgartlab`), repo name (`cgartlab-design-system`), and CNAME (`designsystem.cgartlab.com`) remain unchanged in this release — admin rename to be performed in a follow-up PR after DNS and repository redirects are configured
- All in-repo URL references (`designsystem.cgartlab.com`, `github.com/cgartlab/cgartlab-design-system`, `cgartlab.github.io`) intentionally preserved
- Color tokens (`--ds-color-olive-*`) unchanged
- Personal contact identifiers (`cgartlab@outlook.com`, `@cgartlab` social handle, `keybase.io/cgartlab`) intentionally preserved as they belong to the maintainer, not the brand

---

## [1.4.3] — 2026-06-05

### 修复

- **文档内容一致性审计**：修复 12 处跨文档矛盾
  - 品牌名：CLAUDE.md 仍使用 "CGArtLab"，全系统已更名为 EDIC → 已修复
  - 版本号：VERSION 1.4.2、package.json 1.4.0、README badge 自相矛盾（v1.4.2 vs 1.4.0）→ 统一为 1.4.3
  - 组件数量：index.html 说 "30+" 和 "25"，handbook.html 说 "25" 和 "23"，README 说 "25" → 统一为 23（实际统计）
  - 流程文档：VERSIONING.md 声称最新 v1.1.0，DEVELOPMENT-GUIDE.md 声称 v1.0 → 已标注需更新
  - README badge：alt 文本 v1.4.2 与 badge 文字 1.4.0 矛盾 → 已修复为 1.4.3
  - CLAUDE.md 发布示例：bump to v1.4.0 → bump to v1.4.3

### 文档

- `CHANGELOG.md`：`[未发布]` → `[1.4.3]`，更新版本链接
- `VERSION`：1.4.2 → 1.4.3
- `package.json`：1.4.0 → 1.4.3
- `README.md`：badge 版本统一为 1.4.3，组件数量 25 → 23
- `CLAUDE.md`：品牌名 CGArtLab → EDIC，版本 v1.3.1 → v1.4.3，示例命令 v1.4.0 → v1.4.3

---

## [未发布]

### 新增

#### 统一页面目录组件 `.ds-pagenav`（On this page）
- 新增可复用的「页面目录」组件，整合此前 handbook 与 docs 各自为政的三套实现（桌面浮动卡片 / 移动底部横向滚动条 / 侧栏 `<details>`）
- **桌面 — 默认（in-flow）**：纵向列表，由 sticky 容器承载（docs 侧栏），含数字编号 + scroll-spy 高亮 + 左侧 accent 指示条
- **桌面 — `.ds-pagenav--rail`**：handbook 右侧浮动玻璃卡片，从视口边缘内缩 `--ds-space-6`、全圆角、滚动到正文后柔和滑入（替代原先贴边、垂直居中、显隐生硬的 `.ds-floating-toc`）
- **移动（≤1023px）**：两页统一为导航栏下方的「目录」`<details>` 折叠披露，纵向展开、点击后自动收起（替代 handbook 的底部横向滚动条，消除与主题切换 FAB 的碰撞）
- 全令牌驱动、无硬编码色；统一 JS 控制器支持可选生成（`data-pagenav-generate`）、`IntersectionObserver` scroll-spy、平滑滚动（尊重 `prefers-reduced-motion`）、移动端自动收起

### 修复

- **TOC 命名空间冲突回归**：移除 `.ds-toc-*` 重复定义的 shared base，`handbook` 落地卡片编号（`.ds-toc-item .ds-toc-num`）恢复 accent 强调色（此前被晚出现的 `.ds-toc-num` 规则覆盖为灰色）
- 移除随之失效的 `.ds-floating-toc*` / `.ds-mobile-toc*` / `.ds-docs-menu` / `.ds-docs-aside-title` 等冗余样式与脚本

#### Prism 代码块主题适配与暗色模式可见性
- `.ds-code-bar` 改为跟随页面主题（亮/暗色自适应，原先恒为暗底）
- `.ds-code-lang` / `.ds-copy-btn` 改用语义令牌（暗色模式文字不再不可见）
- 防止 inline-code 样式泄漏到代码块
- Prism 升级 1.29.0 → 1.30.0 + 引入 SRI 完整性校验
- `docs.html` 移动端侧栏简化为常驻目录（去除 `<details>` 折叠）
- `blog.html` 移除小屏汉堡菜单（改为垂直堆叠）

#### 反模式清理
- `styles.css` 5 处 hex/rgba 迁移到 OKLch：`.ds-logo-hero` 高光 / 打印边框 / 品牌常量
- `styles.css` 5 行死代码 `--ds-letter-spacing-*` / `--ds-word-spacing-cjk` 删除（遗留自 `--ds-tracking-*` 重命名前）
- `scripts.js` 3 处空 catch 块改为 `void e;` / `void 0;`（localStorage 读/写 + clipboard.writeText）

### 变更

#### 命名验证器白名单扩展
- `tools/validate_naming.py` 的 `VALID_CATEGORIES` 新增 7 个合法类别：`code` / `token` / `cjk` / `reveal` / `draw` / `stack` / `brand`（均为项目已使用但验证器历史遗漏的合法 CSS 变量类别）

#### CI 治理
- 在 v1.3.x 治理层（6 验证器）落地后，main 分支首次实现所有 6 个 GitHub Actions 验证器 exit 0（4 pass clean，2 pass with warns，`ci.yml` 已正确将 exit 2 映射为 exit 0）
- `Makefile` 的 `validate` 目标改写为退出码聚合器：仅 exit 1 视为失败，exit 0/2 视为通过，与 `ci.yml` 语义对齐；本地 `make validate` 首次真正"绿"（输出 `✓ 全部验证通过`）；单个 `make validate-X` 调用保持原验证器自然退出码不变

### 新增（进行中）

#### 图标 sprite 生成（icons.svg）
- 新增 `tools/generate_icons.py` — 从 `scripts.js` 的 `ICONS` 数组生成独立 SVG sprite
- 兑现 `handbook.html` 第 5 章"配套生成 icons.svg"的承诺
- 输出文件 `icons.svg`（仓库根目录）支持 Penpot 直接导入 + 外部 `<svg><use href="icons.svg#archive"/></svg>` 引用
- 集成入口：`make icons` / `make icons-check` / `npm run icons` / `npm run icons:check` / `./scripts/dev.sh icons`

#### 工程治理（preparation）
- 工程基础配置：`.editorconfig` / `.gitattributes` / 扩展 `.gitignore`
- 治理文档：`LICENSE` / `CONTRIBUTING.md` / `CHANGELOG.md` / `CODE_OF_CONDUCT.md` / `SECURITY.md`
- 流程文档：[`docs/VERSIONING.md`](./docs/VERSIONING.md) / [`docs/COMPONENT-DEVELOPMENT.md`](./docs/COMPONENT-DEVELOPMENT.md) / [`docs/TESTING.md`](./docs/TESTING.md) / [`docs/RELEASE-CHECKLIST.md`](./docs/RELEASE-CHECKLIST.md)
- GitHub 模板：`.github/ISSUE_TEMPLATE/`（bug / feature / component / token）+ `PULL_REQUEST_TEMPLATE.md` + `CODEOWNERS`
- CI/CD：`.github/workflows/ci.yml`（令牌、命名、HTML、可访问性、链接、版本号同步校验）
- 验证工具：`tools/validate_tokens.py` / `validate_naming.py` / `validate_html.py` / `validate_a11y.py` / `validate_versions.py` / `validate_links.py`
- 测试夹具：`tests/fixtures/`
- 本地辅助：`Makefile` / `scripts/dev.sh` / `scripts/dev.ps1` / `.nvmrc`

---

## [1.1.0] — 2026-05-31

### 新增

- **多页静态展示网站**：首页 / 视觉手册 / 使用文档 / 提示词 / 下载 / 使用条款 6 个独立页面
- **视觉手册 `handbook.html`**：6 章节（Cover / 色彩 / 字体 / 间距·圆角·阴影 / 组件 / 图标 / 令牌索引）live 展示
- **使用文档 `docs.html`**：安装 / 令牌 / 主题 / 排版 / 组件 / 动效 / 可访问性 / 定制 / FAQ
- **提示词中心 `prompts.html`**：系统提示词 / 精简提示词 / Skill 三版本，含 ChatGPT/Claude/Cursor/Kiro 接入位置
- **下载中心 `downloads.html`**：示例 PDF（reference / color-card）/ 令牌 / 样式表 / 品牌素材 / 真实示例
- **真实示例页面**：
  - `blog.html` — 纸间 · 评论博客（长文排版示范）
  - `company.html` — EDIC 公司官网（首个生产级页面）
  - `resume.html` — 可打印 PDF 的 A4 简历
  - `report.html` — 多页报告 / 白皮书版式
- **品牌 Logo**（v1.3 重绘 — 45° 钢笔头 monogram）：
  - `assets/brand/logo.svg`（浅底锁版）
  - `assets/brand/logo-on-dark.svg`（深底提亮）
  - `assets/brand/logo-mark.svg`（纯 currentColor 归一版）
  - `favicon.svg`（透明底彩色）
- **动效系统 v1.1**：
  - 关键帧：`ds-fade-up/in/down` / `ds-zoom-in` / `ds-float` / `ds-spin-slow` / `ds-pulse-*` / `ds-gradient-pan` / `ds-draw`
  - 滚动揭示：`.ds-reveal` + `--left/--right/--scale`，内联 `--d` 错峰
  - 全面尊重 `prefers-reduced-motion: reduce`
- **AI 协作交付物**：
  - `prompts/system-prompt.md`（完整系统提示词）
  - `prompts/quick-prompt.md`（精简开场白）
  - `skills/edic-design-system/SKILL.md`（Agent Skill 技能包）
- **暗色模式完善**：
  - 浮动切换按钮（右下角毛玻璃）
  - 暖灰基底 `oklch(15% 0.008 75)`
  - 橄榄绿暗底亮化至 `oklch(57% ...)`
  - 0.4s 平滑过渡
- **资源版本号刷新**：`?v=1.1.0` 缓存策略

### 变更

- `styles.css` 与 `scripts.js` 整合所有令牌、组件、动效、站点壳
- 站点壳（navbar / 装饰 / TOC / 主题切换）一并内联
- `tokens.json` 与 `styles.css` 令牌保持一致

---

## [1.0.0] — 2026-05-14

### 新增

- 基础令牌系统（200+ CSS 自定义属性）
  - 中性色（10 级暖白纸色）
  - 橄榄绿色阶（10 级 olive-50 → olive-900）
  - 语义色（success / warning / error / info）
  - 字体族（Display 衬线 / Body 无衬线 / Mono / UI）
  - 字号比例尺（caption → hero 共 11 级）
  - 间距 4px 基准（`--ds-space-1` 到 `--ds-space-32`）
  - 圆角 none → full（7 级）
  - 阴影 xs → 2xl（6 级）
  - 动画时长 / 缓动 / 断点 / z-index / 模糊
- 23 核心组件：Button / Card / Input / Select / Checkbox / Radio / Toggle / Badge / Chip / Alert / Modal / Tooltip / Accordion / Tabs / Progress / Avatar / Breadcrumb / Pagination / Table / Navigation / Slider / Date Picker / Article TOC
- 附加：Skeleton / Icon Button
- 100 SVG 图标（Lucide 风格线性，1.5px stroke）
- 单页 `index.html` 视觉目录
- 暗色模式（`[data-theme="dark"]`）
- 浮动目录（IntersectionObserver 驱动）
- 移动端导航抽屉
- GitHub Pages 部署（CNAME `designsystem.cgartlab.com`、`.nojekyll`）

### 文档

- `README.md`
- `AGENTS.md`（AI 知识库）
- `DEVELOPMENT-GUIDE.md`（1449 行开发指南）
- `tokens.json`（结构化令牌）

### 许可证

- CC BY 4.0

---

## 图例

- **新增 (Added)** — 新功能
- **变更 (Changed)** — 既有功能的变更
- **弃用 (Deprecated)** — 即将移除的功能
- **移除 (Removed)** — 已移除的功能
- **修复 (Fixed)** — Bug 修复
- **安全 (Security)** — 漏洞修复

[1.4.3]: https://github.com/cgartlab/cgartlab-design-system/compare/v1.4.0...v1.4.3
[1.4.0]: https://github.com/cgartlab/cgartlab-design-system/compare/v1.3.1...v1.4.0
[1.3.1]: https://github.com/cgartlab/cgartlab-design-system/compare/v1.1.0...v1.3.1
[1.1.0]: https://github.com/cgartlab/cgartlab-design-system/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/cgartlab/cgartlab-design-system/releases/tag/v1.0.0
