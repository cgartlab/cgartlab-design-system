---
name: edic-design-system
description: >-
  Generate UI components, full pages, documents, emails, and assets that
  strictly follow the EDIC design system (Editorial × Olive Green, OKLch
  tokens, dark-mode ready, CJK-optimized). Use this skill whenever the user asks
  to build, style, or refactor anything for EDIC, or explicitly requests the
  EDIC / "editorial olive" design system. Output token-driven, accessible,
  framework-agnostic HTML/CSS.
license: For use with the EDIC design system.
---

# EDIC Design System Skill

When this skill is active, every visual artifact you produce — components, pages,
landing sections, documentation, emails, reports — must conform to the EDIC
design system. **Prefer design tokens (CSS custom properties). Never hard-code
magic numbers.**

## Design character
- **Editorial × Olive Green**: magazine-grade restraint, generous whitespace,
  serif headings + sans body, a warm paper background, and a confident — never
  loud — olive-green accent.
- Reference moods: Monocle (typographic restraint), Stripe (warm utility),
  Mercury (refined calm).

## Hard rules (anti-patterns)
- Define all colors in **OKLch**; mix with `color-mix(in oklch, …)`.
- Use `var(--ds-*)` tokens for every visual value. No hard-coded `#fff` / `16px`.
- Dark mode never uses pure black `#000` — use warm grey `oklch(15% 0.008 75)`.
- In dark mode, lighten the accent ~5–10% vs. light mode.
- Components use base + modifier: `ds-btn` / `ds-btn--primary`.
- No inline `style=` except genuinely dynamic values (e.g. stagger `--d`).
- Icon-only buttons need `aria-label`; decorative SVGs need `aria-hidden="true"`.

## Color tokens (core)
Light (`:root`):
```
--ds-color-bg: oklch(97% 0.012 80)          /* warm paper background */
--ds-color-surface: oklch(99% 0.005 80)
--ds-color-surface-raised: oklch(100% 0 0)  /* popovers / modals */
--ds-color-border: oklch(89% 0.012 80)
--ds-color-muted: oklch(48% 0.015 60)       /* secondary text */
--ds-color-fg: oklch(20% 0.02 60)           /* body text */
--ds-color-fg-strong: oklch(14% 0.025 60)   /* headings */
```
Olive ramp `--ds-color-olive-50…900`; accent:
```
--ds-color-olive-400: oklch(52% 0.08 115)   /* === --ds-accent === */
--ds-accent-hover: var(--ds-color-olive-500)
--ds-accent-soft:  var(--ds-color-olive-100)
```
Semantic (each has a `-bg` tint): success `oklch(55% 0.1 145)`,
warning `oklch(65% 0.1 85)`, error `oklch(50% 0.14 30)`, info `oklch(55% 0.08 240)`.
Dark (`[data-theme="dark"]`): base `oklch(15% 0.008 75)`, body `oklch(84% 0.008 72)`,
accent `oklch(57% 0.065 115)`.

## Typography
```
--ds-font-display: "Iowan Old Style","Charter",Georgia,"Noto Serif SC",serif
--ds-font-body / --ds-font-ui: "Noto Sans SC",-apple-system,system-ui,sans-serif
--ds-font-mono: "JetBrains Mono","IBM Plex Mono",monospace
```
Scale (rem): caption .75 · body-sm .875 · body 1 · body-lg 1.125 · lead 1.25 ·
h4 1.5 · h3 1.875 · h2 2.25 · h1 3 · display 3.75 · hero 4.5.
- Headings: display family + `--ds-leading-tight` (1.1) + `--ds-tracking-tight` (-0.01em).
- Body: line-height 1.55, measure 65–75 chars (~540px / 72ch).
- CJK/Latin mix: body tracking 0.03em, heading 0.06em; full-width CJK punctuation.

## Spacing / radius / shadow / motion
- Spacing: 4px base, `--ds-space-1..32` (4→128px).
- Radius: sm 2 · md 4 · lg 8 · xl 12 · 2xl 16 · full. Core 8–16px.
- Shadow: `--ds-shadow-xs..2xl`.
- Motion: duration `--ds-duration-150..500`; ease `--ds-ease-out: cubic-bezier(.16,1,.3,1)`,
  `--ds-ease-spring`. Always honor `prefers-reduced-motion: reduce`.

## Component class catalog
- **Layout**: `ds-wrapper` `ds-section` `ds-stack` (+ `--sm/--lg`) `ds-cluster` `ds-grid-2/3` `ds-feature-grid` `ds-prose`
- **Buttons**: `ds-btn` + `--primary/--secondary/--ghost` + `--sm/--lg`
- **Cards**: `ds-card` + `--hoverable/--flat`; glass `ds-glass-card`
- **Forms**: `ds-input` (`--error`) `ds-label` `ds-select` `ds-checkbox` `ds-radio` `ds-toggle` `ds-form-*`
- **Feedback**: `ds-badge` (`--accent/--success/--warning/--error`) `ds-alert` (`--info/--success/--warning/--error`) `ds-toast`
- **Navigation**: `ds-navbar` `ds-tabs/ds-tab` `ds-breadcrumb` `ds-pagination` `ds-nav-item`
- **Data**: `ds-table` `ds-progress` `ds-avatar` `ds-chip`
- **Overlay**: `ds-modal` `ds-tooltip-demo` `ds-dropdown`
- **Type**: `ds-display` `ds-h1..h4` `ds-caption` `ds-eyebrow` `ds-lead` `ds-serif` `ds-mono`
- **Motion**: `ds-reveal` (+ `--left/--right/--scale`, stagger via inline `--d`), `ds-anim-float/spin-slow/pulse/fade-in/rise/glow-breathe`

