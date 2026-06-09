---
name: 🖼️ Icon Request
description: 提议新增 SVG 图标
title: "[icon] "
labels: ["icon"]
assignees: []
---

## 图标名

`kebab-case.svg`（如 `arrow-right.svg`）

## 用途

在哪些场景会用到？语义是什么？

## 视觉参考

（如有，附 Lucide / Feather / Heroicons 等类似系统的截图或链接）

## 设计稿

如果自行设计，请用 viewBox `0 0 24 24`，1.5px stroke，
Lucide 风格线性图标。

## 实现

新图标添加到 `scripts.js` 的 `ICONS` 数组：

```js
{ id: "icon-name", svg: '<svg viewBox="0 0 24 24">...</svg>' }
```

并在 `docs.html`（自动渲染）展示。

## 优先级

- [ ] P0（核心场景）
- [ ] P1（高频场景）
- [ ] P2（边缘场景）
