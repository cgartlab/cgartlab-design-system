# CGArtLab Design System — 剩余问题修复方案

> 生成时间：2026-06-04
> 基线：PR #110 + #111 合并后的 `main`
> 状态：**规划中，待执行**

---

## 1. 当前验证器状态

| 验证器 | Errors | Warnings | 状态 |
|---|---|---|---|
| `validate_tokens` | 0 | 12 | ✅ Green |
| `validate_naming` | 0 | 0 | ✅ 完全干净 |
| `validate_html` | 0 | 4 | ✅ Green |
| `validate_a11y` | 0 | **386** | ✅ 非阻塞 |
| `validate_versions` | 0 | 0 | ✅ 完全干净 |
| `validate_links` | 0 | 0 | ✅ 完全干净 |

**关键结论**：CI 已绿。所有剩余问题是 **非阻塞改进**，不是故障。

---

## 2. 完整问题清单

### 问题 A: 386 个 a11y 警告（3 个子类）

| 子类 | 数量 | 严重度 | 修复成本 |
|---|---|---|---|
| A1: `h2 → h4` 标题跳级（建议 h3） | 11 | 中 | 低（换标签名） |
| A2: `h1 → h3` 标题跳级（建议 h2） | 7 | 中 | 低（换标签名） |
| A3: `<a>` 缺少可访问名（aria-label）| ~368 | 低-中 | 高（逐元素处理） |

**文件分布**：全 10 个 HTML 文件均有涉及

### 问题 B: blog.html 22 个 onclick 反模式

| 元素 | 数量 | 当前模式 | 目标模式 |
|---|---|---|---|
| 导航链接 | 4 | `onclick="showSection('x')"` | `addEventListener('click', showSection)` |
| CTA 按钮 | 1 | `onclick="showSection('article');return false;"` | 同上 |
| 文章卡片 | 6 | `onclick="showSection('article');return false;"` | 同上 |
| 归档条目 | 8+3 | `onclick="showSection('article');return false;"` | 同上 |
| RSS 链接 | 1 | `href="javascript:void(0)"`（无 onclick）| 保留或改 `<span>` |

**同时清理**：`href="javascript:void(0)"` → `href="#"` + `preventDefault`

### 问题 C: 4 个 HTML 缺 meta description

| 文件 | 行号位置 | 建议内容 |
|---|---|---|
| `blog.html` | `<head>` (line 5-10) | "纸间 · 编辑主义设计与数字艺术独立刊物 — CGArtLab 设计系统博客示例" |
| `company.html` | `<head>` (line 4) | "CGArtLab — 探索数字艺术的边界，专注于设计系统与品牌视觉创意" |
| `report.html` | `<head>` (line 4-5) | "CGArtLab A4 报告规范 v3.0 — 国际标准文档模板与排版示例" |
| `resume.html` | `<head>` (line 5) | "CGArtLab 设计系统简历模板 — 可打印 A4 简历版式示例" |

### 问题 D: 12 个 tokens.json drift 警告

**根因**：JSON 结构 `colors.neutral.bg` → `--ds-colors-neutral-bg`，CSS 直接用 `--ds-color-bg`（无 `neutral` 层级）。是 JSON 多一层嵌套导致的验证器误报。

**修复方案**：
- **D1a（推荐）**：`validate_tokens.py` 的 `extract_vars_from_json` 函数中，将 JSON key `colors` 映射为 `color`，`colors-dark` 映射为 `color`（跳过 `neutral` 层级）
- **D1b（长期）**：重构 tokens.json 扁平化
- **当前状态**：跳过不修——12 个警告无功能影响

### 问题 E: AGENTS.md 已记录但未修复的设计缺口

| 子项 | 位置 | 修复方案 | 优先级 |
|---|---|---|---|
| E1: Accordion 用 `onclick` | `handbook.html` + `styles.css` | 重构为 `<button>` + addEventListener | 低 |
| E2: Tab 缺键盘导航 | `handbook.html` + `scripts.js` | 加 Arrow Left/Right 键监听 | 低 |
| E3: Toast 组件缺键盘关闭机制 | `handbook.html` | Tab 可达 + Enter 关闭 | 低 |

---

## 3. PR 分解策略

### Wave 0 — 快速回收（单文件，零风险）

#### PR-C1: 补 4 个 meta description
- **分支名**：`fix/meta-descriptions`
- **文件**：`blog.html`, `company.html`, `report.html`, `resume.html`
- **改动**：每个 `<head>` 加一行 `<meta name="description" content="...">`
- **验证**：`make validate-html` → warnings 从 4 → 0
- **风险**：零

