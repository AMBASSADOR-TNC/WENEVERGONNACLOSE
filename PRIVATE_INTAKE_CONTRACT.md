# Private intake contract

## Purpose

This contract provides a safe, owner-directed path to examine material that may
help Whole Donuts grow: a selected file, folder, note, image, draft, fragment,
or other possible crumb. It is an intake and review boundary, not a discovery
engine, archive of personal devices, or public publishing system.

The public experience stays at `wenevergonnaclose.com`. Private intake is a
review-only **WD.INPUT** record. It cannot create a public route, account,
profile, submission endpoint, or protected-domain access path.

## WD.INPUT, WD.OUTPUT, and WD.ARCHIVE

| Protocol stage | Private-intake meaning | Allowed state |
|---|---|---|
| `WD.INPUT` | A person with authority narrowly selects one possible source for review. | Minimum provenance metadata only; no device scanning or automatic copying. |
| `WD.OUTPUT` | A reviewer approves a specific sanitized, rights-cleared derivative. | The derivative may follow the normal reviewed path to an eligible first-party static page or reference. Raw source never becomes output. |
| `WD.ARCHIVE` | The source is sensitive, private, rights-unclear, declined, or retained only for the owner. | Keep it in owner-controlled private storage; do not commit, publish, traverse, or automatically duplicate it. |

`bathroom-door-routing.json` records the protocol boundary. The Table and
Counter remain the only current gateway outputs. An intake item does not
become a lane destination merely because it was reviewed.

## What this contract does not authorize

Do not use this repository or its automation to:

- scan a computer, phone, tablet, drive, gallery, cloud account, or backup;
- monitor a device, run on startup, inspect future files, or collect material
  after a restart;
- bypass device, operating-system, cloud, account, or application permissions;
- copy every file from a device, extract hidden data, or infer a person's
  private thoughts, identity, health, finances, legal situation, location, or
  relationships;
- publish, train on, share, link, or make a derivative from material without a
  separate owner decision and review.

Only a person with authority over the source may deliberately select a narrow
scope for review. A source must never be treated as approved merely because it
exists on a device.

## Local staging boundary

`private-intake/` is a local staging path ignored by Git. It is for a small,
explicitly selected review package only; it is not a secure vault, encrypted
store, or device-backup location. Do not place credentials, private keys,
tokens, financial records, health records, identity documents, private
messages, complete galleries, device backups, or unreviewed copyrighted work
there.

Use an owner-controlled encrypted/private storage service for sensitive source
material. Bring only a sanitized derivative, a metadata record, or an approved
public-ready asset into this repository.

## Owner-selected review flow

1. **Select narrowly.** The owner identifies one source or a small named set,
   its device/location class, and why it may be useful. Do not traverse
   neighboring folders or unrelated device history.
2. **Record provenance.** Capture only the minimum non-sensitive metadata
   needed for review: owner assertion, creation context if known, source class,
   rights status, and intended Whole Donuts use. Do not copy raw private
   content into a public issue, commit, or chat.
3. **Screen for exclusion.** Reject or retain privately any source containing
   credentials, personal data, private communications, health/legal/financial
   records, unsafe material, third-party confidential data, or content whose
   rights are unclear.
4. **Create a minimal derivative.** When appropriate, make a redacted
   description, a rights-cleared excerpt, or a new original asset that conveys
   the useful idea without exposing the source.
5. **Human review.** Review provenance, rights, privacy, safety, accuracy,
   accessibility, cultural impact, and fit. The reviewer may approve, decline,
   defer, or request a safer derivative.
6. **Route deliberately.** An approved public derivative may become a guide,
   template, static page asset, or a reviewed future program material. It
   advances from WD.INPUT only after human approval; it does not become a
   Bathroom Door gateway output unless it is a tracked first-party static Table
   or Counter destination and meets the existing routing contract.
7. **Preserve the decision.** Keep a non-sensitive review record and source
   attribution where appropriate. Retain raw source material only in its
   owner-controlled private location, subject to that owner's retention
   decision.

## Images and creative material

An image can begin a review only when its owner deliberately selects it and
confirms it may be reviewed. Before any public use, review visible people,
minors, identifying locations, embedded metadata, trademarks, copyright,
consent, and cultural context. Prefer a newly created, consented, redacted, or
abstracted derivative over an original personal-gallery image.

No automatic gallery ingestion, image matching, face analysis, location
extraction, or background sync is allowed.

## Review labels

| Label | Meaning | Next action |
|---|---|---|
| `private-retain` | Sensitive, personal, or not intended for public review. | Keep outside the repository. |
| `rights-unclear` | Origin, permission, or reuse scope is unresolved. | Do not copy, publish, or derive. |
| `review-pending` | Narrow, owner-selected source awaiting human review. | Keep only minimum metadata in review records. |
| `derivative-ready` | A sanitized, rights-cleared derivative is ready for approval. | Review before repository addition. |
| `public-approved` | A reviewer approved a specific public derivative and use. | Add through the normal reviewed change path. |
| `declined` | It does not fit, cannot be used safely, or lacks rights. | Do not retain a public copy. |

## Relationship to the ecosystem

The Ecosystem Proto T manifest and Bathroom Door protocol remain authoritative
for public routing. This contract helps recover useful learning from the past
through WD.INPUT, WD.OUTPUT, and WD.ARCHIVE without opening private archives,
changing the gateway, or claiming that all material should be public. Privacy,
consent, provenance, and human judgment come before reuse.
