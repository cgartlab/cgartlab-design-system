#!/usr/bin/env node
/**
 * scripts/run-validators.js — 跨平台验证运行器（Node 包装器）
 *
 * 原因：并非所有开发者都装了 Python。用 Node 包装各 Python 验证脚本，
 * 提供统一入口 `npm run validate`。
 *
 * 要求：CI 环境和 Linux/macOS 需 Python 3.11+。Windows 用户可用 WSL。
 */

const { spawnSync } = require("node:child_process");
const path = require("node:path");

const ROOT = path.resolve(__dirname, "..");
const PYTHON = process.env.PYTHON || (process.platform === "win32" ? "python" : "python3");

const VALIDATORS = [
  "validate_tokens.py",
  "validate_naming.py",
  "validate_html.py",
  "validate_a11y.py",
  "validate_versions.py",
  "validate_links.py",
];

function runOne(script) {
  const toolPath = path.join(ROOT, "tools", script);
  console.log(`\n── ${script} ──`);
  const result = spawnSync(PYTHON, [toolPath], {
    stdio: "inherit",
    cwd: ROOT,
  });
  return result.status === 0 ? "ok" : result.status === 2 ? "warn" : "fail";
}

function main() {
  console.log("CGArtLab Design System — 验证运行器");
  console.log("Python:", PYTHON, "\n");

  let hasFail = false;
  let hasWarn = false;
  for (const script of VALIDATORS) {
    const r = runOne(script);
    if (r === "fail") hasFail = true;
    if (r === "warn") hasWarn = true;
  }

  console.log("\n────────────────────");
  if (hasFail) {
    console.log("✗ 部分验证失败");
    process.exit(1);
  } else if (hasWarn) {
    console.log("⚠ 全部通过（有警告）");
    process.exit(2);
  } else {
    console.log("✓ 全部通过");
    process.exit(0);
  }
}

main();
