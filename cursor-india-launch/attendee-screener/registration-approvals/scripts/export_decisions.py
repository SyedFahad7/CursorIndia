"""Export Luma-ready approve.csv / decline.csv from the latest scored.csv.

Review `<stem>.scored.csv` first — flip `llm_recommend` where you disagree — then:

    python3 export_decisions.py --confirm-reviewed
"""
from __future__ import annotations

import argparse
import csv
import sys
from pathlib import Path

from ra_config import load_config

HERE = Path(__file__).resolve().parent


def find_scored() -> Path:
    cands = sorted(HERE.glob("????-??-??-??-??-??.scored.csv"))
    if not cands:
        raise SystemExit("no *.scored.csv found — run score_pass2.py first")
    return cands[-1]


def write_emails(path: Path, emails: list[str]) -> None:
    with path.open("w", newline="", encoding="utf-8") as f:
        w = csv.writer(f)
        w.writerow(["email"])
        for em in emails:
            w.writerow([em])


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--confirm-reviewed",
        action="store_true",
        help="Required. Confirms a human reviewed llm_recommend in the scored CSV.",
    )
    args = parser.parse_args()
    if not args.confirm_reviewed:
        raise SystemExit(
            "refusing to export without human review confirmation.\n"
            "  1. Open <stem>.scored.csv, sort by llm_score, flip llm_recommend where needed\n"
            "  2. Re-run: python3 export_decisions.py --confirm-reviewed"
        )

    cfg = load_config(HERE)
    capacity = int(cfg["capacity"])
    src = find_scored()
    with src.open(newline="", encoding="utf-8-sig") as f:
        rows = list(csv.DictReader(f))

    approve: list[str] = []
    decline: list[str] = []
    skipped = 0
    seen: set[str] = set()

    for r in rows:
        email = (r.get("email") or "").strip().lower()
        if not email or email in seen:
            skipped += 1
            continue
        seen.add(email)

        if r.get("allowlisted") == "true" or r.get("already_approved") == "true":
            bucket = "approve"
        else:
            bucket = (r.get("llm_recommend") or "").strip().lower()

        if bucket == "approve":
            approve.append(email)
        elif bucket == "decline":
            decline.append(email)
        else:
            skipped += 1

    write_emails(HERE / "approve.csv", approve)
    write_emails(HERE / "decline.csv", decline)
    delta = len(approve) - capacity
    vs = "on target" if delta == 0 else f"{delta:+d} vs capacity"
    print(f"source:   {src.name}")
    print(f"capacity: {capacity}")
    print(f"approve:  {len(approve)} → approve.csv  ({vs})")
    print(f"decline:  {len(decline)} → decline.csv")
    print(f"skipped:  {skipped} (blank recommend / duplicate or empty email)")
    if len(approve) > capacity:
        print("note:     over capacity — trim or flip more rows to decline")
    elif len(approve) < capacity:
        print("note:     under capacity — review skipped/borderline rows if you want more")
    return 0


if __name__ == "__main__":
    sys.exit(main())
