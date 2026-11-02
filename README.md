# Whole Donuts Universe

This repository is the consolidated home for the Whole Donuts Universe.

## Public site

The repository root contains the static GitHub Pages bundle for
`wenevergonnaclose.com`:

- `index.html`, `guide.html`, `PUBLIC_SYSTEM.md`, `styles.css`, and `app.js`
  provide the one public Whole Donuts entry, system map, curation policy, and
  +U experience.
- `CNAME` declares `wenevergonnaclose.com` as the custom domain.
- The +U gateway is a four-tap, progressive route: broad Youth or
  Adult side, a face-only feeling, one of three bounded non-sensitive needs,
  and an available on-site destination. Its 14 original Youth and 14 original
  Adult stick-figure companions are visual-only. All four temporary choices
  exist only in page memory, clear on restart, skip, back, or onward navigation,
  and are never sent, tracked, or stored. The gateway never asks for an exact
  age or birth date, name, email, face image, photo, location, account, or
  sensitive information.
- The optional +U World keeps visual pose and color choices only in page
  memory. They clear on reset or reload and are never sent, tracked, or stored.
- The browser-only +U review queue renders the small, curated
  `review-queue-manifest.js` list already shipped with the site. It has no
  filesystem access, GitHub API access, network scanning, automatic
  publishing, or automatic merging. Every candidate is review-only and shows
  its source reference, category, provenance, rights status, review status,
  and manual next step. The queue also documents excluded sources and why they
  are not eligible.

### Refreshing the review queue

Maintainers refresh the queue through the normal local/repository workflow:

1. Review a public, tracked source manually and edit
   `review-queue-manifest.js` locally.
2. Keep each candidate's `title`, `source`, `category` (`draft`, `image`, or
   `crumb`), `provenance`, `rights`, `reviewStatus`, and `nextStep` accurate
   and specific. Record uncertain or ineligible sources in
   `WHNUTZ_REVIEW_QUEUE_EXCLUSIONS` with a clear reason.
3. Review and merge the manifest change normally. A human must complete every
   stated next step; the site never discovers candidates, changes sources,
   publishes material, or merges work automatically.

  The public site creates no visitor identifier, return pass, profile, or
  visit record. Daily SEO and learning targets remain outside the public site
  in access-controlled operations and require explicit human activation and
  release review.

  The public SEO Crumb Saver treats deliberate public pages, guides, templates,
  and canonical invitations as discovery entry points for reviewed knowledge. It
  does not collect a visitor profile or submit material from this static site.
  The root uses canonical, robots, sitemap, social-preview, and factual WebSite
  metadata. The non-deployed [SEO Crumb Saver operating model](config/seo-crumb-saver-operating-model.md)
  requires human review of aggregate visibility and prohibits tracking, scraping,
  credentials, rank manipulation, and automatic publishing.

The [`deploy-pages` workflow](.github/workflows/deploy-pages.yml) publishes
the reviewed public bundle only when a maintainer dispatches it manually. It
stages only named public static files, including the exact
`CNAME`, and excludes Go operations configuration and local credentials. In
**Settings -> Pages**, select **GitHub Actions** as the source and set the
custom domain to `wenevergonnaclose.com`; GitHub provides the required DNS and
verification instructions. The workflow verifies the deployed revision through
the GitHub Pages URL, so custom-domain DNS propagation does not make a valid
deployment look failed. Any future domain or DNS change requires a separate
reviewed operational change.

### Public system and curation policy

[`PUBLIC_SYSTEM.md`](PUBLIC_SYSTEM.md) is the public system map and maintainer
curation policy. It identifies available local public paths, unavailable areas,
external exits, the privacy boundary, and the human-only process for considering
eligible original or permitted public material. It does not authorize
collection, automated intake, publication, GitHub actions, or merges.

### Companion repository reconciliation

Universe is the single canonical public bundle. The Sunshine repository is
recorded only as a public source/provenance reference pending an owner-confirmed
reuse grant; its code, text, imagery, configuration, and legacy Pages fallback
are not imported or linked as a canonical destination. WHNutz and the merch
platform remain separate: their differing source material, operational
configuration, authentication, and commerce surfaces require explicit rights,
privacy, safety, and owner review before any future sanitized derivative can be
considered. No companion repository implies that an internal asset, storefront,
submission channel, or service is live.

## Operations tooling

The Go 1.21 funnel and domain operations project remains in `cmd/`, `pkg/`,
`config/`, `workflows/`, and `projects/`. It is separate from the static Pages
site. See [SETUP.md](SETUP.md) and [README_FUNNELS.md](README_FUNNELS.md) for
operational setup; keep credentials in local environment files or GitHub
Actions secrets, never in the repository.

## Donation Access Hub and Rewards Center

The public Donation Access Hub is an interface and policy, not a payment
processor, wallet, fund-transfer system, automatic billing system, or
automatic allocation system. A visitor must select a voluntary support purpose,
review the processor and payee, and affirm a final action before an external
payment link is revealed. Store purchases remain separate merchant
transactions, not donations. The Share & Invitation Protocol creates a
non-sensitive ecosystem link only when a visitor explicitly shares or copies
it; it does not track recipients or create referral, payment, or reward records.
Cash App and Chime to `$wholedonuts` are the only allowed manual provider
routes. Cash App is the consent-gated optional external exit. Chime has no
universal public payment URL, so the same gate reveals only an instruction to
open the official Chime app, enter the ChimeSign, and optionally copy it;
copying never initiates a payment or transfer. No other provider is part of
this model.

Real accounting, charity or tax treatment, refunds, merchant-of-record
responsibilities, and reward eligibility require decisions by the responsible
entity and configured providers. See the non-deployed
[Donation Access Hub operating model](config/donation-access-operating-model.md)
for operational constraints.

The public Crumb Saver protocol and contribution template remain available, but
the current static Pages configuration contains no approved submission runtime.
Its form is visibly unavailable and accepts no text, so it cannot discard a
submission. Do not link a separate Crumb Saver endpoint unless its owner
supplies and verifies it.

## Consolidation and learning

Universe is the verified system of record for material that has completed
intake; it does not claim that all legacy or private material has migrated.
The non-deployed [consolidation and learning model](config/consolidation-learning-model.md)
defines classification, preserve-before-remove provenance, reviewed learning
loops, and staged legacy retirement. It prohibits automatic publishing,
deletion, payment, credential import, and private-data import.
