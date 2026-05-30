# CGArtLab Design System

> 编辑主义 × 橄榄绿 — 一套以 **OKLch** 与 **设计令牌** 驱动的开源设计系统。
> 框架无关、暗色就绪、中英文混排优化，并为 AI Agent 提供即用的提示词与 Skill。

🌐 **网站：** https://designsystem.cgartlab.com

[![纯静态](https://img.shields.io/badge/build-zero%20dependencies-7d7a42)](https://designsystem.cgartlab.com)
[![OKLch](https://img.shields.io/badge/color-OKLch-7d7a42)](https://designsystem.cgartlab.com/docs.html#color)
[![暗色模式](https://img.shields.io/badge/dark%20mode-ready-7d7a42)](https://designsystem.cgartlab.com/docs.html#dark)

---

## ✨ 特性

- **OKLch 色彩科学** — 全部颜色以 OKLch 定义，跨设备色准、明度可预测。
- **200+ 设计令牌** — 色彩 / 字体 / 间距 / 圆角 / 阴影 / 动效 / 层级，改一个变量全局更新。
- **编辑主义排版** — 衬线 Display + 无衬线 Body，针对中英混排优化字距与行高。
- **暗色模式** — 暖灰基底而非纯黑，强调色自动亮化，系统偏好 + 本地持久化。
- **25 核心组件 · 100 图标** — 语义化 `ds-*` class，1.5px 线性 SVG 图标。
- **动效系统** — 统一时长 / 缓动令牌、滚动揭示、SVG 描边，尊重 `prefers-reduced-motion`。
- **框架无关** — 没有构建工具、没有运行时依赖，可用于原生 HTML、React、Vue、Svelte、邮件与打印。
- **AI 就绪** — 一份提示词 / Skill，让任意 Agent 立刻按规范产出。

## 🗂️ 网站结构

| 页面 | 说明 |
|------|------|
| `index.html` | 首页 — 亮点、兼容性、AI 协作、系统组成 |
| `handbook.html` | 视觉手册 — 色彩 / 字体 / 间距 / 组件 / 图标 / 效果 / 令牌的 live 展示 |
| `docs.html` | 使用文档 — 安装、令牌、主题、排版、组件、动效、可访问性、定制、FAQ |
| `prompts.html` | Agent 提示词与 Skill — 复制即用，含各家工具接入位置 |
| `downloads.html` | 下载 — 示例 PDF、令牌、样式表、品牌素材、真实示例 |

## 📦 核心文件

```
styles.css                         # 全部令牌 + 暗色模式 + 组件 + 动效（零依赖）
scripts.js                         # 暗色切换 / 滚动揭示 / 复制 / 标签页 / 图标渲染
tokens.json                        # 结构化设计令牌
favicon.svg                        # 站点图标
assets/brand/                      # Logo（浅底 / 深底 / mark）
assets/downloads/                  # 生成的示例 PDF
prompts/                           # system-prompt.md · quick-prompt.md
skills/cgartlab-design-system/     # SKILL.md（Agent 技能包）
tools/generate_pdfs.py             # 无依赖 PDF 生成脚本
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

## 🤖 让 AI 遵循本系统

前往 [提示词页](https://designsystem.cgartlab.com/prompts.html) 复制 **系统提示词**、**精简提示词** 或 **Skill**，
粘贴到 ChatGPT / Claude / Cursor / Kiro 等任意 Agent，即可让其按规范产出界面、文档与素材。

## 🛠️ 重新生成示例 PDF

```bash
python3 tools/generate_pdfs.py
# 输出至 assets/downloads/
```

## 🌍 部署到 GitHub Pages（自定义域名）

本仓库已包含 `CNAME`（`designsystem.cgartlab.com`）与 `.nojekyll`。

1. **Settings → Pages**：Source 选择 `Deploy from a branch`，分支 `main`，目录 `/ (root)`。
2. **DNS**：在 `cgartlab.com` 解析处为 `designsystem` 添加一条 `CNAME` 记录，指向 `cgartlab.github.io`。
3. 等待证书签发后，访问 https://designsystem.cgartlab.com 。

> 仓库根目录即站点根目录，所有链接均为相对路径，开箱即可在 Pages 上运行。

---

© CGArtLab · 探索数字艺术的边界
