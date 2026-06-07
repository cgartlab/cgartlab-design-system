/**
 * Miscellaneous module tests
 * Tests: year stamp, icon grid render, token table render, scroll reveal
 */
import { describe, it, expect, beforeEach } from "vitest";
import { resetBody, runScripts } from "./helpers.js";

describe("Year stamp", () => {
  it("fills .ds-year with current year", () => {
    resetBody(`<span class="ds-year"></span>`);
    runScripts();
    const el = document.querySelector(".ds-year");
    expect(el.textContent).toBe(String(new Date().getFullYear()));
  });

  it("fills multiple .ds-year elements", () => {
    resetBody(`<span class="ds-year"></span><span class="ds-year"></span>`);
    runScripts();
    document.querySelectorAll(".ds-year").forEach((el) => {
      expect(el.textContent).toBe(String(new Date().getFullYear()));
    });
  });
});

describe("Icon grid", () => {
  it("renders icons into #icon-grid", () => {
    resetBody(`<div id="icon-grid"></div>`);
    runScripts();
    const grid = document.getElementById("icon-grid");
    expect(grid.children.length).toBeGreaterThan(0);
  });

  it("each icon box has a label span", () => {
    resetBody(`<div id="icon-grid"></div>`);
    runScripts();
    const boxes = document.querySelectorAll(".ds-icon-box");
    boxes.forEach((box) => {
      expect(box.querySelector("span")).toBeTruthy();
    });
  });

  it("each icon box has title attribute", () => {
    resetBody(`<div id="icon-grid"></div>`);
    runScripts();
    document.querySelectorAll(".ds-icon-box").forEach((box) => {
      expect(box.getAttribute("title")).toBeTruthy();
    });
  });

  it("does nothing when #icon-grid is absent", () => {
    resetBody(`<div id="other"></div>`);
    expect(() => runScripts()).not.toThrow();
  });
});

describe("Token table", () => {
  it("renders rows into #token-tbody", () => {
    resetBody(`<table><tbody id="token-tbody"></tbody></table>`);
    runScripts();
    const tbody = document.getElementById("token-tbody");
    expect(tbody.rows.length).toBeGreaterThan(0);
  });

  it("each row has two cells: name and value", () => {
    resetBody(`<table><tbody id="token-tbody"></tbody></table>`);
    runScripts();
    const rows = document.querySelectorAll("#token-tbody tr");
    rows.forEach((row) => {
      expect(row.cells.length).toBe(2);
    });
  });

  it("first cell starts with --ds-", () => {
    resetBody(`<table><tbody id="token-tbody"></tbody></table>`);
    runScripts();
    const firstCell = document.querySelector("#token-tbody tr td:first-child");
    expect(firstCell.textContent.startsWith("--ds-")).toBe(true);
  });

  it("does nothing when #token-tbody absent", () => {
    resetBody(`<div></div>`);
    expect(() => runScripts()).not.toThrow();
  });
});

describe("Scroll reveal", () => {
  it("immediately makes elements visible when prefers-reduced-motion", () => {
    window.matchMedia.mockImplementation((q) => ({
      matches: q.includes("reduce"),
      media: q,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
    }));

    resetBody(`<div class="ds-reveal">content</div>`);
    runScripts();
    const el = document.querySelector(".ds-reveal");
    expect(el.classList.contains("is-visible")).toBe(true);

    window.matchMedia.mockImplementation((q) => ({
      matches: false, media: q,
      addEventListener: vi.fn(), removeEventListener: vi.fn(),
      addListener: vi.fn(), removeListener: vi.fn(),
    }));
  });

  it("does nothing when no .ds-reveal elements present", () => {
    resetBody(`<div>no reveal</div>`);
    expect(() => runScripts()).not.toThrow();
  });
});
