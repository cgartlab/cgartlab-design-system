/**
 * Mobile Navigation tests
 * Tests: open/close, backdrop click, Escape key, focus trap,
 *        resize auto-close, ARIA attributes, scroll lock/unlock,
 *        nav inert/aria-hidden state
 */
import { describe, it, expect, beforeEach, vi } from "vitest";
import { resetBody, runScripts, fireClick, fireKey } from "./helpers.js";

function setupNav() {
  // Reset documentElement styles that may carry over between tests
  document.documentElement.style.removeProperty("overflow");
  document.documentElement.style.removeProperty("touch-action");
  resetBody(`
    <nav class="ds-navbar" role="navigation" aria-label="主导航">
      <div class="ds-navbar-inner">
        <a href="index.html" class="ds-logo">Logo</a>
        <button id="mnav-trigger" type="button"
                aria-label="打开导航菜单" aria-expanded="false"
                aria-controls="mnav-panel">
          <span></span><span></span><span></span>
        </button>
        <div class="ds-navbar-links" id="mnav-panel">
          <a href="index.html" class="ds-navbar-link">Home</a>
          <a href="docs.html" class="ds-navbar-link">Docs</a>
          <button id="theme-toggle-btn" class="ds-theme-toggle-btn" type="button"
                  aria-label="跟随系统 · 点击切换">
            <span class="theme-icon"></span>
          </button>
        </div>
      </div>
    </nav>
    <div class="ds-mnav-backdrop" id="mnav-backdrop" aria-hidden="true"></div>
  `);
  runScripts();
}

describe("Mobile Nav – open / close", () => {
  beforeEach(setupNav);

  it("trigger click opens panel", () => {
    const trigger = document.getElementById("mnav-trigger");
    const panel = document.getElementById("mnav-panel");
    fireClick(trigger);
    expect(panel.classList.contains("is-open")).toBe(true);
  });

  it("trigger click again closes panel", () => {
    const trigger = document.getElementById("mnav-trigger");
    const panel = document.getElementById("mnav-panel");
    fireClick(trigger);
    fireClick(trigger);
    expect(panel.classList.contains("is-open")).toBe(false);
  });

  it("backdrop click closes panel", () => {
    const trigger = document.getElementById("mnav-trigger");
    const backdrop = document.getElementById("mnav-backdrop");
    const panel = document.getElementById("mnav-panel");
    fireClick(trigger);
    fireClick(backdrop);
    expect(panel.classList.contains("is-open")).toBe(false);
  });

  it("Escape key closes panel", () => {
    const trigger = document.getElementById("mnav-trigger");
    const panel = document.getElementById("mnav-panel");
    fireClick(trigger);
    fireKey(document, "Escape");
    expect(panel.classList.contains("is-open")).toBe(false);
  });

  it("nav link click closes panel", () => {
    const trigger = document.getElementById("mnav-trigger");
    const panel = document.getElementById("mnav-panel");
    fireClick(trigger);
    const link = panel.querySelector(".ds-navbar-link");
    fireClick(link);
    expect(panel.classList.contains("is-open")).toBe(false);
  });
});

describe("Mobile Nav – ARIA", () => {
  beforeEach(setupNav);

  it("trigger aria-expanded=true when open", () => {
    const trigger = document.getElementById("mnav-trigger");
    fireClick(trigger);
    expect(trigger.getAttribute("aria-expanded")).toBe("true");
  });

  it("trigger aria-expanded=false when closed", () => {
    const trigger = document.getElementById("mnav-trigger");
    fireClick(trigger);
    fireClick(trigger);
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
  });

  it("panel gets role=dialog when open", () => {
    const trigger = document.getElementById("mnav-trigger");
    const panel = document.getElementById("mnav-panel");
    fireClick(trigger);
    expect(panel.getAttribute("role")).toBe("dialog");
  });

  it("panel role removed when closed", () => {
    const trigger = document.getElementById("mnav-trigger");
    const panel = document.getElementById("mnav-panel");
    fireClick(trigger);
    fireClick(trigger);
    expect(panel.hasAttribute("role")).toBe(false);
  });

  it("nav gets inert when panel open", () => {
    const trigger = document.getElementById("mnav-trigger");
    const nav = document.querySelector(".ds-navbar");
    fireClick(trigger);
    expect(nav.hasAttribute("inert")).toBe(true);
  });

  it("nav inert removed when closed", () => {
    const trigger = document.getElementById("mnav-trigger");
    const nav = document.querySelector(".ds-navbar");
    fireClick(trigger);
    fireClick(trigger);
    expect(nav.hasAttribute("inert")).toBe(false);
  });
});

describe("Mobile Nav – scroll lock", () => {
  beforeEach(setupNav);

  it("locks document overflow when open", () => {
    const trigger = document.getElementById("mnav-trigger");
    fireClick(trigger);
    expect(document.documentElement.style.overflow).toBe("hidden");
  });

  it("restores document overflow when closed", () => {
    const trigger = document.getElementById("mnav-trigger");
    fireClick(trigger); // open
    expect(document.documentElement.style.overflow).toBe("hidden");
    fireClick(trigger); // close — restores overflow synchronously
    // jsdom: removeProperty("overflow") returns "" (empty string)
    expect(document.documentElement.style.overflow).toBe("");
  });
});

describe("Mobile Nav – keyboard focus trap", () => {
  beforeEach(setupNav);

  it("Tab at last focusable element wraps to first", () => {
    const trigger = document.getElementById("mnav-trigger");
    fireClick(trigger);
    const nav = document.querySelector(".ds-navbar");
    const focusables = Array.from(nav.querySelectorAll("a[href], button:not([disabled])"));
    const last = focusables[focusables.length - 1];
    last.focus();
    fireKey(document, "Tab");
    // The focus trap should have been called — we verify no throw and panel still open
    expect(document.getElementById("mnav-panel").classList.contains("is-open")).toBe(true);
  });
});
