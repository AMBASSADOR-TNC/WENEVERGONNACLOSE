# Wenevergonnaclose

The universal, private entry point for `wenevergonnaclose.com`.

Guests select a stick-figure sequence and provide a high school graduation year. Current and future graduation years enter **The Table** (the Whole Donuts side) after an under-college confirmation. Earlier graduation years enter **The Counter** (the Nurtured Chef side). The browser sends no names or public identity.

## Routes

- The Table: `https://wholedonuts.cloud/table`
- The Counter: `https://wholedonuts.cloud/counter`

Both destination sites receive an opaque, one-time `entry` token and `exit=estore`. They must validate the token before admitting the guest, and they must send each guest to that side's e-store when the guest exits. The e-store may offer free items; it must not require a purchase.

## Required registration service

This repository includes [Cloudflare Pages Functions](functions/api) and a [D1 schema](db/schema.sql) for the registration service. The static client deliberately refuses to route guests until `POST /api/entry` is available.

The endpoint must:

1. accept only `email`, `graduationYear`, `lane`, `underCollegeConfirmed`, and the anonymous stick-figure `sequence`;
2. normalize the email and store a server-side keyed hash, never a public email or name;
3. derive and store a server-side keyed hash of the source IP;
4. reject an email or IP hash already used for universal entry;
5. issue a short-lived, single-use opaque `entryToken` only after successful registration; and
6. return `{ "entryToken": "...", "lane": "table" }` or `{ "entryToken": "...", "lane": "counter" }`.

The registration function implements the one-entry policy with unique, server-side keyed email and IP hashes. Browser storage, client-side hashing, and query parameters alone cannot reliably limit an email account or IP address.

### Deploying the registration service

1. Create a Cloudflare D1 database and execute `db/schema.sql`.
2. Deploy this repository with Cloudflare Pages, binding the D1 database as `DB`.
3. Configure `IDENTITY_HASH_SECRET` as a secret; do not commit it.
4. Route `wenevergonnaclose.com` through that Pages project so `/api/entry` receives `CF-Connecting-IP`.

The Table and Counter must consume a received entry by calling `POST https://wenevergonnaclose.com/api/entry/consume` server-to-server with `{ "entryToken": "...", "lane": "table" }` or `{ "entryToken": "...", "lane": "counter" }`. A successful response is the only permission to admit the guest. They must reject direct entry without it and send the guest to the proper side's e-store at exit.
