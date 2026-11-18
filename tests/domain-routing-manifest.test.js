const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const root = path.join(__dirname, "..");
const manifestPath = path.join(root, "domains", "domain-routing-manifest.json");
const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));

const expectedRoles = {
  "wholedonuts.app": "youth-side",
  "wholedonuts.org": "youth-side",
  "wholedonuts.buzz": "youth-side",
  "thenurturedchef.com": "adult-side",
  "thenurturedchef.org": "adult-side",
  "thenurturedchef.foundation": "adult-side",
  "wholedonuts.me": "private-vault",
  "wholedonuts.pro": "two-side-overview",
  "thenutur3dchef.com": "3d-design-program",
  "thenutur3dchef.org": "newest-copilot-creation-name-pending",
  "wholedonuts.foundation": "hidden-reserve",
  "wholedonuts.cloud": "hidden-reserve",
  "thenurturedchef.buzz": "hidden-reserve",
  "justtryplususa.com": "hidden-reserve",
  "justtryplususa.org": "hidden-reserve"
};

test("the ecosystem-domain contract assigns every requested host one intended role", () => {
  const actualRoles = Object.fromEntries(
    manifest.domains.map(({ host, role }) => [host, role])
  );

  assert.deepEqual(actualRoles, expectedRoles);
});

test("first visits enter universally and returning visitors require server verification", () => {
  assert.equal(manifest.universal_entry, "https://wenevergonnaclose.com");
  assert.equal(manifest.first_visit_action, "redirect-to-universal-entry");
  assert.equal(manifest.return_visit_action, "require-server-verified-private-code");
  assert.equal(manifest.privacy_contract.public_identity_collection, false);
  assert.equal(manifest.privacy_contract.welcome_representation, "stick-figure-only");

  for (const domain of manifest.domains) {
    assert.equal(
      domain.access_policy,
      "first-visit-universal-entry-then-private-code"
    );
  }
});

test("the edge adapter cannot grant protected access without the resolver", () => {
  const handler = fs.readFileSync(path.join(root, "domains", "edge-redirect.js"), "utf8");

  assert.match(handler, /if \(!env\.ACCESS_RESOLVER_URL\)/);
  assert.match(handler, /access\.status !== "granted"/);
  assert.match(handler, /destination\.protocol !== "https:"/);
  assert.match(handler, /managedHosts\.has\(destination\.hostname\)/);
  assert.match(handler, /universalEntryRedirect/);
});
