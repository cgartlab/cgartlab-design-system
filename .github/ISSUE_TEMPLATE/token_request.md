---
name: 🎨 Token Request
description: 提议新增或修改设计令牌（颜色 / 字体 / 间距 / 圆角 / 阴影 / 动效）
title: "[token] "
labels: ["token", "needs-design-review"]
assignees: []
---

> 令牌是设计系统的基石。新增前请评估是否能复用现有令牌。

## Token 名称

`--ds-{category}-{name}[-{modifier}]`

（如 `--ds-color-blue-400`）

## Token 值

```css
/* 浅色 */
:root {
  --ds-xxx-xxx: oklch(...);
}

/* 暗色（必填） */
[data-theme="dark"] {
  --ds-xxx-xxx: oklch(...);
}
```

## 用途

哪些组件 / 场景会使用？解决什么问题？

## 与现有令牌的关系

- 复用现有：___（如不新增也可，考虑改用现有）
- 替代现有：___（如废弃哪个旧 token）
- 互补现有：___

## 可访问性验证

文字 / 背景组合的对比度（WCAG AA = 4.5:1 普通 / 3:1 大字）：

| 浅色背景 | 浅色 fg | 暗色背景 | 暗色 fg | 通过 |
|----------|---------|----------|---------|------|
|          |         |          |         | ☐    |

## 受影响文件

- [ ] `styles.css`（必须）
- [ ] `tokens.json`（必须）
- [ ] `scripts.js` 的 `TOKENS` 数组
- [ ] `handbook.html`（自动展示）
- [ ] `AGENTS.md`（如果新增类别）
- [ ] `CHANGELOG.md`

## 优先级

- [ ] P0（必须）
- [ ] P1（应该）
- [ ] P2（可以）
