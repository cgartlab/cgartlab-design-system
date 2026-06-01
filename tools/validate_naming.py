#!/usr/bin/env python3
"""validate_naming.py — 校验 BEM / token 命名规范与反模式

检查项：
  1. 组件 class 遵循 ds-{name} / ds-{name}--{variant} / ds-{name}-{element}
  2. CSS 变量遵循 --ds-{category}-{name}
  3. 类别前缀在白名单内
  4. 反模式：as any / @ts-expect-error / @ts-ignore / 空 catch
  5. JS 顶层禁用 `var`（推荐 const/let）
"""
from __future__ import annotations

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
HTML_GLOB = "*.html"
CSS_FILE = ROOT / "styles.css"
JS_FILE = ROOT / "scripts.js"

VALID_CATEGORIES = {
    "color", "font", "text", "weight", "leading", "tracking",
    "space", "radius", "shadow", "duration", "ease", "bp", "z",
    "blur", "glass", "accent", "opacity", "size",
}

BEM_CLASS = re.compile(r'\bclass="([^"]+)"')
BEM_TOKEN = re.compile(r"--ds-([a-z0-9-]+)")
CSS_VAR_DECL = re.compile(r"--ds-([a-z0-9-]+)\s*:")

ANTI_PATTERNS = [
    (re.compile(r"\bas\s+any\b"), "禁止 `as any`"),
    (re.compile(r"@ts-expect-error"), "禁止 `@ts-expect-error`"),
    (re.compile(r"@ts-ignore"), "禁止 `@ts-ignore`"),
    (re.compile(r"@ts-nocheck"), "禁止 `@ts-nocheck`"),
    (re.compile(r"catch\s*\([^)]*\)\s*\{\s*\}"), "禁止空 catch 块"),
]


def is_valid_bem_class(cls: str) -> tuple[bool, str]:
    """校验 BEM class 名。允许：ds-name / ds-name--variant / ds-name__elem / ds-name-elem。
    也允许普通工具类（不含 ds- 前缀的）。"""
    if not cls.startswith("ds-"):
        return True, ""  # 非 ds- 前缀不检查
    # 移除 ds- 前缀
    rest = cls[3:]
    # 校验：只能含字母数字下划线连字符
    if not re.match(r"^[a-z][a-z0-9_-]*$", rest):
        return False, f"非法字符或大写：{cls!r}"
    # 校验修饰符（--）和子元素（-）数量
    if rest.count("--") > 1:
        return False, f"修饰符超过 1 个：{cls!r}"
    return True, ""


def check_bem_in_html(html_files: list[Path]) -> list[str]:
    """扫描所有 HTML 文件中的 class。"""
    issues = []
    for path in html_files:
        text = path.read_text(encoding="utf-8", errors="replace")
        for match in BEM_CLASS.finditer(text):
            classes = match.group(1).split()
            for cls in classes:
                ok, reason = is_valid_bem_class(cls)
                if not ok:
                    line_no = text[: match.start()].count("\n") + 1
                    issues.append(f"{path.name}:{line_no} {reason}")
    return issues


def check_tokens_in_css() -> list[str]:
    """检查 CSS 变量命名规范。"""
    if not CSS_FILE.exists():
        return []
    text = CSS_FILE.read_text(encoding="utf-8", errors="replace")
    issues = []
    for match in CSS_VAR_DECL.finditer(text):
        name = match.group(1)
        # 类别 = 第一个段
        category = name.split("-")[0]
        if category not in VALID_CATEGORIES:
            line_no = text[: match.start()].count("\n") + 1
            issues.append(
                f"styles.css:{line_no} --ds-{name} 类别 '{category}' 不在白名单"
            )
    return issues


def check_anti_patterns(paths: list[Path]) -> list[str]:
    """扫描反模式。"""
    issues = []
    for path in paths:
        if not path.exists():
            continue
        text = path.read_text(encoding="utf-8", errors="replace")
        for pattern, msg in ANTI_PATTERNS:
            for match in pattern.finditer(text):
                line_no = text[: match.start()].count("\n") + 1
                issues.append(f"{path.name}:{line_no} {msg}")
    return issues


def check_var_in_js() -> list[str]:
    """检查 scripts.js 顶层禁用 var。"""
    if not JS_FILE.exists():
        return []
    text = JS_FILE.read_text(encoding="utf-8", errors="replace")
    issues = []
    # 仅检查顶层（非函数内、非注释）的 var 声明
    in_function = 0
    for i, line in enumerate(text.splitlines(), 1):
        stripped = line.strip()
        if not stripped or stripped.startswith("//") or stripped.startswith("/*"):
            continue
        in_function += line.count("{") - line.count("}")
        if in_function > 0:
            continue
        if re.match(r"^var\s+[a-zA-Z_$]", stripped):
            issues.append(f"scripts.js:{i} 顶层 `var` 声明（推荐 const/let）")
    return issues


def main() -> int:
    html_files = sorted(ROOT.glob(HTML_GLOB))
    if not html_files:
        print(f"[WARN] 未发现 HTML 文件（{HTML_GLOB}）")
        return 2

    errors: list[str] = []
    warnings: list[str] = []

    # BEM 命名
    bem_issues = check_bem_in_html(html_files)
    errors.extend(bem_issues)

    # Token 命名
    token_issues = check_tokens_in_css()
    errors.extend(token_issues)

    # 反模式
    anti_issues = check_anti_patterns([CSS_FILE, JS_FILE])
    errors.extend(anti_issues)

    # var 检查
    var_issues = check_var_in_js()
    warnings.extend(var_issues)

    print(f"─── 命名规范检查 ───")
    print(f"扫描 HTML  : {len(html_files)} 个")
    print(f"扫描 CSS   : {CSS_FILE.name}")
    print(f"扫描 JS    : {JS_FILE.name}")
    print()
    if errors:
        for issue in errors:
            print(f"[ERROR] {issue}")
    else:
        print("[OK] 命名规范与反模式全部通过")
    if warnings:
        for issue in warnings:
            print(f"[WARN] {issue}")
    print()
    print(f"错误: {len(errors)}  警告: {len(warnings)}")
    return 1 if errors else (2 if warnings else 0)


if __name__ == "__main__":
    sys.exit(main())
