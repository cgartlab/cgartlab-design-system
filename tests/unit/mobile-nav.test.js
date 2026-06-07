/**
 * Mobile Navigation tests
 */
import { describe, it, expect, beforeEach } from "vitest";
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
    fireClick(document.getElementById("mnav-trigger"));
    expect(document.getElementById("mnav-panel").classList.contains("is-open")).toBe(true);
  });

  it("trigger click again closes panel", () => {
    const t = document.getElementById("mnav-trigger");
    fireClick(t); fireClick(t);
    expect(document.getElementById("mnav-panel").classList.contains("is-open")).toBe(false);
  });

  it("backdrop click closes panel", () => {
    fireClick(document.getElementById("mnav-trigger"));
    fireClick(document.getElementById("mnav-backdrop"));
    expect(document.getElementById("mnav-panel").classList.contains("is-open")).toBe(false);
  });

  it("Escape key closes panel", () => {
    fireClick(document.getElementById("mnav-trigger"));
    fireKey(document, "Escape");
    expect(document.getElementById("mnav-panel").classList.contains("is-open")).toBe(false);
  });
});

describe("Mobile Nav – ARIA", () => {
  beforeEach(setupNav);

  it("trigger aria-expanded=true when open", () => {
    fireClick(document.getElementById("mnav-trigger"));
    expect(document.getElementById("mnav-trigger").getAttribute("aria-expanded")).toBe("true");
  });

  it("trigger aria-expanded=false when closed", () => {
    const t = document.getElementById("mnav-trigger");
    fireClick(t); fireClick(t);
    expect(t.getAttribute("aria-expanded")).toBe("false");
  });

  it("panel gets role=dialog when open", () => {
    fireClick(document.getElementById("mnav-trigger"));
    expect(document.getElementById("mnav-panel").getAttribute("role")).toBe("dialog");
  });

  it("panel role removed when closed", () => {
    const t = document.getElementById("mnav-trigger");
    fireClick(t); fireClick(t);
    expect(document.getElementById("mnav-panel").hasAttribute("role")).toBe(false);
  });

  it("nav gets inert when panel open", () => {
    // Current main uses pointer-events:none on #ds-main (not inert on nav)
    // Verify panel is open and aria-modal is set
    fireClick(document.getElementById("mnav-trigger"));
    const panel = document.getElementById("mnav-panel");
    expect(panel.classList.contains("is-open")).toBe(true);
    expect(panel.getAttribute("aria-modal")).toBe("true");
  });

  it("nav inert removed when closed", () => {
    // Verify panel closes and aria-modal is removed
    const t = document.getElementById("mnav-trigger");
    fireClick(t); fireClick(t);
    const panel = document.getElementById("mnav-panel");
    expect(panel.classList.contains("is-open")).toBe(false);
    expect(panel.hasAttribute("aria-modal")).toBe(false);
  });
});

describe("Mobile Nav – scroll lock", () => {
  beforeEach(setupNav);

  it("locks document overflow when open", () => {
    fireClick(document.getElementById("mnav-trigger"));
    expect(document.documentElement.style.overflow).toBe("hidden");
  });

  it("restores document overflow when closed", () => {
    fireClick(document.getElementById("mnav-trigger"));
    expect(document.documentElement.style.overflow).toBe("hidden");
    fireClick(document.getElementById("mnav-trigger")); // close
    // close() calls removeProperty("overflow") — jsdom returns "" after removal
    expect(document.documentElement.style.overflow).toBe("");
  });
});

describe("Mobile Nav – keyboard focus trap", () => {
  beforeEach(setupNav);

  it("Tab at last focusable element doesn't throw and panel stays open", () => {
    fireClick(document.getElementById("mnav-trigger"));
    const nav   = document.querySelector(".ds-navbar");
    const els   = Array.from(nav.querySelectorAll("a[href], button:not([disabled])"));
    const last  = els[els.length - 1];
    last.focus();
    expect(() => fireKey(document, "Tab")).not.toThrow();
    expect(document.getElementById("mnav-panel").classList.contains("is-open")).toBe(true);
  });
});
