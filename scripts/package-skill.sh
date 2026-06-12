#!/usr/bin/env bash
# scripts/package-skill.sh — Package EDIC Design System Skill for distribution
#
# Creates assets/downloads/edic-design-system-skill.zip containing:
#   - SKILL.md          (agent skill instructions)
#   - README.md         (installation guide)
#   - tokens.json       (design tokens reference)
#
# Usage:
#   bash scripts/package-skill.sh
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"
SKILL_DIR="$ROOT_DIR/skills/edic-design-system"
DIST_DIR="$ROOT_DIR/assets/downloads"
PKG_NAME="edic-design-system-skill"
ZIP_PATH="$DIST_DIR/${PKG_NAME}.zip"

cd "$ROOT_DIR"

echo "Packaging EDIC Skill..."
mkdir -p "$DIST_DIR"
rm -f "$ZIP_PATH"

WORK_DIR=$(mktemp -d)
trap "rm -rf $WORK_DIR" EXIT

cp "$SKILL_DIR/SKILL.md"     "$WORK_DIR/"
cp "$SKILL_DIR/README.md"     "$WORK_DIR/"
cp "$ROOT_DIR/tokens.json"    "$WORK_DIR/"

python3 -c "
import zipfile, os, sys
wp = sys.argv[1]
with zipfile.ZipFile('$ZIP_PATH', 'w', zipfile.ZIP_DEFLATED) as zf:
    for f in os.listdir(wp):
        zf.write(os.path.join(wp, f), f)
print('created:', os.path.getsize('$ZIP_PATH'), 'bytes')
" "$WORK_DIR"

echo "✅ $ZIP_PATH created"
