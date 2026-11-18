const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const root = path.join(__dirname, "..");
const read = (p) => fs.readFileSync(path.join(root, p), "utf8");
const { SYMBOLS, PAGES, LOOP } = require("../js/ghost-layer.js");

test("every journey page carries the ghosted reminders for its own place", () => {
  const pages = { "index.html": "home", "table.html": "table", "counter.html": "counter", "counter-path.html": "path", "guide.html": "guide" };
  for (const [file, page] of Object.entries(pages)) {
    const html = read(file);
    assert.match(html, new RegExp(`data-ghost="${page}"`), file);
    assert.match(html, /js\/ghost-layer\.js/, file);
    assert.ok(PAGES[page], page);
  }
});

test("only drawings that exist are used, and the loop ends on + U", () => {
  for (const names of Object.values(PAGES)) for (const n of names) assert.ok(SYMBOLS[n], n);
  for (const n of LOOP) assert.ok(SYMBOLS[n], n);
  assert.equal(LOOP[LOOP.length - 1], "plus-u");
  assert.ok(PAGES.home.includes("no-judgement") && PAGES.home.includes("no-money") && PAGES.home.includes("no-faces"));
});

test("the layer never covers content and steps aside when asked", () => {
  const css = read("css/access.css");
  assert.match(css, /\.ghost-layer \{[^}]*z-index: -1;[^}]*pointer-events: none;/);
  assert.match(css, /html\.a11y-contrast \.ghost-layer \{ display: none; \}/);
  assert.match(css, /prefers-reduced-motion: reduce/);
  assert.match(read("js/ghost-layer.js"), /setAttribute\("aria-hidden", "true"\)/);
});

test("the home page states the three promises in words and ends on The Difference", () => {
  const html = read("index.html");
  for (const words of ["No judgement", "No $", "No faces", "Now become The Difference. Stop feeling different."]) assert.ok(html.includes(words), words);
  assert.match(read("counter-path.html"), /stop and take the night/);
});
