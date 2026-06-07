/**
 * Slider sync tests
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
    expect(document.querySelector(".ds-slider-fill").style.width).toBe("65%");
  });

  it("value span shows current value on init", () => {
    expect(document.getElementById("slider-val-1").textContent).toBe("65%");
  });

  it("fill width updates when slider value changes", () => {
    const slider = document.querySelector(".ds-slider");
    slider.value = "80";
    fire(slider, "input");
    expect(document.querySelector(".ds-slider-fill").style.width).toBe("80%");
  });

  it("value span updates when slider value changes", () => {
    const slider = document.querySelector(".ds-slider");
    slider.value = "30";
    fire(slider, "input");
    expect(document.getElementById("slider-val-1").textContent).toBe("30%");
  });

  it("change event also syncs fill and span", () => {
    const slider = document.querySelector(".ds-slider");
    slider.value = "10";
    fire(slider, "change");
    expect(document.querySelector(".ds-slider-fill").style.width).toBe("10%");
    expect(document.getElementById("slider-val-1").textContent).toBe("10%");
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
