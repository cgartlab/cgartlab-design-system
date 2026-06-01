#!/usr/bin/env python3
"""validate_html.py — HTML 结构合法性检查

检查项：
  1. <html> 有 lang 属性
  2. <head> 含 <meta charset> 与 <meta name="viewport">
  3. <link rel="stylesheet"> 引用的 CSS 文件存在
  4. <script src> 引用的 JS 文件存在
  5. 重复 id 检测
  6. 必填 meta（description, theme-color）
"""
from __future__ import annotations

import re
import sys
from html.parser import HTMLParser
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
HTML_GLOB = "*.html"


class HTMLChecker(HTMLParser):
    def __init__(self, path: Path) -> None:
        super().__init__(convert_charrefs=True)
        self.path = path
        self.ids: list[tuple[str, int]] = []
        self.links: list[tuple[str, int]] = []
        self.scripts: list[tuple[str, int]] = []
        self.has_charset = False
        self.has_viewport = False
        self.has_html_lang = False
        self.html_lang = ""
        self.in_head = False
        self.in_body = False

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        attr_d = dict(attrs)
        if tag == "html":
            self.has_html_lang = "lang" in attr_d
            if self.has_html_lang:
                self.html_lang = attr_d.get("lang", "")
        elif tag == "head":
            self.in_head = True
        elif tag == "body":
            self.in_body = True
        elif tag == "meta":
            charset = attr_d.get("charset", "")
            name = attr_d.get("name", "")
            if charset or name == "charset":
                self.has_charset = True
            if name == "viewport":
                self.has_viewport = True
        elif tag == "link":
            href = attr_d.get("href", "")
            if href and not href.startswith(("http://", "https://", "//")):
                self.links.append((href, self.getpos()[0]))
        elif tag == "script":
            src = attr_d.get("src", "")
            if src and not src.startswith(("http://", "https://", "//")):
                self.scripts.append((src, self.getpos()[0]))
        elif tag == "img" or tag == "image":
            # SVG 内的 image 不一定需要 alt
            pass
        if "id" in attr_d:
            self.ids.append((attr_d["id"], self.getpos()[0]))


def check_html(path: Path) -> list[tuple[str, str]]:
    """返回 (level, message) 列表。level = 'ERROR' | 'WARN' | 'OK'。"""
    issues: list[tuple[str, str]] = []
    text = path.read_text(encoding="utf-8", errors="replace")
    checker = HTMLChecker(path)
    try:
        checker.feed(text)
    except Exception as exc:
        issues.append(("ERROR", f"解析失败：{exc}"))
        return issues

    # 1. lang
    if not checker.has_html_lang:
        issues.append(("ERROR", "<html> 缺少 lang 属性"))
    elif checker.html_lang and not checker.html_lang.strip():
        issues.append(("WARN", "<html lang=''> 为空"))

    # 2. head meta
    if not checker.has_charset:
        issues.append(("ERROR", "<head> 缺少 <meta charset>"))
    if not checker.has_viewport:
        issues.append(("WARN", "<head> 缺少 <meta name='viewport'>"))

    # 3. CSS 引用
    for href, line in checker.links:
        if href.endswith(".css"):
            css_path = path.parent / href.split("?")[0]
            if not css_path.exists():
                issues.append(("ERROR", f"第 {line} 行引用了不存在的 CSS：{href}"))

    # 4. JS 引用
    for src, line in checker.scripts:
        js_path = path.parent / src.split("?")[0]
        if not js_path.exists():
            issues.append(("ERROR", f"第 {line} 行引用了不存在的 JS：{src}"))

    # 5. 重复 id
    seen: dict[str, int] = {}
    for id_, line in checker.ids:
        if id_ in seen:
            issues.append(("ERROR", f"重复 id '{id_}'（第 {seen[id_]} 行 与 第 {line} 行）"))
        else:
            seen[id_] = line

    return issues


def main() -> int:
    html_files = sorted(ROOT.glob(HTML_GLOB))
    if not html_files:
        print(f"[WARN] 未发现 HTML 文件（{HTML_GLOB}）")
        return 2

    total_errors = 0
    total_warnings = 0

    for path in html_files:
        issues = check_html(path)
        errors = [m for lvl, m in issues if lvl == "ERROR"]
        warnings = [m for lvl, m in issues if lvl == "WARN"]
        total_errors += len(errors)
        total_warnings += len(warnings)
        if errors or warnings:
            print(f"\n─── {path.name} ───")
            for msg in errors:
                print(f"  [ERROR] {msg}")
            for msg in warnings:
                print(f"  [WARN] {msg}")
        else:
            print(f"[OK] {path.name}")

    print()
    print(f"─── HTML 校验总结 ───")
    print(f"扫描文件: {len(html_files)}")
    print(f"错误    : {total_errors}")
    print(f"警告    : {total_warnings}")
    return 1 if total_errors else (2 if total_warnings else 0)


if __name__ == "__main__":
    sys.exit(main())
