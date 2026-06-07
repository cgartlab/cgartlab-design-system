/**
 * Page Navigation (TOC) tests
 */
import { describe, it, expect, beforeEach, vi } from "vitest";
import { resetBody, runScripts, fireClick } from "./helpers.js";

function setupPageNav() {
  resetBody(`
    <nav class="ds-pagenav" aria-label="目录">
      <details class="ds-pagenav-disclosure" open>
        <summary class="ds-pagenav-summary">目录</summary>
        <ol class="ds-pagenav-list">
          <li><a class="ds-pagenav-link" href="#sec1">
            <span class="ds-pagenav-num">01</span>
            <span class="ds-pagenav-text">Section 1</span>
          </a></li>
          <li><a class="ds-pagenav-link" href="#sec2">
            <span class="ds-pagenav-num">02</span>
            <span class="ds-pagenav-text">Section 2</span>
          </a></li>
        </ol>
      </details>
    </nav>
    <section id="sec1" class="ds-section"><h2>Section 1</h2></section>
    <section id="sec2" class="ds-section"><h2>Section 2</h2></section>
  `);
  runScripts();
}

describe("PageNav – initial active state (Fix B5)", () => {
  beforeEach(setupPageNav);

  it("[B5] first link is active on page load (no scroll needed)", () => {
    const link1 = document.querySelector(".ds-pagenav-link[href='#sec1']");
    expect(link1.classList.contains("ds-pagenav-link--active")).toBe(true);
  });

  it("only one link is active at a time on init", () => {
    const active = document.querySelectorAll(".ds-pagenav-link--active");
    expect(active.length).toBe(1);
  });
});

describe("PageNav – link click scrolls & auto-closes mobile disclosure", () => {
  it("clicking a link calls scrollIntoView on the target", () => {
    setupPageNav();
    const sec1 = document.getElementById("sec1");
    sec1.scrollIntoView = vi.fn();
    fireClick(document.querySelector(".ds-pagenav-link[href='#sec1']"));
    expect(sec1.scrollIntoView).toHaveBeenCalled();
  });

  it("clicking a link closes the mobile disclosure on mobile breakpoint", () => {
    window.matchMedia.mockImplementation((q) => ({
      matches: q.includes("max-width"),
      media: q,
      addEventListener: vi.fn(), removeEventListener: vi.fn(),
      addListener: vi.fn(), removeListener: vi.fn(),
    }));
    setupPageNav();
    const disc = document.querySelector(".ds-pagenav-disclosure");
    expect(disc.hasAttribute("open")).toBe(true);
    fireClick(document.querySelector(".ds-pagenav-link[href='#sec1']"));
    expect(disc.hasAttribute("open")).toBe(false);

    // Restore matchMedia
    window.matchMedia.mockImplementation((q) => ({
      matches: false, media: q,
      addEventListener: vi.fn(), removeEventListener: vi.fn(),
      addListener: vi.fn(), removeListener: vi.fn(),
    }));
  });
});

describe("PageNav – link generation (data-pagenav-generate)", () => {
  it("generates links from matching sections", () => {
    resetBody(`
      <nav class="ds-pagenav" data-pagenav-generate=".ds-section[id]" aria-label="目录">
        <ol class="ds-pagenav-list"></ol>
      </nav>
      <section class="ds-section" id="alpha">
        <div class="ds-section-header"><h2>Alpha</h2></div>
      </section>
      <section class="ds-section" id="beta">
        <div class="ds-section-header"><h2>Beta</h2></div>
      </section>
    `);
    runScripts();
    const links = document.querySelectorAll(".ds-pagenav-link");
    expect(links.length).toBe(2);
    expect(links[0].getAttribute("href")).toBe("#alpha");
    expect(links[1].getAttribute("href")).toBe("#beta");
  });

  it("numbering is zero-padded for single digits", () => {
    resetBody(`
      <nav class="ds-pagenav" data-pagenav-generate=".ds-section[id]" aria-label="目录">
        <ol class="ds-pagenav-list"></ol>
      </nav>
      <section class="ds-section" id="a1"><div class="ds-section-header"><h2>One</h2></div></section>
    `);
    runScripts();
    expect(document.querySelector(".ds-pagenav-num").textContent).toBe("01");
  });

  it("hides nav when no sections found", () => {
    resetBody(`
      <nav class="ds-pagenav" data-pagenav-generate=".ds-section[id]" aria-label="目录">
        <ol class="ds-pagenav-list"></ol>
      </nav>
    `);
    runScripts();
    expect(document.querySelector(".ds-pagenav").style.display).toBe("none");
  });
});
