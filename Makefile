# Makefile — CGArtLab Design System
# 跨平台任务编排（GNU Make）
# 用法：make <target>

SHELL := /bin/sh
.DEFAULT_GOAL := help
.PHONY: help validate validate-tokens validate-naming validate-html validate-a11y validate-versions validate-links stamp-version serve clean serve-py serve-node generate-pdfs test

PYTHON ?= python3
NODE ?= node
PORT ?= 8000

help:  ## 显示帮助
	@echo "CGArtLab Design System — Makefile"
	@echo ""
	@echo "用法：make <target>"
	@echo ""
	@echo "Targets:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | \
	  awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-20s\033[0m %s\n", $$1, $$2}'

# ─── 验证 ──────────────────────────────────────────────────
validate: validate-tokens validate-naming validate-html validate-a11y validate-versions validate-links  ## 全部验证
	@echo ""
	@echo "✓ 全部验证通过"

validate-tokens:  ## 校验 tokens.json ↔ styles.css 一致性
	$(PYTHON) tools/validate_tokens.py

validate-naming:  ## 校验 BEM / token 命名规范
	$(PYTHON) tools/validate_naming.py

validate-html:  ## 校验 HTML 结构
	$(PYTHON) tools/validate_html.py

validate-a11y:  ## 校验可访问性
	$(PYTHON) tools/validate_a11y.py

validate-versions:  ## 校验资源 ?v= 版本号同步
	$(PYTHON) tools/validate_versions.py

validate-links:  ## 校验链接与引用
	$(PYTHON) tools/validate_links.py

stamp-version:  ## 将 VERSION 同步到所有 HTML / MD 资源
	$(PYTHON) tools/stamp_version.py

# ─── 本地预览 ──────────────────────────────────────────────
serve: serve-py  ## 本地启动 HTTP 服务器（默认 8000）

serve-py:  ## Python http.server
	@echo "启动 Python HTTP 服务器 (http://localhost:$(PORT))"
	@echo "按 Ctrl+C 停止"
	$(PYTHON) -m http.server $(PORT)

serve-node:  ## npx serve（备选）
	@echo "启动 Node serve (http://localhost:$(PORT))"
	npx serve -l $(PORT) .

# ─── 资源生成 ──────────────────────────────────────────────
generate-pdfs:  ## 重新生成示例 PDF
	$(PYTHON) tools/generate_pdfs.py

# ─── 测试 ──────────────────────────────────────────────────
test: validate  ## 运行所有测试（当前等价于 validate）
	@echo "✓ 测试完成"

# ─── 清理 ──────────────────────────────────────────────────
clean:  ## 清理临时文件
	rm -rf test-reports/
	rm -rf __pycache__/
	find . -type d -name '__pycache__' -exec rm -rf {} + 2>/dev/null || true
	find . -type f -name '*.pyc' -delete 2>/dev/null || true
	@echo "✓ 已清理"
