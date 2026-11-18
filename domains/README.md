# Ecosystem-domain activation contract

The manifest records the intended role for every named ecosystem domain. A new
visitor arriving at any listed host goes first to
`https://wenevergonnaclose.com`, where the browser-only stick-figure experience
introduces the journey without collecting a name or public identity.

The domains are not interchangeable:

| Hosts | Role |
|---|---|
| `wholedonuts.app`, `.org`, `.buzz` | Whole Donuts youth side |
| `thenurturedchef.com`, `.org`, `.foundation` | The Nurtured Chef adult side |
| `wholedonuts.me` | Private Vault |
| `wholedonuts.pro` | Overview of both sides |
| `thenutur3dchef.com` | 3D design program |
| `thenutur3dchef.org` | Newest Copilot creation; name intentionally pending |
| All other listed domains | Hidden reserve until a specific protocol is approved |

`edge-redirect.js` is an edge-provider adapter, not a standalone security
system. Without `ACCESS_RESOLVER_URL`, it sends every request to the universal
entry. With the resolver deployed, only a server-verified private code may
receive a designated-side destination; unverified, missing, expired, or failed
code checks return to the universal entry.

See [`private-access-contract.md`](private-access-contract.md) before deploying
the resolver. GitHub Pages accepts one custom domain per site; do not copy this
domain list into `CNAME` or create competing Pages domain claims.
