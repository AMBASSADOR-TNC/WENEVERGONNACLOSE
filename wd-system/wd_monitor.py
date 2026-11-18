#!/usr/bin/env python3

import argparse
import json
import time
from datetime import datetime, timezone, timedelta
from pathlib import Path


def snapshot(root):
    data = {}

    for name in ["WD.INPUT", "WD.ARCHIVE", "WD.OUTPUT"]:
        folder = root / "runtime" / name

        files = (
            [item for item in folder.rglob("*") if item.is_file()]
            if folder.exists()
            else []
        )

        data[name] = {
            "files": len(files),
            "bytes": sum(item.stat().st_size for item in files)
        }

    return data


def main():
    parser = argparse.ArgumentParser(
        description="Whole Donuts 72-hour observation logger"
    )

    parser.add_argument("--root", default=".")
    parser.add_argument("--hours", type=float, default=72)
    parser.add_argument("--interval-minutes", type=float, default=60)

    args = parser.parse_args()

    root = Path(args.root).resolve()

    reports = root / "runtime" / "WD.REPORTS"
    reports.mkdir(parents=True, exist_ok=True)

    start = datetime.now(timezone.utc)
    end = start + timedelta(hours=args.hours)

    log = reports / (
        f"observation-{start.strftime('%Y%m%dT%H%M%SZ')}.jsonl"
    )

    while True:
        now = datetime.now(timezone.utc)

        row = {
            "utc": now.isoformat(),
            "snapshot": snapshot(root)
        }

        with log.open("a", encoding="utf-8") as file:
            file.write(json.dumps(row) + "\n")

        if now >= end:
            break

        time.sleep(max(1, args.interval_minutes * 60))

    summary = {
        "start_utc": start.isoformat(),
        "end_utc": datetime.now(timezone.utc).isoformat(),
        "requested_hours": args.hours,
        "log": str(log.relative_to(root)),
        "action": (
            "Review observation logs and make revisions "
            "only through a new verified change."
        )
    }

    review_file = reports / "72-HOUR-REVIEW.json"

    review_file.write_text(
        json.dumps(summary, indent=2),
        encoding="utf-8"
    )

    print(json.dumps(summary, indent=2))


if __name__ == "__main__":
    main()
