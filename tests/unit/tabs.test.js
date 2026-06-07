/**
 * Functional Tabs tests
 * Tests: data-tabs controller, activate, ARIA roles, Arrow-key nav,
 *        B1: handbook inline-onclick tabs have no data-tab / ARIA,
 *        B7: missing role=tablist/tab/tabpanel + aria-selected
 */
import { describe, it, expect, beforeEach } from "vitest";
import { resetBody, runScripts, fireClick, fireKey } from "./helpers.js";

/* --- Properly wired tabs (data-tabs pattern) --- */
function setupProperTabs() {
  resetBody(`
    <div data-tabs id="tab-group">
      <button data-tab="design" class="ds-tab">Design</button>
      <button data-tab="code" class="ds-tab">Code</button>
      <button data-tab="preview" class="ds-tab">Preview</button>
    </div>
    <div data-panel="design" class="ds-tab-content">Design content</div>
    <div data-panel="code" class="ds-tab-content">Code content</div>
    <div data-panel="preview" class="ds-tab-content">Preview content</div>
  `);
  runScripts();
}

/* --- The "broken" inline-onclick tabs from handbook.html (B1) --- */
function setupHandbookTabs() {
  resetBody(`
    <div class="ds-tabs" id="handbook-tabs">
      <button class="ds-tab ds-tab--active"
        onclick="document.querySelectorAll('.ds-tab').forEach(t=>t.classList.remove('ds-tab--active'));this.classList.add('ds-tab--active');document.getElementById('t1').classList.add('ds-tab-content--active')">Design</button>
      <button class="ds-tab"
        onclick="document.querySelectorAll('.ds-tab').forEach(t=>t.classList.remove('ds-tab--active'));this.classList.add('ds-tab--active');document.getElementById('t2').classList.add('ds-tab-content--active')">Code</button>
    </div>
    <div id="t1" class="ds-tab-content ds-tab-content--active">Design</div>
    <div id="t2" class="ds-tab-content">Code</div>
  `);
  runScripts();
}

describe("Tabs – data-tabs controller (proper pattern)", () => {
  beforeEach(setupProperTabs);

  it("activates first tab on init", () => {
    const first = document.querySelector("[data-tab='design']");
    expect(first.classList.contains("ds-tab--active")).toBe(true);
  });

  it("first panel is active on init", () => {
    const panel = document.querySelector("[data-panel='design']");
    expect(panel.classList.contains("is-active")).toBe(true);
  });

  it("clicking second tab activates it", () => {
    const codeTab = document.querySelector("[data-tab='code']");
    fireClick(codeTab);
    expect(codeTab.classList.contains("ds-tab--active")).toBe(true);
  });

  it("clicking second tab deactivates first", () => {
    const codeTab = document.querySelector("[data-tab='code']");
    const designTab = document.querySelector("[data-tab='design']");
    fireClick(codeTab);
    expect(designTab.classList.contains("ds-tab--active")).toBe(false);
  });

  it("clicking second tab shows its panel", () => {
    fireClick(document.querySelector("[data-tab='code']"));
    expect(document.querySelector("[data-panel='code']").classList.contains("is-active")).toBe(true);
  });

  it("clicking second tab hides first panel", () => {
    fireClick(document.querySelector("[data-tab='code']"));
    expect(document.querySelector("[data-panel='design']").classList.contains("is-active")).toBe(false);
  });

  it("Enter key activates tab", () => {
    const codeTab = document.querySelector("[data-tab='code']");
    fireKey(codeTab, "Enter");
    expect(codeTab.classList.contains("ds-tab--active")).toBe(true);
  });

  it("Space key activates tab", () => {
    const codeTab = document.querySelector("[data-tab='code']");
    fireKey(codeTab, " ");
    expect(codeTab.classList.contains("ds-tab--active")).toBe(true);
  });

  it("sets aria-selected=true on active tab", () => {
    const first = document.querySelector("[data-tab='design']");
    expect(first.getAttribute("aria-selected")).toBe("true");
  });

  it("sets aria-selected=false on inactive tab", () => {
    const codeTab = document.querySelector("[data-tab='code']");
    expect(codeTab.getAttribute("aria-selected")).toBe("false");
  });
});

