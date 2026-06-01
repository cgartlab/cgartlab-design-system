#!/usr/bin/env python3
"""validate_versions.py — 资源 ?v= 版本号同步校验

检查项：
  1. 所有 HTML 中 styles.css?v=... 与 scripts.js?v=... 一致
  2. ?v= 值与 CHANGELOG.md 最新稳定版本号一致
  3. ?v= 格式合法（X.Y.Z 或 X.Y.Z-{prerelease}）
  4. 同一资源在所有 HTML 中 ?v= 一致
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

VERSION_RE = re.compile(r"\?v=([0-9]+\.[0-9]+\.[0-9]+(?:-[a-zA-Z0-9.]+)?)")
SEMVER_RE = re.compile(r"^[0-9]+\.[0-9]+\.[0-9]+(?:-[a-zA-Z0-9.]+)?$")
CHANGELOG_VERSION_RE = re.compile(r"^##\s+\[([0-9]+\.[0-9]+\.[0-9]+[^\]]*)\]")


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
            if expected and version != expected:
                print(f"  [WARN] 与期望版本 {expected} 不一致")
                warnings += 1

    # 4. 漏掉 ?v= 的资源
    no_version = []
    for path in html_files:
        text = path.read_text(encoding="utf-8", errors="replace")
        for match in re.finditer(r'(?:href|src)="(styles\.css|scripts\.js)"', text):
            no_version.append((path.name, match.group(1)))
    if no_version:
        print(f"\n[WARN] 以下资源未使用 ?v= 版本号：")
        for file, resource in no_version:
            print(f"  {file}: {resource}")
        warnings += 1

    print()
    print(f"错误: {errors}  警告: {warnings}")
    return 1 if errors else 0


if __name__ == "__main__":
    sys.exit(main())
