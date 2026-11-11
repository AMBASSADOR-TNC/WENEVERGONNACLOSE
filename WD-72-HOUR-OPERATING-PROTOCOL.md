mkdir -p code

cat > code/WD-72-HOUR-OPERATING-PROTOCOL.md <<'EOF'
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

## 3. OUTPUT STRUCTURE

runtime
