const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const root = path.join(__dirname, "..");
const read = relativePath => fs.readFileSync(path.join(root, relativePath), "utf8");

const index = read("index.html");
const app = read("app.js");
const world = read("world/script.js");
const publicSystem = read("PUBLIC_SYSTEM.md");
const workflow = read(".github/workflows/deploy-pages.yml");

test("the canonical public entry stays credential-free", () => {
  assert.match(index, /id="gateway"/);
  assert.match(index, /href="world\/"/);
  assert.match(index, /href="#the-table"/);
  assert.doesNotMatch(index, /type="email"|id="email"|\/api\/entry|entryToken/);
  assert.equal(fs.existsSync(path.join(root, "functions", "api", "entry.js")), false);
  assert.equal(fs.existsSync(path.join(root, "js", "identity-engine.js")), false);
});

test("the public entry preserves target-specific ecosystem content", () => {
  assert.match(index, /id="template-library"/);
  assert.match(index, /id="review-queue"/);
  assert.match(index, /id="donation-access-hub"/);
  assert.match(index, /id="awd"/);
  assert.match(index, /id="tnc"/);
});

test("copy and World unlock fallbacks remain local", () => {
  assert.match(app, /navigator\.clipboard/);
  assert.match(app, /document\.execCommand\('copy'\)/);
  assert.match(app, /finally\{\s*copyField\.remove\(\)/);
  assert.match(world, /unlockState\.scrollIntoView/);
  assert.doesNotMatch(world, /fetch\(|XMLHttpRequest|localStorage|sessionStorage/);
});

test("documentation and deployment describe the canonical split", () => {
  assert.match(publicSystem, /canonical Whole Donuts LLC code\s+ecosystem/);
  assert.match(publicSystem, /canonical public entry bundle/);
  assert.match(workflow, /node-version: 22/);
  assert.match(workflow, /node --test tests\/public-site\.test\.js/);
});
