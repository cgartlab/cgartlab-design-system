#!/usr/bin/env node
/**
 * scripts/clean.js — 清理临时文件（Node 跨平台）
 */
const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.resolve(__dirname, "..");
const TARGETS = ["test-reports"];

function rmrf(p) {
  if (!fs.existsSync(p)) return;
  const stat = fs.statSync(p);
  if (stat.isDirectory()) {
    fs.rmSync(p, { recursive: true, force: true });
  } else {
    fs.unlinkSync(p);
  }
  console.log("  removed", path.relative(ROOT, p));
}

function walk(dir) {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "__pycache__") {
        rmrf(full);
      } else {
        walk(full);
      }
    } else if (entry.name.endsWith(".pyc")) {
      rmrf(full);
    }
  }
}

console.log("→ 清理临时文件");
for (const t of TARGETS) {
  rmrf(path.join(ROOT, t));
}
walk(ROOT);
console.log("✓ 完成");
