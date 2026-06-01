#!/usr/bin/env bash
# scripts/dev.sh — 本地开发辅助（Bash / macOS / Linux）
# 用法：./scripts/dev.sh <command>

set -e

PORT="${PORT:-8000}"

cmd="${1:-help}"

case "$cmd" in
  serve|server)
    echo "→ 启动 Python HTTP 服务器 (http://localhost:${PORT})"
    python3 -m http.server "${PORT}"
    ;;

  validate|check)
    echo "→ 运行全部验证"
    for tool in tools/validate_*.py; do
      echo ""
      echo "── $(basename "$tool") ──"
      python3 "$tool"
    done
    ;;

  validate-tokens)   python3 tools/validate_tokens.py ;;
  validate-naming)   python3 tools/validate_naming.py ;;
  validate-html)     python3 tools/validate_html.py ;;
  validate-a11y)     python3 tools/validate_a11y.py ;;
  validate-versions) python3 tools/validate_versions.py ;;
  validate-links)    python3 tools/validate_links.py ;;

  pdfs|generate-pdfs)
    echo "→ 生成示例 PDF"
    python3 tools/generate_pdfs.py
    ;;

  clean)
    echo "→ 清理"
    rm -rf test-reports/
    find . -type d -name '__pycache__' -exec rm -rf {} + 2>/dev/null || true
    find . -type f -name '*.pyc' -delete 2>/dev/null || true
    echo "✓ 完成"
    ;;

  help|*)
    cat <<EOF
CGArtLab Design System — dev 辅助脚本

用法：./scripts/dev.sh <command>

命令:
  serve              启动本地 HTTP 服务器
  validate           运行全部验证
  validate-tokens    校验 tokens.json
  validate-naming    校验命名
  validate-html      校验 HTML
  validate-a11y      校验可访问性
  validate-versions  校验版本号
  validate-links     校验链接
  pdfs               生成示例 PDF
  clean              清理临时文件
  help               显示此帮助

环境变量:
  PORT               HTTP 服务器端口（默认 8000）
EOF
    ;;
esac
