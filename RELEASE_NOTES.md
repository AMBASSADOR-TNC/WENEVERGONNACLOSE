# Whole Donuts Universe release notes

Use this format for each meaningful public update. Keep the first visit simple:
publish only what is available, link to the relevant guide, and leave every
suggestion optional.

## Unreleased

### Whole Donuts entry

**What changed:** The public entry is now a universal private sequence:
choose a base stick figure, current feeling, hoped-for feeling, graduation
year, and private email address. The registration API selects The Table for
the youth lane or The Counter for the adult lane, then issues a short-lived,
single-use token.

**Why it matters:** Visitors have one entry point without a name or public
profile. The destinations can reject direct access and admit only a valid,
one-time universal entry.

**Optional next choices:** Read the universal-entry guide, continue to the
approved lane, take a free item from the destination e-store, or pass
something useful to another person.

### Privacy and route corrections

**What changed:** The browser does not retain a registration record. The
server stores keyed hashes of the email address and source IP, an anonymous
stick-figure sequence, and the short-lived token required to enforce
single-use entry. The optional World returns guests to universal entry.

**Why it matters:** No name, public profile, photo, location, or sequence
history is exposed to other guests. The implementation currently limits a
submitted email address but does not verify control of that mailbox.

**Optional next choices:** Use the gateway, explore the World, reset its
temporary settings, or follow any present on-site path.

### Deployment boundary

**What changed:** The incompatible GitHub Pages deployment workflow was
removed. Production requires Cloudflare Pages Functions and D1, which provide
the same-origin registration API and keyed data storage.

**Why it matters:** GitHub Pages can serve static files but cannot run the
Functions or D1 binding required by universal entry. Removing that path avoids
publishing a gateway that appears available but always fails at registration.

**Optional next choices:** Before activation, configure the Cloudflare Pages
domain, D1 binding, `IDENTITY_HASH_SECRET`, and both destination token
consumers. Do not send guests to a destination that has not completed those
checks.

### Operations reliability

**What changed:** Funnel creation now validates a parsed domain before use, and
network activation or deactivation logs an individual funnel failure while
continuing the remaining funnels.

**Why it matters:** A malformed domain cannot cause a runtime index failure,
and one unavailable funnel does not stop the rest of a network operation.

**Optional next choices:** Operators can correct the reported funnel and rerun
the intended operation.
