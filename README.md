# Wenevergonnaclose

Static, local-only entry page for `wenevergonnaclose.com`.

## Verified local capabilities

- Presents base-figure and emotion selections in the browser.
- Classifies a completed graduation-year entry as Youth or Adult using the browser's current year.
- Keeps selections only in the page's in-memory JavaScript state; it has no backend, persistence, or content collection.
- Holds the selected lane locally instead of navigating to an external destination.

## Launch safety

External destinations are not verified by this repository and must not be represented as live. Before enabling any external route, verify ownership, intended destination, reachability, and launch approval for that exact URL. Until a route has a verified record, it remains blocked and archived in [`bathroom-door-routing.json`](bathroom-door-routing.json).

The Bathroom Door records are metadata-only: `WD.INPUT` records local routing candidates, `WD.OUTPUT` contains only routes cleared to advance, and `WD.ARCHIVE` retains blocked records with factual reasons. The current `WD.OUTPUT` is intentionally empty.
