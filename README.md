# Whole Donuts Universe

This repository is the canonical public entry bundle for
[`wenevergonnaclose.com`](https://wenevergonnaclose.com/). The broader Sunshine
repository is the canonical Whole Donuts LLC code ecosystem; reviewed public
intent and compatible fixes are integrated here without turning internal source
or operations into public destinations.

## Public experience

- `index.html`, `styles.css`, and `app.js` provide the credential-free +U
  gateway, Table, Counter, library, reviewed archive, and optional support
  disclosures.
- `world/` provides an optional local stick-figure experience. Its pose and
  color choices stay in page memory and clear on reset or reload.
- `guide.html`, `PUBLIC_SYSTEM.md`, `WHOLE_DONUTS_GUIDE.md`, and the tracked
  templates document public paths and their privacy boundaries.
- `review-queue-manifest.js` contains curated review metadata already shipped
  with the site. The browser does not discover repositories, scan networks, or
  publish changes.

The public bundle has no account, email registration, analytics, tracker,
profile, or submission runtime. Gateway and World choices are temporary and
are not sent or stored. Repository links are not primary visitor actions.

## Deployment

The manual [`Deploy Pages`](.github/workflows/deploy-pages.yml) workflow uses
Node.js 22 to syntax-check the public scripts and run the public contract tests.
It then stages only its named static-file allowlist and verifies that `CNAME`
is exactly `wenevergonnaclose.com`.

In **Settings -> Pages**, select **GitHub Actions** as the source and keep the
custom domain configured and verified. Dispatch only after the reviewed
revision is on `main`, then confirm the generated Pages deployment and custom
domain are healthy.

## Maintainer boundaries

Read [`PUBLIC_SYSTEM.md`](PUBLIC_SYSTEM.md) before changing public behavior.
Preserve the credential-free entry, same-site canonical paths, human-reviewed
publication, and truthful availability labels. Do not add credentials,
analytics, automatic intake, automatic publication, or internal operational
configuration to the public artifact.
