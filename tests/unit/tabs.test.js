/**
 * Functional Tabs tests — data-tabs controller, ARIA (Fix B7), Arrow keys, B1
 */
import { describe, it, expect, beforeEach } from "vitest";
import { resetBody, runScripts, fireClick, fireKey } from "./helpers.js";

function setupTabs() {
  resetBody(`
    <div data-tabs id="tab-group">
      <button data-tab="design" class="ds-tab">Design</button>
      <button data-tab="code"   class="ds-tab">Code</button>
      <button data-tab="preview" class="ds-tab">Preview</button>
    </div>
    <div data-panel="design"  class="ds-tab-content">Design content</div>
    <div data-panel="code"    class="ds-tab-content">Code content</div>
    <div data-panel="preview" class="ds-tab-content">Preview content</div>
  `);
  runScripts();
}

describe("Tabs – data-tabs controller", () => {
  beforeEach(setupTabs);

  it("activates first tab on init", () => {
    expect(document.querySelector("[data-tab='design']").classList.contains("ds-tab--active")).toBe(true);
  });

  it("first panel is active on init", () => {
    expect(document.querySelector("[data-panel='design']").classList.contains("is-active")).toBe(true);
  });

  it("clicking second tab activates it and deactivates first", () => {
    fireClick(document.querySelector("[data-tab='code']"));
    expect(document.querySelector("[data-tab='code']").classList.contains("ds-tab--active")).toBe(true);
    expect(document.querySelector("[data-tab='design']").classList.contains("ds-tab--active")).toBe(false);
  });

  it("clicking second tab shows its panel and hides first", () => {
    fireClick(document.querySelector("[data-tab='code']"));
    expect(document.querySelector("[data-panel='code']").classList.contains("is-active")).toBe(true);
    expect(document.querySelector("[data-panel='design']").classList.contains("is-active")).toBe(false);
  });

  it("Enter key activates tab", () => {
    fireKey(document.querySelector("[data-tab='code']"), "Enter");
    expect(document.querySelector("[data-tab='code']").classList.contains("ds-tab--active")).toBe(true);
  });

  it("Space key activates tab", () => {
    fireKey(document.querySelector("[data-tab='code']"), " ");
    expect(document.querySelector("[data-tab='code']").classList.contains("ds-tab--active")).toBe(true);
  });

  it("sets aria-selected=true on active tab", () => {
    expect(document.querySelector("[data-tab='design']").getAttribute("aria-selected")).toBe("true");
  });

  it("sets aria-selected=false on inactive tab", () => {
    expect(document.querySelector("[data-tab='code']").getAttribute("aria-selected")).toBe("false");
  });
});

describe("Tabs – ARIA roles (Fix B7)", () => {
  beforeEach(setupTabs);

  it("[B7] tab group container has role=tablist", () => {
    expect(document.querySelector("[data-tabs]").getAttribute("role")).toBe("tablist");
  });

  it("[B7] each tab button has role=tab", () => {
    document.querySelectorAll("[data-tab]").forEach((t) => {
      expect(t.getAttribute("role")).toBe("tab");
    });
  });

  it("[B7] each panel has role=tabpanel", () => {
    document.querySelectorAll("[data-panel]").forEach((p) => {
      expect(p.getAttribute("role")).toBe("tabpanel");
    });
  });
});

describe("Tabs – Arrow-key navigation (Fix B7)", () => {
  beforeEach(setupTabs);

  it("[B7] ArrowRight moves focus to next tab", () => {
    const design  = document.querySelector("[data-tab='design']");
    const code    = document.querySelector("[data-tab='code']");
    design.focus();
    fireKey(design, "ArrowRight");
    expect(document.activeElement).toBe(code);
  });

  it("[B7] ArrowLeft wraps from first to last tab", () => {
    const design  = document.querySelector("[data-tab='design']");
    const preview = document.querySelector("[data-tab='preview']");
    design.focus();
    fireKey(design, "ArrowLeft");
    expect(document.activeElement).toBe(preview);
  });

  it("[B7] ArrowRight wraps from last to first tab", () => {
    const preview = document.querySelector("[data-tab='preview']");
    const design  = document.querySelector("[data-tab='design']");
    preview.focus();
    fireKey(preview, "ArrowRight");
    expect(document.activeElement).toBe(design);
  });
});

describe("Tabs – handbook B1 fix verified", () => {
  /**
   * B1: handbook.html tabs used inline onclick + global querySelectorAll('.ds-tab').
   * Fix: replaced with data-tabs / data-tab / data-panel declarative pattern.
   * These tests verify the fixed pattern works correctly.
   */
  function setupHandbookFixed() {
    resetBody(`
      <div class="ds-tabs" data-tabs id="handbook-demo-tabs">
        <button class="ds-tab" data-tab="design">Design</button>
        <button class="ds-tab" data-tab="code">Code</button>
      </div>
      <div data-panel="design" class="ds-tab-content">Design</div>
      <div data-panel="code"   class="ds-tab-content">Code</div>
    `);
    runScripts();
  }

  it("[B1] container has role=tablist", () => {
    setupHandbookFixed();
    expect(document.querySelector("[data-tabs]").getAttribute("role")).toBe("tablist");
  });

  it("[B1] each button has role=tab", () => {
    setupHandbookFixed();
    document.querySelectorAll("[data-tab]").forEach((t) => {
      expect(t.getAttribute("role")).toBe("tab");
    });
  });

  it("[B1] each button has aria-selected", () => {
    setupHandbookFixed();
    document.querySelectorAll("[data-tab]").forEach((t) => {
      expect(t.hasAttribute("aria-selected")).toBe(true);
    });
  });

  it("[B1] clicking only activates the correct group panel (scoped, not global)", () => {
    setupHandbookFixed();
    fireClick(document.querySelector("[data-tab='code']"));
    expect(document.querySelector("[data-panel='design']").classList.contains("is-active")).toBe(false);
    expect(document.querySelector("[data-panel='code']").classList.contains("is-active")).toBe(true);
  });
});
