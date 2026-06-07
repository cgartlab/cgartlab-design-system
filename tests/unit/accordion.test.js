/**
 * Accordion tests — interaction, ARIA, keyboard, Fix B2
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
    fireClick(document.querySelectorAll(".ds-accordion-header")[1]);
    expect(document.querySelectorAll(".ds-accordion-item")[1].classList.contains("open")).toBe(true);
  });

  it("click on open header closes it", () => {
    fireClick(document.querySelectorAll(".ds-accordion-header")[0]);
    expect(document.querySelectorAll(".ds-accordion-item")[0].classList.contains("open")).toBe(false);
  });

  it("click updates aria-expanded to true", () => {
    const h = document.querySelectorAll(".ds-accordion-header")[1];
    fireClick(h);
    expect(h.getAttribute("aria-expanded")).toBe("true");
  });

  it("click updates aria-expanded to false when closing", () => {
    const h = document.querySelectorAll(".ds-accordion-header")[0];
    fireClick(h);
    expect(h.getAttribute("aria-expanded")).toBe("false");
  });

  it("click updates aria-hidden on panel", () => {
    const h = document.querySelectorAll(".ds-accordion-header")[1];
    fireClick(h);
    expect(document.getElementById("panel-2").getAttribute("aria-hidden")).toBe("false");
  });

  it("Enter key toggles accordion", () => {
    const h = document.querySelectorAll(".ds-accordion-header")[1];
    fireKey(h, "Enter");
    expect(h.getAttribute("aria-expanded")).toBe("true");
  });

  it("Space key toggles accordion", () => {
    const h = document.querySelectorAll(".ds-accordion-header")[1];
    fireKey(h, " ");
    expect(h.getAttribute("aria-expanded")).toBe("true");
  });

  it("aria-controls links header to correct panel id", () => {
    const h    = document.querySelectorAll(".ds-accordion-header")[0];
    const pid  = h.getAttribute("aria-controls");
    expect(document.getElementById(pid)).toBeTruthy();
  });
});

describe("Accordion – accessibility (Fix B2)", () => {
  beforeEach(setupAccordion);

  it("[B2] each header has role=button (JS injects it)", () => {
    document.querySelectorAll(".ds-accordion-header").forEach((h) => {
      expect(h.getAttribute("role")).toBe("button");
    });
  });

  it("[B2] each header has tabindex=0 (JS injects it)", () => {
    document.querySelectorAll(".ds-accordion-header").forEach((h) => {
      expect(h.getAttribute("tabindex")).toBe("0");
    });
  });
});
