#!/usr/bin/env bash
# scripts/pre-commit.sh — 提交前自检（可选 git hook）
# 安装：ln -s ../../scripts/pre-commit.sh .git/hooks/pre-commit
# 作用：提交前自动运行验证工具，避免 CI 失败

set -e

REPO_ROOT="$(git rev-parse --show-toplevel)"
cd "$REPO_ROOT"

echo "→ 提交前自检..."

# 仅校验本次改动的相关工具
CHANGED_HTML=$(git diff --cached --name-only -- '*.html' 2>/dev/null || true)
CHANGED_CSS=$(git diff --cached --name-only -- '*.css' 2>/dev/null || true)
CHANGED_JS=$(git diff --cached --name-only -- '*.js' 2>/dev/null || true)
CHANGED_TOKENS=$(git diff --cached --name-only -- 'tokens.json' 2>/dev/null || true)

if [ -n "$CHANGED_HTML" ] || [ -n "$CHANGED_CSS" ] || [ -n "$CHANGED_JS" ] || [ -n "$CHANGED_TOKENS" ]; then
  echo "  → HTML/CSS/JS/tokens 改动，校验命名..."
  python3 tools/validate_naming.py || { echo "✗ 命名校验失败，请修复后再提交"; exit 1; }
fi

if [ -n "$CHANGED_HTML" ]; then
  echo "  → HTML 改动，校验结构..."
  python3 tools/validate_html.py || { echo "✗ HTML 校验失败"; exit 1; }
fi

if [ -n "$CHANGED_HTML" ]; then
  echo "  → HTML 改动，校验可访问性..."
  python3 tools/validate_a11y.py || { echo "✗ 可访问性校验失败"; exit 1; }
fi

if [ -n "$CHANGED_HTML" ] || [ -n "$CHANGED_CSS" ] || [ -n "$CHANGED_JS" ]; then
  echo "  → 资源改动，自动 stamp VERSION ..."
  python3 tools/stamp_version.py || { echo "✗ stamp 失败，请修复后再提交"; exit 1; }

  echo "  → 资源改动，校验版本号同步..."
  python3 tools/validate_versions.py || { echo "✗ 版本号校验失败"; exit 1; }
fi

if [ -n "$CHANGED_HTML" ]; then
  echo "  → HTML 改动，校验链接..."
  python3 tools/validate_links.py || { echo "✗ 链接校验失败"; exit 1; }
fi

if [ -n "$CHANGED_CSS" ] || [ -n "$CHANGED_TOKENS" ]; then
  echo "  → CSS/tokens 改动，校验 token 一致性..."
  python3 tools/validate_tokens.py || { echo "✗ token 校验失败"; exit 1; }
fi

echo "✓ 提交前自检通过"
