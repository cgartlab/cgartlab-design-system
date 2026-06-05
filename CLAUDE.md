# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

**CGArtLab Design System** — Editorial × Olive Green, a zero-runtime-dependency static design system driven by OKLch color science and design tokens. Current version: **v1.3.1**.

- **Website:** https://designsystem.cgartlab.com
- **License:** CC BY 4.0
- **Tech:** Pure HTML + CSS (Custom Properties + OKLch) + Vanilla JS — no build tools, no framework

## Architecture

### Core Files (the "big three")

| File | Role |
|------|------|
| `styles.css` | All design tokens (`:root` + `[data-theme="dark"]`), 25+ components, animations, site shell |
| `scripts.js` | Icon rendering, token table rendering, theme toggle, scroll reveal, copy actions, tab panels |
| `tokens.json` | Structured JSON of all design tokens — source of truth for programmatic consumption |

### Key Design Decisions

1. **OKLch-only colors** — every color defined as `oklch(L C H)`. Never use hex/rgb/hsl in CSS.
2. **Token-first** — every visual value must use `var(--ds-*)`. No magic numbers (`#fff`, `16px`, etc.).
3. **BEM class naming** — `ds-component` / `ds-component--variant` / `ds-component-element`.
4. **Semantic versioning** adapted for design systems — see `docs/VERSIONING.md`.
5. **Stamp tool** — `tools/stamp_version.py` reads `VERSION` and replaces `{{DS_VERSION}}` placeholders across all HTML/MD files. Always run `make stamp-version` after bumping `VERSION`.
6. **`?v=` cache busting** — all HTML references to `styles.css` and `scripts.js` include `?v=VERSION`. `validate_versions.py` checks consistency.

### Token Naming Convention

```
--ds-{category}-{name}[-{modifier}]

Categories: color | font | text | weight | leading | tracking |
            space | radius | shadow | duration | ease | bp | z | blur | glass
```

### Dark Mode

Always define both `:root` and `[data-theme="dark"]` for every color token. Dark mode never uses pure black `oklch(0% 0 0)` — use warm grey `oklch(15% 0.008 75)`.

### Icon System

All icons are inline SVG in `scripts.js` `ICONS` array. ViewBox must be `0 0 24 24`, stroke-width `1.5`, `aria-hidden="true"`. New icons must be registered in `scripts.js` and rendered via the icon system.

### Branch Workflow

- `main` — stable releases, tagged `vX.Y.Z`
- `dev-xxx` — feature development
- `fix-xxx` — bug fixes
- `feat/icons-svg-sprite-generator` — pending: icon SVG sprite generator (4 commits ahead of main)

## Common Commands

```bash
# Start local dev server
make serve                    # http://localhost:8000

# Run all 6 validators
make validate
npm run validate

# Run a single validator
make validate-tokens          # tokens.json ↔ styles.css consistency
make validate-naming          # BEM / token naming + anti-patterns
make validate-html            # HTML structure + reference validity
make validate-a11y            # Accessibility (alt, heading hierarchy, contrast)
make validate-versions        # ?v= sync with VERSION file
make validate-links           # Internal anchors + resource references

# Sync VERSION to all HTML/MD files
make stamp-version

# Preview diff before stamping
python3 tools/stamp_version.py --diff

# Check if stamp is needed
python3 tools/stamp_version.py --check

# Generate example PDFs
make generate-pdfs

# Clean temp files
make clean

# Run CI validators locally
./scripts/dev.sh validate
```

## CI / GitHub Actions

- **`.github/workflows/ci.yml`** — runs all 6 validators on push/PR/schedule (weekly Monday UTC 0:00)
- Exit codes: 0 = OK, 1 = errors (fail), 2 = warnings-only (pass)
- **`.github/workflows/release.yml`** — tag-triggered: generates PDFs + creates GitHub Release

## Release Workflow

```bash
# 1. Bump VERSION
echo "1.4.0" > VERSION

# 2. Stamp all files
make stamp-version

# 3. Validate
make validate

# 4. Commit
git add -A && git commit -m "chore(release): bump to v1.4.0"

# 5. Tag & push
git tag v1.4.0 && git push origin v1.4.0
```

## Adding a New Component

1. **Open an Issue** first — describe component name, use cases, variants, states.
2. **Check existing tokens** — reuse before adding new ones. If new token needed, add to both `styles.css` (`:root` + `[data-theme="dark"]`) and `tokens.json`.
3. **Implement in `styles.css`** using BEM naming, OKLch colors, `var(--ds-*)` tokens.
4. **Add preview to `handbook.html`**.
5. **Update `scripts.js`** `TOKENS` array if new tokens added.
6. **Update `AGENTS.md`** component catalog.
7. **Update `CHANGELOG.md`** under `[未发布]`.
8. **Run `make validate`** — all must pass.
9. **Bump `?v=`** in all HTML files (use `make stamp-version`).

## Anti-Patterns (Never Do)

- ❌ Hard-code any color, size, or spacing value — always use `var(--ds-*)`
- ❌ Use hex/rgb/hsl — only OKLch
- ❌ Use pure black `oklch(0% 0 0)` in dark mode
- ❌ Inline `style=` except for genuinely dynamic values (stagger delays, etc.)
- ❌ Inline `onclick` — use `addEventListener`
- ❌ Introduce new hue families beyond olive + semantic colors
- ❌ Modify `company.html` or other example pages directly — they are production-grade demos
- ❌ Commit without bumping `?v=` after changing CSS/JS
- ❌ Skip `prefers-reduced-motion: reduce` handling

## Key Documentation

| File | Purpose |
|------|---------|
| `docs/VERSIONING.md` | SemVer strategy adapted for design systems, stamp tool usage |
| `docs/COMPONENT-DEVELOPMENT.md` | Full component development workflow |
| `docs/RELEASE-CHECKLIST.md` | Pre-release checklist |
| `docs/TESTING.md` | Testing strategy per validator |
| `DEVELOPMENT-GUIDE.md` | Deep technical reference (CSS architecture, token system, rendering) |
| `AGENTS.md` | Project knowledge base, component catalog, AI prompt/Skill references |
| `skills/cgartlab-design-system/SKILL.md` | Claude Code skill — strict design system compliance rules |

## Pending Work

- `feat/icons-svg-sprite-generator` branch has 4 commits (SVG sprite generator) not yet merged to main
- See `CHANGELOG.md` for `[未发布]` section with planned changes
