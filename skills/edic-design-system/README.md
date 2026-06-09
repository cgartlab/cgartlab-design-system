# EDIC Design System Skill Package v1.5.1
# EDIC 设计系统 Skill 技能包 v1.5.1

[![License: CC BY 4.0](https://img.shields.io/badge/License-CC%20BY%204.0-blue.svg)](https://creativecommons.org/licenses/by/4.0/)
[![Version](https://img.shields.io/badge/Version-1.5.1-green.svg)](https://edic.cgartlab.com/)

---

## Quick Start / 快速开始

### Claude Code / Claude Code 安装

```bash
# 方式一：复制到项目 skills 目录
mkdir -p .claude/skills
# 将本压缩包解压后的 edic-design-system 文件夹复制到 .claude/skills/
# 或直接复制 SKILL.md 到项目根目录的 .claude/目录

# 方式二：复制到全局 skills 目录
# ~/.claude/skills/edic-design-system/SKILL.md
```

### Other Agents / 其他 Agent 接入

| Agent | 安装位置 | 说明 |
|-------|----------|------|
| ChatGPT | Custom Instructions / 对话首条 |复制精简提示词或 system-prompt.md |
| Cursor | `.cursor/rules` / Settings → Rules for AI | 写入规则文件 |
| Kiro | `.kiro/steering/` / `.kiro/skills/` | 放入技能目录 |
| GitHub Copilot | `.github/copilot-instructions.md` | 写入项目说明 |
| Gemini / 其他 LLM | 系统消息 / System Message | 作为系统指令粘贴 |

---

## File Description / 文件说明

| 文件 | 用途 |
|------|------|
| `SKILL.md` | Agent 技能包 / Agent Skill Package — 持久化遵循设计规范 |
| `edic-design-system.css` | 完整样式表 / Complete Stylesheet —零依赖的纯 CSS |
| `edic-design-system.json` | 设计令牌 / Design Tokens — 结构化 JSON 格式 |

---

## Design Principles / 设计原则

1. **OKLch Colors / OKLch 颜色** — 所有颜色使用 OKLch 色彩空间，绝不用 hex/rgb
2. **Token-Driven / 令牌驱动** — 使用 `--ds-*` CSS 变量，禁止硬编码魔法数字
3. **Dark Mode / 暗色模式** — 基底用暖灰 `oklch(15% 0.008 75)`，非纯黑
4. **Component System / 组件系统** — 基类 + 修饰符：`ds-btn` / `ds-btn--primary`
5. **Accessibility / 无障碍** — 图标按钮需 `aria-label`，装饰元素需 `aria-hidden`

---

## Core Tokens / 核心令牌速查

```css
/* Colors / 颜色 */
--ds-color-bg: oklch(97% 0.012 80)          /* Warm paper background */
--ds-color-fg: oklch(20% 0.02 60)           /* Body text */
--ds-accent: oklch(52% 0.08 115)           /* Olive green accent */

/* Typography / 字体 */
--ds-font-display: serif                   /* Headings */
--ds-font-body: sans-serif                 /* Body / UI */
--ds-font-mono: monospace                  /* Code */

/* Spacing / 间距 */
--ds-space-1..32                          /* 4px base ratio */

/* Radius / 圆角 */
--ds-radius-md: 4px /* Core: 8-16px */

/* Motion / 动效 */
--ds-duration-150..500                    /* Duration scale */
--ds-ease-out: cubic-bezier(0.16, 1, 0.3, 1)
```

---

## Quick Component Reference / 常用组件速查

| 需求 Need | 组件类 Class |
|-----------|-------------|
| Button / 按钮 | `ds-btn ds-btn--primary` |
| Card / 卡片 | `ds-card ds-card--hoverable` |
| Input / 输入框 | `ds-input ds-label` |
| Badge / 徽章 | `ds-badge ds-badge--accent` |
| Alert / 提示框 | `ds-alert ds-alert--info` |
| Navbar / 导航栏 | `ds-navbar ds-navbar-link--active` |
| Dark toggle / 暗色切换 | `ds-theme-toggle-btn` |
| Reveal animation / 揭示动效 | `ds-reveal` + `--d` stagger |
| Toast / 通知 | `ds-toast ds-toast-icon` |

---

## Full Component Catalog / 完整组件目录

See `SKILL.md` for the complete list of 280+ component classes organized by category:
- Layout / 布局
- Buttons & Interactive / 按钮与交互
- Cards & Surfaces / 卡片与表面
- Forms / 表单
- Feedback / 反馈
- Navigation / 导航
- Data Display / 数据展示
- Overlay & Glass / 浮层与玻璃
- Typography / 排版
- Motion & Animation / 动效

---

## Reference Resources / 参考资源

- **Live Handbook / 视觉手册**: https://edic.cgartlab.com/docs.html
- **Documentation / 使用文档**: https://edic.cgartlab.com/docs.html
- **Downloads / 下载页面**: https://edic.cgartlab.com/downloads.html
- **GitHub Repository / GitHub 仓库**: https://github.com/cgartlab/cgartlab-design-system

---

## Changelog / 更新日志

### v1.5.1 (2026-06)
- 补全 280+ 遗漏的组件类 / Added 280+ missing component classes
- 统一组件目录结构 / Unified component catalog structure
- 添加双语 README 安装说明 / Added bilingual README installation guide

### v1.5.0 (2026-05)
- 初始发布 / Initial release