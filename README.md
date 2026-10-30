# Wenevergonnaclose

Static, local-only identity-engine entry page. It lets a visitor select a figure,
present and future emotions, and a graduation year to receive a **local lane
classification**. The page does not persist selections or navigate to external
sites.

## Launch safety

External destinations are intentionally blocked until each destination, its
ownership, and its deployment status are independently verified. This repository
does not certify a custom-domain or GitHub Pages launch.

The page follows this Bathroom Door safety baseline:

- `WD.INPUT` validates only the values already entered in the page. It does not
  transmit or retain them.
- `WD.OUTPUT` returns a local `youth` or `adult` classification.
- `WD.ARCHIVE` creates a metadata-only blocked-routing record when an external
  destination is missing or unverified. It contains no visitor selections,
  graduation year, identifiers, or other user data.

Routing rule: a verified destination may be enabled only after a reviewed change
names it and confirms its verification. Missing or unverified destinations remain
blocked and never cause a browser redirect.
