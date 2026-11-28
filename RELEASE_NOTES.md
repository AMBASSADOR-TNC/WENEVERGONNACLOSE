# Whole Donuts Universe release notes

Use this format for each meaningful public update. Keep the first visit simple:
publish only what is available, link to the relevant guide, and leave every
suggestion optional.

## Unreleased

### One-screen rebuild

**What changed:** The public site is now one screen at a time — Gateway,
Table, Library, Counter, Menu, Sides, and Leave — with the rest hidden, so
nobody is overwhelmed. TheWhisper is a persistent dock on every screen (10
full listens per visit), with the cast voices and the walk player brought in
from the beta prototype. Crumbs can now be saved on the visitor's own device
and appear in the review queue as browser-only candidates; nothing is sent
anywhere, and publication stays human-reviewed. The Leave screen generates a
personal QR to the correct .buzz store (Youth → wholedonuts.buzz,
Adult → thenurturedchef.buzz), honestly labeled "opens soon" until the stores
are live. The donation link carries a real address, the Counter and Table
pages have exits, the mission footer no longer loops on itself, the system-map
link points at the real system map, and Read aloud now reads the visible
screen a sentence at a time with a real voice choice. Whole Donuts stays
white, The Nurtured Chef stays black, electric blue and silver throughout —
no gold, no red, no navy. Phone rotation fills the screen in portrait and
landscape.

**Why it matters:** A visitor can now arrive, find a next step, leave a
crumb, and leave with a route — instead of hitting a dead end.

**Optional next choices:** The .buzz stores still serve nothing, so the QR
is a kept route, not a live store. The gate and holiday page (Muse artifacts,
not this repository) still need their own connector fixes.

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
