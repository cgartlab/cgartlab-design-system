/**
 * Copy-to-clipboard tests
 * Tests: data-copy-text, data-copy selector, success state, error state,
 *        B3: catch handler `original` ReferenceError → label never restores
 */
import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { resetBody, runScripts, fireClick } from "./helpers.js";

function setupCopy(html) {
  resetBody(html);
  runScripts();
}

describe("Copy – success path", () => {
  beforeEach(() => {
    _clipboardWriteText.mockClear();
    _clipboardWriteText.mockResolvedValue(undefined);
    setupCopy(`
      <button data-copy-text="hello world" type="button">
        <span class="ds-copy-label">复制</span>
      </button>
    `);
  });

  it("writes the correct text to clipboard", async () => {
    const btn = document.querySelector("[data-copy-text]");
    fireClick(btn);
    // flush microtask queue
    await new Promise(r => setTimeout(r, 0));
    expect(_clipboardWriteText).toHaveBeenCalledWith("hello world");
  });

  it("adds is-copied class after success", async () => {
    const btn = document.querySelector("[data-copy-text]");
    fireClick(btn);
    await new Promise(r => setTimeout(r, 0));
    expect(btn.classList.contains("is-copied")).toBe(true);
  });

  it("label changes to 已复制 after success", async () => {
    const btn = document.querySelector("[data-copy-text]");
    fireClick(btn);
    await new Promise(r => setTimeout(r, 0));
    expect(btn.querySelector(".ds-copy-label").textContent).toBe("已复制");
  });

  it("label restores after timeout", async () => {
    vi.useFakeTimers();
    _clipboardWriteText.mockResolvedValue(undefined);
    setupCopy(`
      <button data-copy-text="hello world" type="button">
        <span class="ds-copy-label">复制</span>
      </button>
    `);
    const btn = document.querySelector("[data-copy-text]");
    fireClick(btn);
    await Promise.resolve();
    vi.advanceTimersByTime(2000);
    expect(btn.querySelector(".ds-copy-label").textContent).toBe("复制");
    vi.useRealTimers();
  });
});

describe("Copy – data-copy selector", () => {
  beforeEach(() => {
    _clipboardWriteText.mockResolvedValue(undefined);
    setupCopy(`
      <pre id="code-block">const x = 1;</pre>
      <button data-copy="#code-block" type="button">
        <span class="ds-copy-label">复制</span>
      </button>
    `);
  });

  it("reads text from target element", async () => {
    const btn = document.querySelector("[data-copy]");
    fireClick(btn);
    await Promise.resolve();
    expect(_clipboardWriteText).toHaveBeenCalledWith("const x = 1;");
  });

  it("does nothing when selector matches nothing", async () => {
    _clipboardWriteText.mockClear();
    setupCopy(`
      <button data-copy="#nonexistent" type="button">
        <span class="ds-copy-label">复制</span>
      </button>
    `);
    const btn = document.querySelector("[data-copy]");
    fireClick(btn);
    await new Promise(r => setTimeout(r, 0));
    expect(_clipboardWriteText).not.toHaveBeenCalled();
  });
});

describe("Copy – error path (B3)", () => {
  beforeEach(() => {
    _clipboardWriteText.mockRejectedValue(new Error("denied"));
    setupCopy(`
      <button data-copy-text="test" type="button">
        <span class="ds-copy-label">复制</span>
      </button>
    `);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("adds is-error class on clipboard failure", async () => {
    const btn = document.querySelector("[data-copy-text]");
    fireClick(btn);
    await Promise.resolve();
    await Promise.resolve(); // let catch run
    expect(btn.classList.contains("is-error")).toBe(true);
  });

  it("label changes to 复制失败 on error", async () => {
    const btn = document.querySelector("[data-copy-text]");
    fireClick(btn);
    await Promise.resolve();
    await Promise.resolve();
    expect(btn.querySelector(".ds-copy-label").textContent).toBe("复制失败");
  });

  /**
   * B3: In the original catch handler, `original` is referenced but it was
   * declared in the .then() closure — a different scope. This causes a
   * ReferenceError and the label never restores to "复制" after showing
   * "复制失败".
   *
   * Fix: hoist `original` declaration before the .then()/.catch() split.
   */
  it("[B3] label restores to original text after error timeout (no ReferenceError)", async () => {
    vi.useFakeTimers();
    const btn = document.querySelector("[data-copy-text]");
    const label = btn.querySelector(".ds-copy-label");

    fireClick(btn);
    await Promise.resolve();
    await Promise.resolve();

    expect(label.textContent).toBe("复制失败");

    // Should restore after timeout — pre-fix this throws ReferenceError and never runs
    expect(() => vi.advanceTimersByTime(3000)).not.toThrow();
    expect(label.textContent).toBe("复制");
  });

  it("[B3] is-error class is removed after timeout", async () => {
    vi.useFakeTimers();
    const btn = document.querySelector("[data-copy-text]");
    fireClick(btn);
    await Promise.resolve();
    await Promise.resolve();
    vi.advanceTimersByTime(3000);
    expect(btn.classList.contains("is-error")).toBe(false);
    vi.useRealTimers();
  });
});

describe("Copy – TEXTAREA / INPUT source", () => {
  beforeEach(() => {
    _clipboardWriteText.mockResolvedValue(undefined);
    setupCopy(`
      <textarea id="ta">textarea value</textarea>
      <button data-copy="#ta" type="button">
        <span class="ds-copy-label">复制</span>
      </button>
    `);
  });

  it("reads .value from TEXTAREA", async () => {
    const btn = document.querySelector("[data-copy]");
    fireClick(btn);
    await Promise.resolve();
    expect(_clipboardWriteText).toHaveBeenCalledWith("textarea value");
  });
});
