# WHOLE DONUTS - WD 72-HOUR OPERATING PROTOCOL

## MASTER RULE

SYSTEM OPERATES
-> VALIDATE
-> WD.INPUT
-> CLEANUP AND CLASSIFICATION
-> VERIFY
-> 72-HOUR STABLE OPERATION
-> REVIEW
-> REVISE ONLY IF NEEDED
-> REVALIDATE
-> FINALIZE
-> PORKBUN LAST

---

## 1. OPERATE FIRST

Before recovered IP is allowed to affect production:

- Confirm the current system operates.
- Confirm the universal entry works.
- Confirm Youth routing works.
- Confirm Adult routing works.
- Confirm fallback behavior works.
- Confirm validation is green.
- Confirm rollback is available.
- Preserve the last known good state.

Do not introduce recovered material directly into production.

---

## 2. WD.INPUT

WD.INPUT is the cleanup and classification gate.

Authorized recovered material enters:

runtime/WD.INPUT/

WD.INPUT must:

- preserve originals;
- inventory each item;
- calculate file hashes;
- identify exact duplicates;
- preserve source lineage;
- quarantine unsupported material;
- separate unresolved material;
- send reviewable material to WD.OUTPUT/CANDIDATES;
- create reports in WD.REPORTS.

WD.INPUT must NOT:

- automatically publish recovered material;
- overwrite verified production files;
- delete original IP;
- expose credentials;
- bypass validation;
- bypass human review.

---

---

## 3. OUTPUT STRUCTURE

```
runtime/
  WD.INPUT/              authorized recovered copies (never the only original)
  WD.ARCHIVE/            duplicates, quarantined items, unresolved lineage
  WD.OUTPUT/CANDIDATES/  review area only; nothing here publishes itself
  WD.REPORTS/            intake manifests, observation log, 72-hour review
```

Candidate means reviewable, not production-approved.

---

## 4. THE 72-HOUR CLOCK

The clock begins only after:

1. the base system passes validation;
2. the authorized WD.INPUT batch is entered;
3. intake completes;
4. the intended public routes are confirmed.

During the window, freeze core routing unless a critical failure requires rollback.

- Hour 0: record commit IDs, run results, public route results and the intake report name.
- Hours 1-24: check entry, Youth, Adult and fallback routes; record errors without feature changes.
- Hours 25-48: repeat the checks and review duplicate and conflict classifications.
- Hours 49-72: repeat the checks, confirm no unexplained drift, prepare the revision decision.
- After hour 72: revise only documented problems; otherwise freeze the verified base and add future capabilities one reviewed piece at a time.

---

## 5. STOP AND ROLLBACK

Stop when:

- a required current file disappears;
- Youth or Adult routes resolve incorrectly;
- credentials or private information appear in a repository or report;
- validation turns red or a workflow cannot parse the configuration;
- an intake file overwrites a verified production file;
- unexpected DNS or HTTPS behavior appears.

Then: stop new merges, preserve logs, return to the last known good commit, diagnose from reports, and restart the observation clock only after the verified correction is deployed.

---

## 6. 72-HOUR DECISION

Classify every revision as critical, necessary, optional or rejected. Approve only revisions supported by a recorded failure, conflict, routing issue, validation result or meaningful recovered asset. Create a new branch, implement the smallest correction, validate it, merge it, and begin a fresh observation period when the correction affects production behavior.

---

## 7. PORKBUN LAST

Only after upstream repositories, routes, hosting and HTTPS are verified should final DNS changes be considered. Do not overwrite working DNS as a routine launch step.