### Wave 1 — 中等修复

#### PR-B2: blog.html onclick 重构
- **分支名**：`fix/blog-onclick`
- **文件**：`blog.html`
- **改动**：
  1. 在所有 `onclick` 元素上补足 `data-section` 属性
  2. 删除全部 22 个 `onclick` 属性
  3. 替换 `href="javascript:void(0)"` → `href="#"`
  4. 在 `<script>` 块中加事件委托监听器（基于 `data-section`）
  5. 可选：RSS 链接（无 onclick）改为 `href="#`" 或保留
- **验证**：`make validate-naming` → onclick 反模式降为 0
- **风险**：低（纯 JS 事件重构，visual 无变化）

#### PR-A12: 标题层级修复
- **分支名**：`fix/heading-hierarchy`
- **文件**：多个 HTML（具体行号由 validate_a11y.py 定位）
- **改动**：18 处 `h2→h4` 改为 `h2→h3`，`h1→h3` 改为 `h1→h2`
- **验证**：`make validate-a11y` → heading 跳级警告归零
- **风险**：低（纯标签名替换，不影响 CSS 样式选择器）

### Wave 2 — 批量修复

#### PR-A3: `<a>` 可访问名
- **分支名**：`fix/a-accessible-names`
- **文件**：全部 10 个 HTML
- **改动**：逐文件检查 `<a>` 元素，对缺文本的加 `aria-label`
- **验证**：先评估数量→可能需拆分为多 PR
- **风险**：无功能风险，但工作量大

---

## 4. 依赖关系图

```
Wave 0 (独立，可并行)
├── PR-C1 (4 meta descriptions) ─── 零依赖
├── PR-B2 (blog onclick) ───────── 零依赖
└── PR-A12 (heading hierarchy) ─── 零依赖

Wave 1 (可并行)
└── PR-A3 (a accessible names) ─── 零依赖，量大

Wave 2 (发布前)
├── PR-D1 (tokens drift) ───────── 低优先级
├── PR-E1/E2/E3 (component gaps) ─ 可由单独 session 完成
└── 版本 bump v1.4.0 ───────────── 依赖以上全部
```

---

## 5. 验证策略

每个 PR 合并前必须：

1. **`make validate`** — exit 0 + "✓ 全部验证通过"
2. **`make validate-tokens`** — 0 errors
3. **`make validate-naming`** — 0 errors
4. **`make validate-html`** — 0 errors (warns allowed)
5. **`make validate-a11y`** — 0 errors (warns allowed)
6. **`make validate-versions`** — 0 errors
7. **`make validate-links`** — 0 errors
8. **视觉检查**：对有 UI 变化的 PR（blog onclick），本地 `make serve` 打开页面检查

---

## 6. 工作分配建议

| PR | 工作量 | 建议分配 |
|---|---|---|
| PR-C1 | ~5 min | 直接执行 |
| PR-B2 | ~15-20 min | 直接执行 |
| PR-A12 | ~15-20 min | 直接执行 |
| PR-A3 | ~1-2 小时 | 分文件执行（每文件 ~10 min） |
| PR-D1 | ~30 min（需分析）| 暂缓 |
| PRs E1-E3 | ~30 min 每个 | 可独立 session 完成 |


## PR-B2 Final Handoff — exact commands to run when ready

Prerequisites for the next session:
- `gh auth login` (device code flow) so `gh pr create` and push work
- A browser available on this machine, or run `make serve` and QA from another device

Then execute in order:

```bash
cd /home/github-repos/cgartlab-design-system

# 1. Verify branches
git branch --show-current   # expect: fix/blog-onclick
git status --short          # expect: clean

# 2. Final validation
make validate-naming        # must exit 0
make validate-html           # must exit 0

# 3. Push
git push -u origin fix/blog-onclick

# 4. Browser QA
make serve                  # serves at http://localhost:8000/blog.html
# In browser:
# - Click "文章" nav -> home section active
# - Click "归档" nav -> archive section active
# - Click "关于" nav -> about section active
# - Click "阅读全文" -> article section active
# - Click any card -> article section active
# - Scroll after each click -> page scrolls to top
# - Rapidly click nav links twice -> no duplicate handlers, no console errors

# 5. Create PR
gh pr create --fill

# Expected PR title:
# fix: replace 22 inline onclick handlers with event delegation
```
