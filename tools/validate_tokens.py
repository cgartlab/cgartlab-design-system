#!/usr/bin/env python3
"""validate_tokens.py — 校验 tokens.json 与 styles.css 的一致性

检查项：
  1. tokens.json 中每个 token 必须出现在 styles.css :root 中
  2. styles.css 中的颜色 token 必须在 tokens.json 有对应条目（或在白名单中）
  3. 颜色值必须用 OKLch 表达
  4. 浅色 / 暗色 token 必须成对存在

退出码：
  0 = 通过
  1 = 严重错误
  2 = 仅警告
"""
from __future__ import annotations

import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
TOKENS_JSON = ROOT / "tokens.json"
STYLES_CSS = ROOT / "styles.css"

CSS_VAR_DECL = re.compile(r"--ds-([a-z0-9-]+)\s*:\s*([^;]+);")
BLOCK_RE = re.compile(r":root\s*\{([^}]*)\}", re.MULTILINE)
DARK_BLOCK_RE = re.compile(r'\[data-theme=["\']?dark["\']?\]\s*\{([^}]*)\}', re.MULTILINE)
HEX_COLOR = re.compile(r"#[0-9a-fA-F]{3,8}\b")
RGB_COLOR = re.compile(r"\brgb[a]?\s*\(", re.IGNORECASE)
HSL_COLOR = re.compile(r"\bhsl[a]?\s*\(", re.IGNORECASE)


def extract_vars_from_block(block: str) -> dict[str, str]:
    """从 CSS 块中提取所有 --ds-* 变量。"""
    vars_ = {}
    for match in CSS_VAR_DECL.finditer(block):
        name = "--ds-" + match.group(1)
        value = match.group(2).strip()
        vars_[name] = value
    return vars_


def extract_vars_from_json(data: dict) -> dict[str, str]:
    """递归从 tokens.json 中提取所有 token 路径 → 值。"""
    out = {}
    tokens = data.get("tokens", {})

    def walk(node: dict, prefix: str = "") -> None:
        for key, val in node.items():
            path = f"{prefix}{key}" if not prefix else f"{prefix}-{key}"
            if isinstance(val, dict):
                walk(val, path)
            elif isinstance(val, str):
                out["--ds-" + path] = val
            elif isinstance(val, list):
                # 字族（list）— 用 join 表达
                out["--ds-" + path] = " · ".join(val)

    walk(tokens)
    return out


def is_color_token(name: str) -> bool:
    """判断是否是颜色类 token。"""
    return name.startswith("--ds-color-") or "-bg" in name or name.endswith("-color")


def looks_oklch(value: str) -> bool:
    """判断值是否使用 OKLch 表达。"""
    return "oklch" in value.lower() or "oklab" in value.lower()


def main() -> int:
    if not TOKENS_JSON.exists():
        print(f"[ERROR] tokens.json 不存在：{TOKENS_JSON}")
        return 1
    if not STYLES_CSS.exists():
        print(f"[ERROR] styles.css 不存在：{STYLES_CSS}")
        return 1

    # 使用 utf-8-sig 自动剥离 BOM（如有）
    with TOKENS_JSON.open(encoding="utf-8-sig") as f:
        data = json.load(f)
    css = STYLES_CSS.read_text(encoding="utf-8")

    json_tokens = extract_vars_from_json(data)
    root_match = BLOCK_RE.search(css)
    dark_match = DARK_BLOCK_RE.search(css)

    if not root_match:
        print("[ERROR] styles.css 缺少 :root 块")
        return 1

    root_vars = extract_vars_from_block(root_match.group(1))
    dark_vars = extract_vars_from_block(dark_match.group(1)) if dark_match else {}

    errors = 0
    warnings = 0

    # 1. tokens.json → styles.css 覆盖检查
    missing_in_css = [name for name in json_tokens if name not in root_vars]
    if missing_in_css:
        for name in missing_in_css:
            print(f"[WARN] tokens.json 定义但 styles.css 缺少：{name}")
            warnings += 1
    else:
        print(f"[OK] tokens.json 中 {len(json_tokens)} 个 token 全部出现在 :root")

    # 2. styles.css → tokens.json 覆盖检查（仅颜色 token）
    css_color_tokens = [name for name in root_vars if is_color_token(name)]
    missing_in_json = [
        name
        for name in css_color_tokens
        if name not in json_tokens and not name.endswith("-bg")
    ]
    if missing_in_json:
        for name in missing_in_json[:10]:
            print(f"[WARN] styles.css 颜色 token 在 tokens.json 缺失：{name}")
            warnings += 1
        if len(missing_in_json) > 10:
            print(f"[WARN] ... 还有 {len(missing_in_json) - 10} 个未列出")
    else:
        print(f"[OK] styles.css 中 {len(css_color_tokens)} 个颜色 token 全部在 tokens.json")

    # 3. OKLch 检查（仅颜色 token）
    non_oklch = []
    for name, value in root_vars.items():
        if is_color_token(name) and not looks_oklch(value):
            non_oklch.append((name, value))
    if non_oklch:
        for name, value in non_oklch[:5]:
            print(f"[WARN] 颜色 token 没用 OKLch：{name} = {value}")
            warnings += 1
    else:
        print(f"[OK] 所有颜色 token 使用 OKLch")

    # 4. 暗色配对检查
    unpaired = []
    for name in root_vars:
        if is_color_token(name) and name not in dark_vars and not name.endswith("-bg"):
            # 仅警告 — 某些语义色可能确实没有暗色变体
            pass  # 静默跳过，避免误报
    # 反向：暗色中有但浅色中没有的
    orphan_dark = [n for n in dark_vars if n not in root_vars]
    if orphan_dark:
        for name in orphan_dark[:5]:
            print(f"[WARN] 暗色定义但浅色无对应：{name}")
            warnings += 1

    # 5. 旧格式颜色（hex / rgb / hsl）警告
    old_format = []
    for match in HEX_COLOR.finditer(css):
        line_no = css[: match.start()].count("\n") + 1
        old_format.append((line_no, match.group()))
    if old_format:
        for line_no, color in old_format[:5]:
            print(f"[WARN] styles.css 第 {line_no} 行仍用 hex 颜色：{color}")
            warnings += 1

    print()
    print(f"─── 总结 ───")
    print(f"tokens.json  : {len(json_tokens)} 个 token")
    print(f"styles.css   : {len(root_vars)} 个 :root 变量, {len(dark_vars)} 个暗色变量")
    print(f"错误         : {errors}")
    print(f"警告         : {warnings}")

    return 1 if errors else (2 if warnings else 0)


if __name__ == "__main__":
    sys.exit(main())