describe("Tabs – ARIA roles (B7)", () => {
  beforeEach(setupProperTabs);

  /**
   * B7: WAI-ARIA Tabs pattern requires role=tablist on container,
   *     role=tab on each tab button, role=tabpanel on each panel.
   *     Also requires Arrow Left/Right keyboard navigation.
   *
   * Currently (pre-fix): these roles are NOT set by the JS controller.
   */
  it("[B7] tab group container has role=tablist", () => {
    const group = document.querySelector("[data-tabs]");
    expect(group.getAttribute("role")).toBe("tablist");
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

  it("[B7] ArrowRight moves focus to next tab", () => {
    const designTab = document.querySelector("[data-tab='design']");
    const codeTab = document.querySelector("[data-tab='code']");
    designTab.focus();
    fireKey(designTab, "ArrowRight");
    expect(document.activeElement).toBe(codeTab);
  });

  it("[B7] ArrowLeft moves focus to previous tab (wraps)", () => {
    const designTab = document.querySelector("[data-tab='design']");
    const previewTab = document.querySelector("[data-tab='preview']");
    designTab.focus();
    fireKey(designTab, "ArrowLeft");
    expect(document.activeElement).toBe(previewTab);
  });

  it("[B7] ArrowRight wraps from last to first", () => {
    const previewTab = document.querySelector("[data-tab='preview']");
    const designTab = document.querySelector("[data-tab='design']");
    previewTab.focus();
    fireKey(previewTab, "ArrowRight");
    expect(document.activeElement).toBe(designTab);
  });
});

describe("Tabs – handbook inline-onclick pattern (B1)", () => {
  /**
   * B1: The old handbook tabs used inline onclick + querySelectorAll('.ds-tab')
   * globally — dangerous when multiple tab groups exist, no ARIA, no keyboard nav.
   *
   * Fix: handbook.html tabs are now converted to data-tabs/data-tab/data-panel
   * pattern driven by the JS controller. These tests verify the FIXED state.
   */
  function setupHandbookTabsFixed() {
    resetBody(`
      <div class="ds-tabs" data-tabs id="handbook-tabs">
        <button class="ds-tab" data-tab="design">Design</button>
        <button class="ds-tab" data-tab="code">Code</button>
      </div>
      <div data-panel="design" class="ds-tab-content">Design</div>
      <div data-panel="code" class="ds-tab-content">Code</div>
    `);
    runScripts();
  }

  it("[B1] tabs container has role=tablist (JS controller sets it)", () => {
    setupHandbookTabsFixed();
    const container = document.querySelector("[data-tabs]");
    expect(container.getAttribute("role")).toBe("tablist");
  });

  it("[B1] each tab button has role=tab", () => {
    setupHandbookTabsFixed();
    document.querySelectorAll("[data-tab]").forEach((t) => {
      expect(t.getAttribute("role")).toBe("tab");
    });
  });

  it("[B1] each tab button has aria-selected", () => {
    setupHandbookTabsFixed();
    document.querySelectorAll("[data-tab]").forEach((t) => {
      expect(t.hasAttribute("aria-selected")).toBe(true);
    });
  });

  it("[B1] panels are driven by is-active (not global querySelectorAll)", () => {
    setupHandbookTabsFixed();
    // clicking code tab should only activate code panel, not all ds-tab-content
    fireClick(document.querySelector("[data-tab='code']"));
    expect(document.querySelector("[data-panel='design']").classList.contains("is-active")).toBe(false);
    expect(document.querySelector("[data-panel='code']").classList.contains("is-active")).toBe(true);
  });
});
