# scripts/dev.ps1 — 本地开发辅助（PowerShell / Windows）
# 用法：.\scripts\dev.ps1 <command>

[CmdletBinding()]
param(
    [string]$Command = "help",
    [int]$Port = 8000
)

$ErrorActionPreference = "Stop"
$ScriptDir = Split-Path -Parent $PSCommandPath
$Root = Split-Path -Parent $ScriptDir

Set-Location $Root

function Run-Validate($tool) {
    Write-Host ""
    Write-Host "── $tool ──" -ForegroundColor Cyan
    & python "$Root/tools/$tool"
}

switch ($Command) {
    { @("serve", "server") -contains $_ } {
        Write-Host "→ 启动 Python HTTP 服务器 (http://localhost:$Port)" -ForegroundColor Green
        Write-Host "按 Ctrl+C 停止" -ForegroundColor Yellow
        & python -m http.server $Port
    }

    { @("validate", "check") -contains $_ } {
        Write-Host "→ 运行全部验证" -ForegroundColor Green
        Run-Validate "validate_tokens.py"
        Run-Validate "validate_naming.py"
        Run-Validate "validate_html.py"
        Run-Validate "validate_a11y.py"
        Run-Validate "validate_versions.py"
        Run-Validate "validate_links.py"
        Write-Host ""
        Write-Host "✓ 全部验证完成" -ForegroundColor Green
    }

    "validate-tokens"   { & python "$Root/tools/validate_tokens.py" }
    "validate-naming"   { & python "$Root/tools/validate_naming.py" }
    "validate-html"     { & python "$Root/tools/validate_html.py" }
    "validate-a11y"     { & python "$Root/tools/validate_a11y.py" }
    "validate-versions" { & python "$Root/tools/validate_versions.py" }
    "validate-links"    { & python "$Root/tools/validate_links.py" }

    { @("pdfs", "generate-pdfs") -contains $_ } {
        Write-Host "→ 生成示例 PDF" -ForegroundColor Green
        & python "$Root/tools/generate_pdfs.py"
    }

    "clean" {
        Write-Host "→ 清理" -ForegroundColor Green
        if (Test-Path "$Root/test-reports") { Remove-Item -Recurse -Force "$Root/test-reports" }
        Get-ChildItem -Path $Root -Recurse -Directory -Filter "__pycache__" -ErrorAction SilentlyContinue | Remove-Item -Recurse -Force
        Get-ChildItem -Path $Root -Recurse -File -Filter "*.pyc" -ErrorAction SilentlyContinue | Remove-Item -Force
        Write-Host "✓ 完成" -ForegroundColor Green
    }

    "help" {
        @"
CGArtLab Design System — dev 辅助脚本

用法：.\scripts\dev.ps1 -Command <command> [-Port 8000]

命令:
  serve              启动本地 HTTP 服务器
  validate           运行全部验证
  validate-tokens    校验 tokens.json
  validate-naming    校验命名
  validate-html      校验 HTML
  validate-a11y      校验可访问性
  validate-versions  校验版本号
  validate-links     校验链接
  stamp              将 VERSION 同步到所有 HTML / MD 资源
  stamp-check        检查 stamp 状态（CI 用）
  pdfs               生成示例 PDF
  clean              清理临时文件
  help               显示此帮助
"@
    }

    default {
        Write-Host "未知命令: $Command" -ForegroundColor Red
        Write-Host "运行 '.\scripts\dev.ps1 help' 查看可用命令"
        exit 1
    }
}
