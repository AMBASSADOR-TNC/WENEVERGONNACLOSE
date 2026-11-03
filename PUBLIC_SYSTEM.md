# Whole Donuts Universe public system

`https://wenevergonnaclose.com/` is the single public entry for Whole Donuts
and The Nurtured Chef. This document is the source-of-truth map for the
universal-entry contract, its privacy boundary, and the conditions required
before a destination may accept a guest.

## Public paths

| Path | Available now | Boundary |
|---|---|---|
| Universal entry | Yes in source. Guests select an anonymous stick-figure sequence, graduation year, and email address. | It does not ask for a name or create a public profile. |
| The Table | Configured as the youth lane. | It may admit a guest only after server-side validation of a short-lived, single-use token. |
| The Counter | Configured as the adult lane. | It may admit a guest only after server-side validation of a short-lived, single-use token. |
| E-store exit | Required destination behavior. | Each side must provide its own truthful e-store destination; purchase remains optional. |
| Professional guide | Yes. `guide.html`, this document, and `README.md` describe the implemented contract. | They are operational documentation, not a credential, certification, or 14-level curriculum. |
| +U World and library material | Legacy public learning material. | It must return visitors to universal entry and must not bypass token validation. |

## Privacy and safety boundary

The browser stores no registration record, public profile, or name. It sends a
private email address, graduation year, lane, and anonymous stick-figure
sequence only to the same-origin registration API. The API stores keyed hashes
of the email address and source IP, the anonymous sequence, and a single-use
token. It does not establish mailbox ownership: a verified-email feature must
be added and reviewed before any email-account claim is made.

Do not expose names, email addresses, IP addresses, tokens, or sequences to
other guests. Do not add analytics, profiling, network scanning, automatic
content intake, automatic publication, or automatic merges. A future
capability is not public until it is explicitly implemented, reviewed, and
truthfully labeled.

The Cloudflare Pages deployment must bind D1 as `DB`, configure
`IDENTITY_HASH_SECRET`, and serve the custom domain before `/api/entry` is
available. GitHub Pages cannot host the required Functions or D1 binding and
is not an approved production host for this system.

## Companion repository reconciliation

Universe is the only canonical public bundle and
`wenevergonnaclose.com` is its only canonical public entry. This
reconciliation records source boundaries without importing companion source
contents or representing internal material as live:

| Companion scope | Reconciliation decision | Owner action before any future public use |
|---|---|---|
| `wholedonuts-sunshine` public repository | Metadata and provenance only. Its repository has no detected license or documented reuse grant, so its text, code, imagery, configuration, Pages fallback, and templates are not copied or treated as canonical. | Confirm the original source and explicit reuse scope, then approve a separately reviewed derivative if appropriate. |
| `WHNutz` | Excluded pending rights, privacy, safety, and provenance review. Canonical templates that happen to match are already shipped from Universe; differing source bundles, creative assets, funnel, authentication, and operations material are not migrated. | Record a written rights and safety decision for any proposed sanitized derivative. |
| `wholedonuts-merch-platform` | Excluded from the public bundle. No verified public HTTPS storefront is configured; dashboard, catalog, order, provider, API, deployment, and asset surfaces are not public routes. | Verify a live destination, ownership, rights, privacy, operational readiness, and truthful consumer terms before considering a clearly labeled link. |

The public site may cite the [Sunshine repository](https://github.com/thewholedonuts-beep/wholedonuts-sunshine)
only as an attributable source reference. It must keep the canonical site and
same-site routes as the visitor destination, never an older companion Pages
deployment. This does not imply that every internal asset or capability is
available to the public.

## Human-reviewed source curation

Community learning material may come only from explicitly submitted original
work or permitted public contributions. A contribution must be voluntary and
sent through an owner-approved reviewed channel; the public static site is not
that channel.

Before a maintainer adds material to a public page, template, or queue, they
must:

1. Confirm the item is original or has explicit, adequate permission for the
   intended public reuse.
2. Record a minimal source reference, provenance, rights status, review status,
   attribution requirement, and the manual next step.
3. Review privacy, safety, accuracy for the stated use, accessibility, and
   usefulness. Remove or decline material that includes private, sensitive,
   operational, deceptive, harmful, or unclear-rights content.
4. Keep Sunshine templates and protocol references metadata-only with `needs
   owner review` until explicit reuse rights are documented.
5. Keep WHNutz material, merch material, operational documents, repository
   contents, secrets, and configuration out of public-source candidates unless
   a separate explicit rights and safety decision makes a sanitized derivative
   eligible.
6. Make the proposed change locally, complete repository review, and merge
   only after required checks pass. Production deployment requires a separate
   Cloudflare Pages configuration review.

The review queue is a shortlist for this process, not a feed. It must never
discover sources, read a repository, scan a network, create a submission,
change a source, publish material, or merge a change automatically.

## Maintainer release checklist

For an eligible public addition, update the relevant public page or template,
this system map when availability changes, and the release notes. Before
production activation, confirm the Cloudflare Pages custom domain, D1 binding,
secret, API health, Table token consumer, Counter token consumer, and each
side's e-store exit.
