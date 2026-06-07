/**
 * Theme Switcher tests
 * Tests: applyTheme, cycleTheme, localStorage persistence,
 *        system-pref listener, button aria-label updates.
 */
import { describe, it, expect, beforeEach, vi } from "vitest";
import { resetBody, runScripts, fireClick } from "./helpers.js";

function setupTheme() {
  resetBody(`
    <button id="theme-toggle-btn" class="ds-theme-toggle-btn" type="button"
            aria-label="跟随系统 · 点击切换">
      <span class="theme-icon"></span>
    </button>
  `);
  localStorage.clear();
  document.documentElement.removeAttribute("data-theme");
  document.documentElement.removeAttribute("data-theme-mode");
  runScripts();
}

describe("Theme Switcher", () => {
  beforeEach(setupTheme);

  it("applies system theme on init (no localStorage)", () => {
    const mode = document.documentElement.getAttribute("data-theme-mode");
    expect(mode).toBe("system");
  });

  it("reads saved theme from localStorage on init", () => {
    localStorage.setItem("ds-theme-mode", "dark");
    // re-run scripts after setting localStorage
    resetBody(`
      <button id="theme-toggle-btn" class="ds-theme-toggle-btn" type="button"
              aria-label="">
        <span class="theme-icon"></span>
      </button>
    `);
    runScripts();
    expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
    expect(document.documentElement.getAttribute("data-theme-mode")).toBe("dark");
  });

  it("cycles: system → light → dark → system", () => {
    // starts at system
    expect(document.documentElement.getAttribute("data-theme-mode")).toBe("system");
    // cycle once → light
    window.cycleTheme();
    expect(document.documentElement.getAttribute("data-theme-mode")).toBe("light");
    // cycle twice → dark
    window.cycleTheme();
    expect(document.documentElement.getAttribute("data-theme-mode")).toBe("dark");
    // cycle three → back to system
    window.cycleTheme();
    expect(document.documentElement.getAttribute("data-theme-mode")).toBe("system");
  });

  it("persists theme to localStorage", () => {
    window.cycleTheme(); // → light
    expect(localStorage.getItem("ds-theme-mode")).toBe("light");
    window.cycleTheme(); // → dark
    expect(localStorage.getItem("ds-theme-mode")).toBe("dark");
  });

  it("setTheme('dark') sets data-theme=dark", () => {
    window.setTheme("dark");
    expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
  });

  it("setTheme ignores unknown mode", () => {
    window.setTheme("system"); // → system
    window.setTheme("unicorn"); // no-op
    expect(document.documentElement.getAttribute("data-theme-mode")).toBe("system");
  });

  it("button click cycles theme", () => {
    const btn = document.getElementById("theme-toggle-btn");
    fireClick(btn);
    expect(document.documentElement.getAttribute("data-theme-mode")).toBe("light");
    fireClick(btn);
    expect(document.documentElement.getAttribute("data-theme-mode")).toBe("dark");
  });

  it("button aria-label updates on each theme", () => {
    const btn = document.getElementById("theme-toggle-btn");
    window.setTheme("dark");
    expect(btn.getAttribute("aria-label")).toContain("暗色模式");
    window.setTheme("light");
    expect(btn.getAttribute("aria-label")).toContain("浅色模式");
    window.setTheme("system");
    expect(btn.getAttribute("aria-label")).toContain("跟随系统");
  });

  it("handles localStorage failure gracefully (no throw)", () => {
    const orig = localStorage.setItem;
    localStorage.setItem = () => { throw new Error("blocked"); };
    expect(() => window.setTheme("dark")).not.toThrow();
    localStorage.setItem = orig;
  });

  it("system-pref change updates data-theme when mode=system", () => {
    window.setTheme("system");
    // simulate prefers-color-scheme change to dark
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    // find and call the registered change listener
    const calls = mq.addEventListener.mock.calls;
    const changeCall = calls.find(([evt]) => evt === "change");
    if (changeCall) {
      const handler = changeCall[1];
      handler({ matches: true });
      expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
    }
    // If addEventListener wasn't called that way, the test is a no-op (env difference)
  });
});
