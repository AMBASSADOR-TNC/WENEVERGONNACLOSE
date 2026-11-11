#!/usr/bin/env python3

import argparse
import hashlib
import json
import shutil
from datetime import datetime, timezone
from pathlib import Path


def digest(path):
    h = hashlib.sha256()
    with path.open("rb") as f:
        for block in iter(lambda: f.read(1024 * 1024), b""):
            h.update(block)
    return h.hexdigest()


def main():
    parser = argparse.ArgumentParser(
        description="Non-destructive WD.INPUT inventory and deduplication"
    )
    parser.add_argument("--root", default=".")
    args = parser.parse_args()

    root = Path(args.root).resolve()

    cfg = json.loads(
        (root / "code/wd-system/wd-config.json").read_text()
    )

    inp = root / cfg["input_dir"]
    arc = root / cfg["archive_dir"]
    out = root / cfg["output_dir"]
    rep = root / cfg["reports_dir"]

    for folder in (inp, arc, out, rep):
        folder.mkdir(parents=True, exist_ok=True)

    stamp = datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%SZ")

    rows = []
    seen = {}

    for file in sorted(x for x in inp.rglob("*") if x.is_file()):
        sha = digest(file)

        status = "candidate"
        reason = "unique file; manual review required"

        if file.suffix.lower() not in cfg["allowed_extensions"]:
            status = "quarantine"
            reason = "extension not allowlisted"

        elif sha in seen:
            status = "duplicate"
            reason = f"exact duplicate of {seen[sha]}"

        else:
            seen[sha] = str(file.relative_to(root))

        if status == "candidate":
            destination = out / "CANDIDATES" / file.name
        else:
            destination = arc / status / file.name

        destination.parent.mkdir(parents=True, exist_ok=True)

        if destination.exists():
            destination = destination.with_name(
                f"{destination.stem}_{sha[:8]}{destination.suffix}"
            )

        shutil.copy2(file, destination)

        rows.append({
            "source": str(file.relative_to(root)),
            "sha256": sha,
            "bytes": file.stat().st_size,
            "status": status,
            "reason": reason,
            "copy": str(destination.relative_to(root))
        })

    report = {
        "created_utc": datetime.now(timezone.utc).isoformat(),
        "destructive_actions": False,
        "manual_approval_required": True,
        "items": rows
    }

    report_file = rep / f"intake-{stamp}.json"

    report_file.write_text(
        json.dumps(report, indent=2),
        encoding="utf-8"
    )

    print(json.dumps({
        "processed": len(rows),
        "report": str(report_file)
    }, indent=2))


if __name__ == "__main__":
    main()
