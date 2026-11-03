const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const root = path.join(__dirname, "..");

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

test("the Pages deployment contract has the custom domain and public entry assets", () => {
  assert.equal(read("CNAME").trim(), "wenevergonnaclose.com");

  for (const relativePath of [
    "index.html",
    "table.html",
    "counter.html",
    "guide.html",
    "world/index.html",
    "css/identity.css",
    "js/identity-engine.js",
    "robots.txt",
    "sitemap.xml"
  ]) {
    assert.equal(fs.existsSync(path.join(root, relativePath)), true, `${relativePath} must be published`);
  }
});

test("the public metadata consistently identifies the configured Pages domain", () => {
  const domain = "wenevergonnaclose.com";

  assert.match(read("robots.txt"), new RegExp(`Sitemap: https://${domain}/sitemap\\.xml`));
  assert.match(read("sitemap.xml"), new RegExp(`https://${domain}/`));
  assert.match(read("guide.html"), new RegExp(`https://${domain}/guide\\.html`));
  assert.match(read("world/index.html"), new RegExp(`https://${domain}/world/`));
});
