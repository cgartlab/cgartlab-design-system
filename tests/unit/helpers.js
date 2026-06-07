/**
 * Shared test helpers
 */

export function resetBody(html = "") {
  document.body.innerHTML = html;
}

export function fire(el, type, init = {}) {
  el.dispatchEvent(new Event(type, { bubbles: true, cancelable: true, ...init }));
}

export function fireKey(el, key, extra = {}) {
  el.dispatchEvent(
    new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true, ...extra })
  );
}

export function fireClick(el) {
  el.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));
}

/** Load and evaluate scripts.js in the current jsdom context */
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dir      = dirname(__filename);
const SCRIPTS_PATH = resolve(__dir, "../../scripts.js");

let _scriptsSource = null;
export function getScriptsSource() {
  if (!_scriptsSource) _scriptsSource = readFileSync(SCRIPTS_PATH, "utf8");
  return _scriptsSource;
}

/** Invalidate the cached source (call after patching scripts.js in a test) */
export function invalidateScriptsCache() { _scriptsSource = null; }

/**
 * Execute scripts.js against the *current* document/window.
 * Call this AFTER setting up document.body HTML.
 */
export function runScripts() {
  // eslint-disable-next-line no-new-func
  const fn = new Function(
    "window", "document", "navigator", "localStorage",
    getScriptsSource()
  );
  fn(window, document, navigator, localStorage);
}
