#!/usr/bin/env python3
"""validate_versions.py — 资源 ?v= 版本号同步校验

检查项：
  1. 所有 HTML 中 styles.css?v=... 与 scripts.js?v=... 一致
  2. ?v= 值与 CHANGELOG.md / VERSION 最新稳定版本号一致
  3. ?v= 格式合法（X.Y.Z 或 X.Y.Z-{prerelease}）
  4. 同一资源在所有 HTML 中 ?v= 一致
  5. 占位符 {{VERSION}} 已被 stamp（不应有遗留）
  6. HTML 用户可见版本（hero badge / footer v{{VERSION}}）已被 stamp
  7. README.md 顶部版本 badge 已被 stamp
  8. AGENTS.md 状态行版本号已被 stamp
"""
from __future__ import annotations

import re
import sys
from collections import defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
HTML_GLOB = "*.html"
CHANGELOG = ROOT / "CHANGELOG.md"
VERSION_FILE = ROOT / "VERSION"
README_FILE = ROOT / "README.md"
AGENTS_FILE = ROOT / "AGENTS.md"

VERSION_RE = re.compile(r"\?v=([0-9]+\.[0-9]+\.[0-9]+(?:-[a-zA-Z0-9.]+)?)")
SEMVER_RE = re.compile(r"^[0-9]+\.[0-9]+\.[0-9]+(?:-[a-zA-Z0-9.]+)?$")
CHANGELOG_VERSION_RE = re.compile(r"^##\s+\[([0-9]+\.[0-9]+\.[0-9]+[^\]]*)\]")
PLACEHOLDER_RE = re.compile(r"\{\{VERSION\}\}")


def get_expected_version() -> str | None:
    """从 VERSION 文件或 CHANGELOG.md 读取最新稳定版本。"""
    if VERSION_FILE.exists():
        return VERSION_FILE.read_text(encoding="utf-8").strip().splitlines()[0].strip()
    if CHANGELOG.exists():
        text = CHANGELOG.read_text(encoding="utf-8")
        for line in text.splitlines():
            m = CHANGELOG_VERSION_RE.match(line)
            if m:
                ver = m.group(1)
                if not ver.lower().startswith("unreleased"):
                    return ver
    return None


def check_html(path: Path) -> dict[str, str]:
    """返回 {资源名: ?v= 值}。"""
    text = path.read_text(encoding="utf-8", errors="replace")
    found: dict[str, str] = {}
    # 匹配 href="styles.css?v=1.2.0" 或 src="scripts.js?v=1.2.0"
    for match in re.finditer(r'(?:href|src)="([^"?]+\.(?:css|js))\?v=([^"]+)"', text):
        resource = match.group(1)
        version = match.group(2)
        found[resource] = version
    return found


def count_placeholders(path: Path) -> int:
    """统计文件中残留的 {{VERSION}} 占位符数量。"""
    if not path.exists():
        return 0
    text = path.read_text(encoding="utf-8", errors="replace")
    return len(PLACEHOLDER_RE.findall(text))


def main() -> int:
    html_files = sorted(ROOT.glob(HTML_GLOB))
    if not html_files:
        print(f"[WARN] 未发现 HTML 文件（{HTML_GLOB}）")
        return 2

    expected = get_expected_version()
    print(f"─── 版本号同步校验 ───")
    if expected:
        print(f"期望版本（来自 {'VERSION' if VERSION_FILE.exists() else 'CHANGELOG.md'}）: {expected}")
    else:
        print(f"[WARN] 未发现期望版本（VERSION 文件或 CHANGELOG.md 缺失）")
        return 1

    # 收集所有 HTML 的版本号
    by_resource: dict[str, dict[str, list[str]]] = defaultdict(lambda: defaultdict(list))
    # by_resource[resource][version] = [files]
    for path in html_files:
        versions = check_html(path)
        for resource, version in versions.items():
            by_resource[resource][version].append(path.name)

    errors = 0
    warnings = 0

    # 1. 同一资源版本不一致
    for resource, version_map in sorted(by_resource.items()):
        if len(version_map) > 1:
            print(f"\n[ERROR] 资源 {resource} 版本不一致：")
            for version, files in version_map.items():
                print(f"  v{version}: {', '.join(files)}")
            errors += 1
        else:
            version = list(version_map.keys())[0]
            files = version_map[version]
            print(f"[OK] {resource} v{version}（{len(files)} 个文件）")

            # 2. 格式检查
            if not SEMVER_RE.match(version):
                print(f"  [ERROR] 版本号格式非法：{version}")
                errors += 1

            # 3. 与期望版本对比
            if version != expected:
                print(f"  [ERROR] 与 VERSION {expected} 不一致（需 stamp）")
                errors += 1
            # 兼容旧：仍把一致情况下也提示一下
            elif version == expected:
                pass  # silent OK

    # 4. 漏掉 ?v= 的资源（仅 link/script 标签，不含 a 标签）
    no_version = []
    for path in html_files:
        text = path.read_text(encoding="utf-8", errors="replace")
        # 匹配 <link rel="stylesheet" href="styles.css"> 或 <script src="scripts.js">
        for match in re.finditer(r'<(?:link[^>]+href|script[^>]+src)="(styles\.css|scripts\.js)"', text):
            no_version.append((path.name, match.group(1)))
    if no_version:
        print(f"\n[WARN] 以下资源未使用 ?v= 版本号：")
        for file, resource in no_version:
            print(f"  {file}: {resource}")
        warnings += 1

    # 5. {{DS_VERSION}} 占位符不应残留
    placeholder_files = []
    for path in list(html_files) + [README_FILE, AGENTS_FILE]:
        n = count_placeholders(path)
        if n > 0:
            placeholder_files.append((path.name, n))
    if placeholder_files:
        print(f"\n[ERROR] 以下文件残留 {{{{DS_VERSION}}}} 占位符，需 stamp：")
        for name, n in placeholder_files:
            print(f"  {name}: {n} 处")
        errors += len(placeholder_files)

    print()
    print(f"错误: {errors}  警告: {warnings}")
    return 1 if errors else 0


if __name__ == "__main__":
    sys.exit(main())
