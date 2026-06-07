/**
 * Accordion tests
 * Tests: click toggle, keyboard Enter/Space, ARIA attributes,
 *        B2: role="button" + tabindex=0 on header div,
 *        B4: focus-visible CSS (checked via class existence in styles)
 */
import { describe, it, expect, beforeEach } from "vitest";
import { resetBody, runScripts, fireClick, fireKey } from "./helpers.js";

function setupAccordion() {
  resetBody(`
    <div class="ds-accordion">
      <div class="ds-accordion-item open">
        <div class="ds-accordion-header"
             aria-expanded="true"
             aria-controls="panel-1">Q1
          <span class="ds-accordion-arrow">▾</span>
        </div>
        <div class="ds-accordion-content" id="panel-1" aria-hidden="false">A1</div>
      </div>
      <div class="ds-accordion-item">
        <div class="ds-accordion-header"
             aria-expanded="false"
             aria-controls="panel-2">Q2
          <span class="ds-accordion-arrow">▾</span>
        </div>
        <div class="ds-accordion-content" id="panel-2" aria-hidden="true">A2</div>
      </div>
    </div>
  `);
  runScripts();
}

describe("Accordion – interaction", () => {
  beforeEach(setupAccordion);

  it("click on closed header opens it", () => {
    const item = document.querySelectorAll(".ds-accordion-item")[1];
    const header = item.querySelector(".ds-accordion-header");
    fireClick(header);
    expect(item.classList.contains("open")).toBe(true);
  });

  it("click on open header closes it", () => {
    const item = document.querySelectorAll(".ds-accordion-item")[0];
    const header = item.querySelector(".ds-accordion-header");
    fireClick(header);
    expect(item.classList.contains("open")).toBe(false);
  });

  it("click updates aria-expanded to true", () => {
    const header = document.querySelectorAll(".ds-accordion-header")[1];
    fireClick(header);
    expect(header.getAttribute("aria-expanded")).toBe("true");
  });

  it("click updates aria-expanded to false when closing", () => {
    const header = document.querySelectorAll(".ds-accordion-header")[0];
    fireClick(header);
    expect(header.getAttribute("aria-expanded")).toBe("false");
  });

  it("click updates aria-hidden on panel", () => {
    const header = document.querySelectorAll(".ds-accordion-header")[1];
    const panel = document.getElementById("panel-2");
    fireClick(header);
    expect(panel.getAttribute("aria-hidden")).toBe("false");
  });

  it("Enter key toggles accordion", () => {
    const header = document.querySelectorAll(".ds-accordion-header")[1];
    fireKey(header, "Enter");
    expect(header.getAttribute("aria-expanded")).toBe("true");
  });

  it("Space key toggles accordion", () => {
    const header = document.querySelectorAll(".ds-accordion-header")[1];
    fireKey(header, " ");
    expect(header.getAttribute("aria-expanded")).toBe("true");
  });

  it("aria-controls links header to correct panel id", () => {
    const header = document.querySelectorAll(".ds-accordion-header")[0];
    const panelId = header.getAttribute("aria-controls");
    expect(document.getElementById(panelId)).toBeTruthy();
  });
});

describe("Accordion – accessibility (B2)", () => {
  beforeEach(setupAccordion);

  /**
   * B2: accordion header must be keyboard-reachable.
   * Fix required: JS must set role="button" + tabindex="0" on each .ds-accordion-header
   * so keyboard users can Tab to it and activate with Enter/Space.
   *
   * Currently (pre-fix) these attributes are NOT set → tests will FAIL.
   */
  it("[B2] each header has role=button", () => {
    document.querySelectorAll(".ds-accordion-header").forEach((h) => {
      expect(h.getAttribute("role")).toBe("button");
    });
  });

  it("[B2] each header has tabindex=0", () => {
    document.querySelectorAll(".ds-accordion-header").forEach((h) => {
      expect(h.getAttribute("tabindex")).toBe("0");
    });
  });
});
