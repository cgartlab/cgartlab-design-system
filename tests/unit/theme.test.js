/**
 * Theme Switcher tests
 */
import { describe, it, expect, beforeEach } from "vitest";
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

  it("applies system mode on init when no localStorage", () => {
    expect(document.documentElement.getAttribute("data-theme-mode")).toBe("system");
  });

  it("reads saved theme from localStorage on init", () => {
    localStorage.setItem("ds-theme-mode", "dark");
    resetBody(`<button id="theme-toggle-btn" class="ds-theme-toggle-btn" type="button"
                       aria-label=""><span class="theme-icon"></span></button>`);
    runScripts();
    expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
    expect(document.documentElement.getAttribute("data-theme-mode")).toBe("dark");
  });

  it("cycles: system → light → dark → system", () => {
    expect(document.documentElement.getAttribute("data-theme-mode")).toBe("system");
    window.cycleTheme();
    expect(document.documentElement.getAttribute("data-theme-mode")).toBe("light");
    window.cycleTheme();
    expect(document.documentElement.getAttribute("data-theme-mode")).toBe("dark");
    window.cycleTheme();
    expect(document.documentElement.getAttribute("data-theme-mode")).toBe("system");
  });

  it("persists theme to localStorage", () => {
    window.cycleTheme();
    expect(localStorage.getItem("ds-theme-mode")).toBe("light");
    window.cycleTheme();
    expect(localStorage.getItem("ds-theme-mode")).toBe("dark");
  });

  it("setTheme('dark') sets data-theme=dark", () => {
    window.setTheme("dark");
    expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
  });

  it("setTheme ignores unknown mode", () => {
    window.setTheme("system");
    window.setTheme("unicorn");
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
    window.setTheme("dark");
    expect(document.getElementById("theme-toggle-btn").getAttribute("aria-label")).toContain("暗色模式");
    window.setTheme("light");
    expect(document.getElementById("theme-toggle-btn").getAttribute("aria-label")).toContain("浅色模式");
    window.setTheme("system");
    expect(document.getElementById("theme-toggle-btn").getAttribute("aria-label")).toContain("跟随系统");
  });

  it("handles localStorage failure gracefully (no throw)", () => {
    const orig = localStorage.setItem;
    localStorage.setItem = () => { throw new Error("blocked"); };
    expect(() => window.setTheme("dark")).not.toThrow();
    localStorage.setItem = orig;
  });
});
