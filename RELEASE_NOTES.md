# Whole Donuts Universe release notes

Use this format for each meaningful public update. Keep the first visit simple:
publish only what is available, link to the relevant guide, and leave every
suggestion optional.

## Unreleased

### Repository home cleanup

**What changed:** Removed empty cache/rebuild placeholders, an unused storefront
configuration stub, and obsolete archived routing metadata. Necessary operating
folders and every file used by the public site, tests, deployment, guides, and
templates remain.

**Why it matters:** The repository home now shows only active public content or
files that support current and planned system operation.

**Optional next choices:** None. The cleanup does not change visitor routes or
public behavior.

### Canonical ecosystem integration

**What changed:** The target's full privacy-safe gateway and ecosystem archive
are restored as the canonical `wenevergonnaclose.com` experience. Direct paths
now make the Universe primary and the local +U World optional. The conflicting
email registration and one-time-token entry service were removed from the
public bundle.

**Why it matters:** The public entry is quiet and credential-free while useful
target-specific guides, templates, archive material, and carefully disclosed
optional support paths remain available.

**Optional next choices:** Use the four-tap gateway, browse the Table directly,
or open the local World. No account or personal information is required.

### Interaction reliability

**What changed:** Entering the World now reveals and scrolls to its active
customizer. Copy controls use the modern Clipboard API first and a local
browser fallback when that API is unavailable or blocked.

**Why it matters:** Figure unlocking and voluntary copy actions provide visible
results across more browsers without adding tracking or a data service.

### Whole Donuts entry

**What changed:** The public entry is now a progressive four-tap +U gateway:
choose a broad Youth or Adult side, a face-only feeling, a bounded need, and
an available on-site destination. It presents 14 original visual-only
stick-figure companions per side and routes directly to The Table, The Counter,
or the +U Library.

**Why it matters:** Visitors get a personal-feeling, legible starting point
without an account, demographic profile, rewards system, persistent choices,
or an unverified external destination.

**Optional next choices:** Open a guide, explore the World, visit a community
path, or return later. No action is required.

### Privacy and route corrections

**What changed:** The site no longer creates a persistent +U return pass or
visit record. The optional World uses only temporary page-memory visual
settings, includes a reset control, and returns to The Table through the
canonical same-site route. Gateway destination messages now remain visible
after routing.

**Why it matters:** No public interaction creates a visitor identifier,
profile, stored free-text response, or hidden routing dead end.

**Optional next choices:** Use the gateway, explore the World, reset its
temporary settings, or follow any present on-site path.

### Pages delivery

**What changed:** The `deploy-pages` workflow now deploys the reviewed static
bundle only after a maintainer manually dispatches it. It copies a named
public-file allowlist, including the root entry, guides, templates, and
`world/` files, and verifies that the deployed `CNAME` remains exactly
`wenevergonnaclose.com`.

**Why it matters:** The public site has one deployable source of truth without
publishing unrelated repository files.

**Optional next choices:** After a human-reviewed merge, a maintainer can
confirm the separate GitHub Pages source and custom-domain verification, then
dispatch and review the workflow run. Visitors do not need to do anything.

### Operations reliability

**What changed:** Funnel creation now validates a parsed domain before use, and
network activation or deactivation logs an individual funnel failure while
continuing the remaining funnels.

**Why it matters:** A malformed domain cannot cause a runtime index failure,
and one unavailable funnel does not stop the rest of a network operation.

**Optional next choices:** Operators can correct the reported funnel and rerun
the intended operation.
