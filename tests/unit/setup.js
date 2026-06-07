/**
 * Vitest / jsdom global setup
 * Provides browser-API shims that jsdom doesn't include out of the box.
 */

/* ---------- matchMedia stub ---------- */
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

/* ---------- Clipboard API stub ---------- */
const _clipboardWriteText = vi.fn(() => Promise.resolve());
Object.defineProperty(navigator, "clipboard", {
  writable: true,
  value: { writeText: _clipboardWriteText },
});
global._clipboardWriteText = _clipboardWriteText;

/* ---------- scrollIntoView / scrollTo ---------- */
window.HTMLElement.prototype.scrollIntoView = vi.fn();
window.scrollTo = vi.fn();

/* ---------- IntersectionObserver stub ---------- */
global.IntersectionObserver = class {
  constructor(cb) { this._cb = cb; this.observed = []; }
  observe(el) { this.observed.push(el); }
  unobserve(el) { this.observed = this.observed.filter(e => e !== el); }
  disconnect() { this.observed = []; }
  /** Helper: manually fire entries from tests */
  trigger(entries) { this._cb(entries); }
};

/* ---------- requestAnimationFrame ---------- */
global.requestAnimationFrame = (fn) => setTimeout(fn, 0);
global.cancelAnimationFrame = clearTimeout;

/* ---------- localStorage stub ---------- */
const _ls = {};
Object.defineProperty(window, "localStorage", {
  value: {
    getItem: (k) => _ls[k] ?? null,
    setItem: (k, v) => { _ls[k] = String(v); },
    removeItem: (k) => { delete _ls[k]; },
    clear: () => { Object.keys(_ls).forEach(k => delete _ls[k]); },
  },
});
