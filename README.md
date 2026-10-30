# Wenevergonnaclose

Static, local-only identity-engine entry page. It lets a visitor select a figure,
present and future emotions, and a graduation year to receive a local lane
classification. The page does not persist selections or navigate to external
sites.

## Verified local capabilities

- Presents base-figure and emotion selections in the browser.
- Rotates accessible +U entry messages on page load and when the chosen base figure changes. Messages do not repeat during one page visit; after the finite set is used, the last message remains. Rotation is not persisted across reloads.
- Classifies a completed graduation-year entry as Youth or Adult using the browser's current year.
- Keeps selections only in the page's in-memory JavaScript state; it has no backend, persistence, or content collection.
- Holds the selected lane locally instead of navigating to an external destination.

## Launch safety

External destinations are not verified by this repository and must not be represented as live. This repository does not certify a custom-domain or GitHub Pages launch. Before enabling any external route, verify ownership, intended destination, reachability, and launch approval for that exact URL. Until a route has a verified record, it remains blocked and archived in [`bathroom-door-routing.json`](bathroom-door-routing.json).

The Bathroom Door protocol is metadata-only: `WD.INPUT` validates only values entered in the page and the registry records local routing candidates; `WD.OUTPUT` returns only the local Youth or Adult classification and contains no destination; `WD.ARCHIVE` retains blocked records with factual reasons. No protocol record includes visitor selections, graduation year, identifiers, or other user data. The current registry `WD.OUTPUT` is intentionally empty.

Routing rule: a verified destination may be enabled only after a reviewed change
names it and confirms its verification. Missing or unverified destinations remain
blocked and never cause a browser redirect.
