# Whole Donuts Universe release notes

## Unreleased

### Static universal entry

**What changed:** The public entry is a browser-only, four-part stick-figure
and graduation-year sequence. It sends current and future graduation years to
the first-party Table page and earlier graduation years to the first-party
Counter page.

**Why it matters:** The live GitHub Pages host can serve this flow without a
missing API, account system, email collection, or unverified external
destination.

**Limits:** The static product cannot enforce one visit per IP or email,
validate mailbox ownership, issue single-use tokens, or block direct page
access. It does not claim to do so.

### E-store readiness

**What changed:** The Table and Counter each describe an explicit e-store
handoff instead of linking to an unverified store.

**Why it matters:** Guests can take a free next step and pass one forward now,
while a future store link remains blocked until its owner verifies the
destination and terms.
