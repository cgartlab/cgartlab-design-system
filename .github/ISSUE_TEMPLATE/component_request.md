---
name: 🧩 Component Request
description: 提议新增一个设计系统组件（先评审再实现）
title: "[component] "
labels: ["component", "needs-design-review"]
assignees: []
---

> ⚠️ **重要**：新增组件会影响设计语言与维护成本。请先在此模板中**完整填写提案**，
> 维护者评审通过后再开 PR 实现。直接开 PR 可能被拒。

## 组件名

`ds-{name}`（如 `ds-tooltip`）。

## 使用场景

在哪些页面 / 哪些交互会用到？解决什么设计问题？

## API 草案

HTML 结构示例：

```html
<div class="ds-component">
  <span class="ds-component-element">...</span>
</div>
```

## 变体清单

- [ ] variant 1（如 `--primary`）
- [ ] variant 2（如 `--ghost`）
- [ ] ....

## 状态清单

- [ ] default
- [ ] hover
- [ ] active
- [ ] focus
- [ ] disabled
- [ ] loading（如果适用）
- [ ] error（如果适用）

## 视觉参考

（截图 / 草图 / 类似系统链接）

## 暗色模式

需要特殊处理吗？预估色彩调整方式。

## 响应式

在 375 / 768 / 1440px 下的预期表现。

## 可访问性

- 键盘交互：Tab / Enter / Esc / 方向键 / 自定义键
- 屏幕阅读器：所需 ARIA 属性
- 触摸目标：≥ 44×44px

## 替代方案评估

是否可由现有组件扩展（如 Button + 状态机）？为什么不？

## 维护成本估计

- 新增 CSS 行数：约 ___ 行
- 新增 JS 行数：约 ___ 行
- 新增令牌：约 ___ 个
- 影响现有组件：无 / 轻 / 中 / 重

## 参考

（其他设计系统类似组件的链接：Radix / shadcn / Material / Ant Design 等）
