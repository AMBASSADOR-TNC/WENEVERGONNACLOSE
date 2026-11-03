# Legacy-domain activation contract

`domain-routing-manifest.json` is the source of truth for the requested Whole
Donuts, The Nurtured Chef, The Nutur3d Chef, and JustTryPlusUSA domains. Every
listed host has one intended public action: a permanent `308` redirect to the
universal entry at `https://wenevergonnaclose.com`, preserving its path and
query string.

The manifest does not configure a registrar, create a certificate, or claim a
domain is live. Each host must pass every activation gate before it is sent to
the edge redirect:

1. Confirm ownership in the registrar account.
2. Point DNS for that one host to the chosen edge provider.
3. Wait for a valid HTTPS certificate for the source host.
4. Verify that `https://wenevergonnaclose.com` is available over HTTPS.
5. Deploy `edge-redirect.js` with the manifest and verify the resulting `308`
   response preserves a representative path and query.

GitHub Pages accepts one custom domain per site. Do not copy these domains into
this repository's `CNAME` file and do not add another Pages custom-domain
claim. Use an edge provider that can terminate HTTPS for the activated legacy
host, then run the redirect worker there.

`wholedonuts.cloud` currently serves an interim site. Its record remains
planned until the canonical HTTPS entry is available; do not redirect it early
and strand visitors at an unissued certificate.
