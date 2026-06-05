# EDIC Design System

> 同时面向人类和 Agent 的编辑主义设计系统 — 为纷繁的数字内容建立温暖而克制的秩序。
> 基于 **OKLch** 与 **设计令牌**，框架无关、暗色就绪、中英文混排优化。

🌐 **网站：** https://designsystem.cgartlab.com

[![纯静态](https://img.shields.io/badge/build-zero%20dependencies-7d7a42)](https://designsystem.cgartlab.com)
[![OKLch](https://img.shields.io/badge/color-OKLch-7d7a42)](https://designsystem.cgartlab.com/docs.html#color)
[![暗色模式](https://img.shields.io/badge/dark%20mode-ready-7d7a42)](https://designsystem.cgartlab.com/docs.html#dark)
[![CI](https://img.shields.io/badge/CI-GitHub%20Actions-7d7a42)](./.github/workflows/ci.yml)
[![CC BY 4.0](https://img.shields.io/badge/license-CC%20BY%204.0-7d7a42)](https://creativecommons.org/licenses/by/4.0/)
[![v1.4.3](https://img.shields.io/badge/version-1.4.3-7d7a42)](./CHANGELOG.md)

---

## ✨ 特性

- **OKLch 色彩科学** — 全部颜色以 OKLch 定义，跨设备色准、明度可预测。
- **200+ 设计令牌** — 色彩 / 字体 / 间距 / 圆角 / 阴影 / 动效 / 层级，改一个变量全局更新。
- **编辑主义排版** — 衬线 Display + 无衬线 Body，针对中英混排优化字距与行高。
- **三种主题模式** — 支持跟随系统 / 手动浅色 / 手动暗色，导航栏按钮一键切换，移动端浮动按钮。
- **23 核心组件 · 100 图标** — 语义化 `ds-*` class，1.5 px 线性 SVG 图标。
- **动效系统** — 统一时长 / 缓动令牌、滚动揭示、SVG 描边，尊重 `prefers-reduced-motion`。
- **框架无关** — 没有构建工具、没有运行时依赖，可用于原生 HTML、React、Vue、Svelte、邮件与打印。
- **AI 就绪** — 一份提示词 / Skill，让任意 Agent 立刻按规范产出。
- **完整工程治理（v1.2）** — CI / 验证工具 / 流程文档 / Issue 模板。
- **CC BY 4.0 许可** — 开源可商用，只需署名即可自由使用、修改与分发。

## 🗂️ 网站结构

| 页面 | 说明 |
|------|------|
| `index.html` | 首页 — 亮点、兼容性、AI 协作、系统组成 |
| `handbook.html` | 视觉手册 — 色彩 / 字体 / 间距 / 组件 / 图标 / 效果 / 令牌的 live 展示 |
| `docs.html` | 使用文档 — 安装、令牌、主题、排版、组件、动效、可访问性、定制、FAQ |
| `prompts.html` | Agent 提示词与 Skill — 复制即用，含各家工具接入位置 |
| `downloads.html` | 下载 — 示例 PDF、令牌、样式表、品牌素材、真实示例 |
| `terms.html` | 使用条款 — CC BY 4.0 许可证说明与使用规范 |

### 示例页面

| 页面 | 说明 |
|------|------|
| `blog.html` | 纸间 · 评论博客 — 长文排版与文章目录示范 |
| `company.html` | EDIC 公司官网 — 生产级落地页示例 |
| `resume.html` | 简历模板 — 可打印为 PDF 的 A4 简历 |
| `report.html` | A4 报告规范 — 多页报告/白皮书的版式模板 |

## 📦 核心文件

```
styles.css                         # 全部令牌 + 暗色模式 + 组件 + 动效（零依赖）
scripts.js                        # 主题切换 / 滚动揭示 / 复制 / 标签页 / 图标渲染
tokens.json                      # 结构化设计令牌
VERSION                          # 当前版本号
favicon.svg                      # 站点图标
terms.html                       # 使用条款（CC BY 4.0）
LICENSE                          # CC BY 4.0 完整许可证文本
assets/brand/                     # Logo（浅底 / 深底 / mark）
assets/downloads/                 # 生成的示例 PDF
prompts/                          # system-prompt.md · quick-prompt.md
skills/edic-design-system/    # SKILL.md（Agent 技能包）
docs/                             # 流程文档（VERSIONING / COMPONENT-DEVELOPMENT / TESTING / RELEASE-CHECKLIST）
tools/                            # 验证脚本（validate_*.py）+ PDF 生成器
tests/                            # 验证工具自检夹具
scripts/                          # 本地开发辅助（dev.sh / dev.ps1 / pre-commit.sh / run-validators.js）
.github/                          # Issue 模板 + PR 模板 + CODEOWNERS + Workflows
```

## 🚀 快速开始

```html
<!doctype html>
<html lang="zh-CN" data-theme="">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="icon" type="image/svg+xml" href="favicon.svg">
    <link rel="stylesheet" href="styles.css">
  </head>
  <body>
    <button class="ds-btn ds-btn--primary">开始</button>
    <script src="scripts.js"></script>
  </body>
</html>
```

更多见 [使用文档](https://designsystem.cgartlab.com/docs.html)。

## 🎨 主题切换

主题切换按钮支持三种模式：

| 模式 | 图标 | 说明 |
|------|------|------|
| 跟随系统 | 🖥️ | 自动适配操作系统亮暗偏好 |
| 浅色模式 | ☀️ | 强制使用浅色主题 |
| 暗色模式 | 🌙 | 强制使用暗色主题 |

点击按钮在三种模式间循环切换。桌面端显示在导航栏最右侧，移动端显示为右下角浮动按钮。

用户选择会自动保存到本地存储，下次访问时恢复。

## 🤖 让 AI 遵循本系统

前往 [提示词页](https://designsystem.cgartlab.com/prompts.html) 复制 **系统提示词**、**精简提示词** 或 **Skill**，
粘贴到 ChatGPT / Claude / Cursor / Kiro 等任意 Agent，即可让其按规范产出界面、文档与素材。

## 📄 许可证

本设计系统采用 [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) 许可证。

- **可自由使用** — 可用于个人或商业项目
- **可自由修改** — 可根据需要修改和定制
- **须署名** — 使用时需保留 EDIC 设计系统的署名
- **衍生作品可选择许可证** — 修改后的版本可采用任何许可证（不要求保持 CC BY 4.0）

详见 [使用条款](https://designsystem.cgartlab.com/terms.html)。

## 🛠️ 重新生成示例 PDF

```bash
python3 tools/generate_pdfs.py
# 输出至 assets/downloads/
```

## ✅ 本地开发与验证

```bash
# 安装（一次性）
# 无需 npm install / pip install — 零运行时依赖

# 启动本地服务器
make serve                  # http://localhost:8000
# 或
python3 -m http.server 8000
# 或
npx serve -l 8000 .

# 验证全部
make validate               # 跑 6 个验证脚本
npm run validate            # 同上（Node 包装）
./scripts/dev.sh validate   # 同上（Bash）

# 单项验证
make validate-tokens
make validate-naming
make validate-html
make validate-a11y
make validate-versions
make validate-links

# 清理
make clean
```

CI 在 PR / push / 每周一自动跑全部验证：[`.github/workflows/ci.yml`](./.github/workflows/ci.yml)。

## 🌍 部署到 GitHub Pages（自定义域名）

本仓库已包含 `CNAME`（`designsystem.cgartlab.com`）与 `.nojekyll`。

1. **Settings → Pages**：Source 选择 `Deploy from a branch`，分支 `main`，目录 `/ (root)`。
2. **DNS**：在 `cgartlab.com` 解析处为 `designsystem` 添加一条 `CNAME` 记录，指向 `cgartlab.github.io`。
3. 等待证书签发后，访问 https://designsystem.cgartlab.com 。

> 仓库根目录即站点根目录，所有链接均为相对路径，开箱即可在 Pages 上运行。

---

© EDIC · 为纷繁的数字内容建立温暖而克制的秩序
