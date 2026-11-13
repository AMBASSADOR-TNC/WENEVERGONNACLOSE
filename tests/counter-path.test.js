const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const root = path.join(__dirname, "..");
const { validateRequest, buildRequest, MIN_WORDS } = require("../js/counter-path.js");

const words = n => Array.from({ length: n }, (_, i) => `word${i}`).join(" ");
const full = {
  gradYear: "2031",
  adultRole: "coach",
  principles: words(MIN_WORDS),
  effort: words(MIN_WORDS),
  sharing: words(MIN_WORDS),
  adultKnows: true
};

test("a complete request showing principles, effort and sharing is accepted", () => {
  assert.deepEqual(validateRequest(full), []);
  const text = buildRequest(full);
  assert.match(text, /Principles I understand/);
  assert.match(text, /Effort I kept up/);
  assert.match(text, /What I shared/);
  assert.match(text, /owner reviews every request/);
});

test("thin answers are sent back for more growth, not accepted", () => {
  const missing = validateRequest({ ...full, effort: "I tried" });
  assert.equal(missing.length, 1);
  assert.match(missing[0], /effort/);
});

test("a trusted adult must have read the request", () => {
  assert.match(validateRequest({ ...full, adultKnows: false }).join(" "), /adult you trust/);
});

test("the road page links back to The Table and The Table links to the road", () => {
  assert.match(fs.readFileSync(path.join(root, "counter-path.html"), "utf8"), /href="table\.html"/);
  assert.match(fs.readFileSync(path.join(root, "table.html"), "utf8"), /href="counter-path\.html"/);
});

test("the road page keeps the no-storage promise: no network calls, storage, or forms posted anywhere", () => {
  const js = fs.readFileSync(path.join(root, "js/counter-path.js"), "utf8");
  const html = fs.readFileSync(path.join(root, "counter-path.html"), "utf8");
  for (const forbidden of [/fetch\(/, /XMLHttpRequest/, /localStorage/, /sessionStorage/, /document\.cookie/, /sendBeacon/]) {
    assert.doesNotMatch(js, forbidden);
  }
  assert.doesNotMatch(html, /<form[^>]*action=/);
});

test("someone who can't type can show growth another way, with their adult", () => {
  const other = { mode: "other", otherWay: "Sign language video", adultKnows: true, principles: "", effort: "", sharing: "" };
  assert.deepEqual(validateRequest(other), []);
  assert.match(buildRequest(other), /Sign language video/);
  assert.match(validateRequest({ ...other, otherWay: "" }).join(" "), /which way/);
  assert.match(validateRequest({ ...other, adultKnows: false }).join(" "), /adult you trust/);
});

test("every page loads the access bar and access styles", () => {
  for (const page of ["index.html", "table.html", "counter.html", "counter-path.html", "guide.html", "world/index.html"]) {
    const html = fs.readFileSync(path.join(root, page), "utf8");
    assert.match(html, /access\.js/, `${page} needs the access bar`);
    assert.match(html, /access\.css/, `${page} needs the access styles`);
  }
});