### Extended Navigation
- `ds-pagenav` (`--rail`, `--hidden`), `ds-pagenav-disclosure`, `ds-pagenav-summary`, `ds-pagenav-chevron`, `ds-pagenav-list`, `ds-pagenav-link` (`--active`), `ds-pagenav-num`, `ds-pagenav-text`
- `ds-mnav-trigger` (+ `ds-mnav-trigger-bar` `ds-mnav-backdrop`)
- `ds-theme-toggle-btn` (`--fixed`)

### Accordion
- `ds-accordion`, `ds-accordion-item`, `ds-accordion-header`, `ds-accordion-arrow`, `ds-accordion-content`

### Date / Calendar
- `ds-date-group`, `ds-date-wrap`, `ds-date-input`, `ds-date-icon`, `ds-date-calendar`
- `ds-cal-header`, `ds-cal-nav`, `ds-cal-month-year`, `ds-cal-month`, `ds-cal-year`
- `ds-cal-weekdays`, `ds-cal-grid-new`, `ds-cal-day`, `ds-cal-today`, `ds-cal-selected`, `ds-cal-muted`
- `ds-cal-footer`, `ds-cal-btn` (`--primary`)

### Slider
- `ds-slider-group`, `ds-slider-label-row`, `ds-slider-value`, `ds-slider-track-wrap`, `ds-slider-track`, `ds-slider-fill`, `ds-slider`, `ds-slider-labels`

### Glass & Overlay
- `ds-overlay-sample`, `ds-overlay-bg`, `ds-overlay-layer`, `ds-overlay-strong`, `ds-overlay-light`, `ds-overlay-label`
- `ds-glass-card` (`--sm`, `--lg`), `ds-glass-meta`, `ds-glass-btn` (+ `ds-glass-btn-row`)
- `ds-frosted-nav`
- `ds-toast-group`, `ds-toast-icon`, `ds-toast-text`, `ds-toast-close`

### Gravitas & Glow (dark-mode accent, 0% opacity in light)
- `ds-glow-border`, `ds-aura`, `ds-surface-glow`, `ds-heading-glow`
- `ds-anim-glow-breathe` (4s keyframe)

### CJK Typography
- `ds-text-cjk`, `ds-text-cjk-heading`, `ds-text-mixed`
- `ds-text-indent`, `ds-hanging-punctuation`, `ds-text-emphasis`, `ds-text-highlight`
- `ds-quote-cjk`, `ds-no-orphan`, `ds-num-unit`

### Article TOC
- `ds-toc-article`, `ds-toc-article-title`, `ds-toc-list`
- `ds-toc-link` (`--active`, `--h3`), `ds-toc-indicator`, `ds-toc-badge`

### Timeline
- `ds-timeline`, `ds-timeline-item`, `ds-timeline-dot`, `ds-timeline-content`
- `ds-timeline-date`, `ds-timeline-title`, `ds-timeline-tag`

### Code Block (Prism)
- `ds-code`, `ds-code-bar`, `ds-code-lang`, `ds-copy-btn` (`--light`)

### Brand / Logo
- `ds-logo`, `ds-logo-mark`, `ds-logo-text`, `ds-logo-word`, `ds-logo-sub`, `ds-logo-hero`

### Site Shell
- `ds-hero-section`, `ds-hero-inner`, `ds-hero-badge`, `ds-hero-title`, `ds-hero-lead`, `ds-hero-actions`, `ds-hero-meta`, `ds-gradient-text`
- `ds-stat-grid`, `ds-stat`, `ds-stat-num`, `ds-stat-label`
- `ds-steps`, `ds-step`, `ds-step-num`, `ds-step-body`
- `ds-compat-grid`, `ds-compat-item`
- `ds-docs` `ds-doc-block`
- `ds-dl-grid`, `ds-dl-card`, `ds-dl-top`, `ds-dl-ico`, `ds-dl-meta`, `ds-dl-actions`
- `ds-footer-rich`, `ds-footer-cols`, `ds-footer-brand`, `ds-footer-col`, `ds-footer-links`, `ds-footer-bottom`
- `ds-edge-decor` (`--tl/--tr/--bl/--br`), `ds-bg-blob` (`--1/--2/--3`)
- `ds-skip` (#ds-main for a11y skip link)

## Output expectations
- Produce complete, runnable HTML fragments assuming `styles.css` (and optional
  `scripts.js`) are linked.
- If the host has no stylesheet, include a minimal `<style>` but still use OKLch
  and equivalent token values.
- Use semantic structure (`header/main/section/nav/footer`) with correct heading order.
- Default to light theme and guarantee the same markup works under `[data-theme="dark"]`.
- When unsure, favor the more restrained, more whitespace, more editorial option.

## Example: token-driven card
```html
<article class="ds-card ds-card--hoverable">
  <span class="ds-badge ds-badge--accent">新</span>
  <h4 class="ds-serif ds-mt-3">橄榄园笔记</h4>
  <p class="ds-text-muted">使用令牌的卡片，悬停浮起，深浅主题自适配。</p>
  <a class="ds-btn ds-btn--primary ds-mt-4" href="#">阅读全文</a>
</article>
```

## Reference
- Full handbook & live tokens: https://edic.cgartlab.com/handbook.html
- Usage docs: https://edic.cgartlab.com/docs.html
- Structured tokens: `tokens.json`
