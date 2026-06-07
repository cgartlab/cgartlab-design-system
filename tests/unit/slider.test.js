/**
 * Slider sync tests
 * Tests: fill width tracks value, value span updates, initial sync
 */
import { describe, it, expect, beforeEach } from "vitest";
import { resetBody, runScripts, fire } from "./helpers.js";

function setupSlider() {
  resetBody(`
    <div class="ds-slider-group">
      <div class="ds-slider-label-row">
        <label class="ds-label">Volume</label>
        <span class="ds-slider-value" id="slider-val-1">65%</span>
      </div>
      <div class="ds-slider-track-wrap">
        <div class="ds-slider-track">
          <div class="ds-slider-fill" style="width:65%"></div>
        </div>
        <input class="ds-slider" type="range" min="0" max="100" value="65"
               data-val-id="slider-val-1">
      </div>
    </div>
  `);
  runScripts();
}

describe("Slider", () => {
  beforeEach(setupSlider);

  it("fill width matches slider value on init (65%)", () => {
    const fill = document.querySelector(".ds-slider-fill");
    expect(fill.style.width).toBe("65%");
  });

  it("value span shows current value on init", () => {
    const span = document.getElementById("slider-val-1");
    expect(span.textContent).toBe("65%");
  });

  it("fill width updates when slider value changes", () => {
    const slider = document.querySelector(".ds-slider");
    const fill = document.querySelector(".ds-slider-fill");
    slider.value = "80";
    fire(slider, "input");
    expect(fill.style.width).toBe("80%");
  });

  it("value span updates when slider value changes", () => {
    const slider = document.querySelector(".ds-slider");
    const span = document.getElementById("slider-val-1");
    slider.value = "30";
    fire(slider, "input");
    expect(span.textContent).toBe("30%");
  });

  it("change event also syncs fill and span", () => {
    const slider = document.querySelector(".ds-slider");
    const fill = document.querySelector(".ds-slider-fill");
    const span = document.getElementById("slider-val-1");
    slider.value = "10";
    fire(slider, "change");
    expect(fill.style.width).toBe("10%");
    expect(span.textContent).toBe("10%");
  });

  it("works without a fill element (no throw)", () => {
    resetBody(`
      <div class="ds-slider-group">
        <div class="ds-slider-track-wrap">
          <input class="ds-slider" type="range" min="0" max="100" value="50">
        </div>
      </div>
    `);
    runScripts();
    const slider = document.querySelector(".ds-slider");
    slider.value = "75";
    expect(() => fire(slider, "input")).not.toThrow();
  });

  it("works without a value span (no throw)", () => {
    resetBody(`
      <div class="ds-slider-group">
        <div class="ds-slider-track-wrap">
          <div class="ds-slider-track"><div class="ds-slider-fill"></div></div>
          <input class="ds-slider" type="range" min="0" max="100" value="50">
        </div>
      </div>
    `);
    runScripts();
    const slider = document.querySelector(".ds-slider");
    slider.value = "20";
    expect(() => fire(slider, "input")).not.toThrow();
  });
});
