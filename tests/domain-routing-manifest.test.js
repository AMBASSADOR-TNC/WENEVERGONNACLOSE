const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const manifestPath = path.join(__dirname, "..", "domains", "domain-routing-manifest.json");
const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));

const requestedDomains = [
  "wholedonuts.app",
  "wholedonuts.org",
  "wholedonuts.buzz",
  "wholedonuts.me",
  "wholedonuts.pro",
  "wholedonuts.foundation",
  "wholedonuts.cloud",
  "thenurturedchef.com",
  "thenurturedchef.org",
  "thenurturedchef.buzz",
  "thenurturedchef.foundation",
  "thenutur3dchef.com",
  "thenutur3dchef.org",
  "justtryplususa.com",
  "justtryplususa.org"
];

test("the legacy-domain contract covers every requested host exactly once", () => {
  const hosts = manifest.domains.map(({ host }) => host);

  assert.deepEqual([...hosts].sort(), [...requestedDomains].sort());
  assert.equal(new Set(hosts).size, hosts.length);
});

test("every legacy host is gated before redirecting to the canonical entry", () => {
  assert.equal(manifest.canonical_entry, "https://wenevergonnaclose.com");
  assert.equal(manifest.redirect_status, 308);
  assert.equal(manifest.activation_gate.length, 4);

  for (const domain of manifest.domains) {
    assert.equal(domain.desired_action, "redirect-to-universal-entry");
  }
});
