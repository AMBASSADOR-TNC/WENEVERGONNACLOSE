# Wenevergonnaclose

`wenevergonnaclose.com` is a static, private browser-only entry for Whole
Donuts and The Nurtured Chef.

Guests choose a base stick figure, current feeling, hoped-for feeling, and
high school graduation year. Current and future graduation years enter
[The Table](table.html), while earlier graduation years enter
[The Counter](counter.html). The selections are held only in page memory for
the current visit; no name, email address, account, profile, analytics event,
or server request is created.

## What is available

- **The Table** is the Whole Donuts side with a free next step and a pass-it-on
  prompt.
- **The Counter** is the Nurtured Chef side with a free next step and a
  pass-it-on prompt.
- **The universal-entry guide** explains the public flow and professional
  boundaries.

Each side has a clearly marked e-store handoff placeholder. A real e-store link
must not be added until its owner verifies the destination, privacy terms, and
free-item experience.

## Important limits

This static site cannot enforce one entry per IP address or email address,
verify a mailbox, create a single-use token, or prevent someone from opening a
destination URL directly. Those capabilities require a separately deployed
and reviewed server-side service. The public site does not claim that they
exist.

## Delivery and checks

The site is compatible with the repository's current GitHub Pages delivery.
Configure `wenevergonnaclose.com` as the Pages custom domain and enable HTTPS
in the Pages settings before treating the public entry as live.

The `Test` workflow runs `node --test tests/identity-engine.test.js` and an
offline static Pages deployment-contract check on every pull request and on
updates to `main`. The Pages check validates only repository content: the
custom-domain file, public entry assets, and domain metadata. It does not
perform DNS or TLS checks, so it does not interfere with certificate
remediation.

Configure `Test / Identity engine tests` and `Test / Pages deployment readiness`
as required status checks for `main`. This repository currently has one
administrator, so it should not require an approval until an independent
reviewer has been added.

## Legacy-domain routing

The requested Whole Donuts, The Nurtured Chef, The Nutur3d Chef, and
JustTryPlusUSA hosts are catalogued in
[`domains/domain-routing-manifest.json`](domains/domain-routing-manifest.json).
Every first visit is routed to the universal entry; each host then has its own
designated-side, Vault, overview, program, or hidden-reserve role. Returning
private-code access requires a reviewed server-side resolver. The current
browser-only entry does not pretend to provide that security boundary.
