"""Pass 1 — completeness + dedup + allowlist.

Reads the latest Luma export (`YYYY-MM-DD-HH-MM-SS.csv`), writes
`<stem>.sorted.csv` and a short `<stem>.summary.md`.

Requires `event_config.json` next to the CSV.
"""
from __future__ import annotations

import csv
import re
import sys
from collections import Counter, defaultdict
from datetime import datetime, timezone
from pathlib import Path

from ra_config import allowlist, field_weights, load_config

HERE = Path(__file__).resolve().parent
EMPTY_SENTINELS = {"", "-", ".", "n/a", "na", "none", "nil", "no", "null"}
REQUIRED_LUMA_FIELDS = {"name", "email", "api_id", "approval_status"}


def is_filled(value: str) -> bool:
    v = (value or "").strip().lower()
    if v in EMPTY_SENTINELS:
        return False
    return len(v) >= 2


def normalize_phone(raw: str) -> str:
    if not raw:
        return ""
    return re.sub(r"[^0-9]", "", raw)


def domain_of(email: str) -> str:
    em = (email or "").strip().lower()
    if "@" not in em:
        return ""
    return em.split("@", 1)[1]


def find_latest_csv() -> Path:
    candidates = sorted(HERE.glob("????-??-??-??-??-??.csv"))
    if not candidates:
        raise SystemExit(f"no Luma-export CSVs found in {HERE}")
    return candidates[-1]


def load_rows(path: Path) -> tuple[list[str], list[dict]]:
    with path.open(newline="", encoding="utf-8-sig") as f:
        reader = csv.DictReader(f)
        return list(reader.fieldnames or []), list(reader)


def parse_created_at(s: str) -> datetime:
    try:
        return datetime.fromisoformat(s.replace("Z", "+00:00"))
    except (AttributeError, ValueError):
        return datetime.max.replace(tzinfo=timezone.utc)


def compute_per_row(
    row: dict,
    field_weights_list: list[tuple[str, int, str]],
    allow_domains: set[str],
    allow_emails: set[str],
) -> dict:
    filled_map = {}
    score = 0
    for field, weight, short in field_weights_list:
        filled = is_filled(row.get(field, ""))
        filled_map[short] = filled
        if filled:
            score += weight
    email = (row.get("email") or "").strip().lower()
    row["_email_norm"] = email
    row["_phone_norm"] = normalize_phone(row.get("phone_number", ""))
    row["_domain"] = domain_of(email)
    row["_allowlisted"] = (
        row["_domain"] in allow_domains or row["_email_norm"] in allow_emails
    )
    row["_completeness_score"] = score
    row["_filled"] = filled_map
    row["_created_dt"] = parse_created_at(row.get("created_at", ""))
    return row


def flag_dups(rows: list[dict]) -> None:
    by_email: dict[str, list[int]] = defaultdict(list)
    by_phone: dict[str, list[int]] = defaultdict(list)
    for i, r in enumerate(rows):
        if r["_email_norm"]:
            by_email[r["_email_norm"]].append(i)
        if r["_phone_norm"]:
            by_phone[r["_phone_norm"]].append(i)

    for r in rows:
        r["_dup_email"] = False
        r["_dup_phone"] = False
        r["_dup_email_keep"] = True
        r["_dup_phone_keep"] = True

    def dup_keep_key(i: int, by_score: bool):
        r = rows[i]
        return (
            -int(r["_allowlisted"]),
            -int(r["_already_approved"]),
            -r["_completeness_score"] if by_score else 0,
            r["_created_dt"],
        )

    for _email, idxs in by_email.items():
        if len(idxs) <= 1:
            continue
        idxs_sorted = sorted(idxs, key=lambda i: dup_keep_key(i, by_score=False))
        keep = idxs_sorted[0]
        for i in idxs_sorted:
            rows[i]["_dup_email"] = True
            rows[i]["_dup_email_keep"] = (i == keep)

    for _phone, idxs in by_phone.items():
        if len(idxs) <= 1:
            continue
        idxs_sorted = sorted(idxs, key=lambda i: dup_keep_key(i, by_score=True))
        keep = idxs_sorted[0]
        for i in idxs_sorted:
            rows[i]["_dup_phone"] = True
            rows[i]["_dup_phone_keep"] = (i == keep)


def rank(rows: list[dict]) -> None:
    ordered = sorted(
        rows,
        key=lambda r: (
            -int(r["_allowlisted"]),
            -int(r["_already_approved"]),
            -r["_completeness_score"],
            r["_created_dt"],
        ),
    )
    for i, r in enumerate(ordered, 1):
        r["_rank_pass1"] = i


def write_sorted(path: Path, fieldnames: list[str], rows: list[dict]) -> None:
    out_fields = fieldnames + [
        "completeness_score",
        "allowlisted",
        "already_approved",
        "dup_email",
        "dup_email_keep",
        "dup_phone",
        "dup_phone_keep",
        "rank_pass1",
    ]
    ordered = sorted(rows, key=lambda r: r["_rank_pass1"])
    with path.open("w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=out_fields, extrasaction="ignore")
        w.writeheader()
        for r in ordered:
            row_out = {k: r.get(k, "") for k in fieldnames}
            row_out["completeness_score"] = r["_completeness_score"]
            row_out["allowlisted"] = "true" if r["_allowlisted"] else "false"
            row_out["already_approved"] = "true" if r["_already_approved"] else "false"
            row_out["dup_email"] = "true" if r["_dup_email"] else "false"
            row_out["dup_email_keep"] = "true" if r["_dup_email_keep"] else "false"
            row_out["dup_phone"] = "true" if r["_dup_phone"] else "false"
            row_out["dup_phone_keep"] = "true" if r["_dup_phone_keep"] else "false"
            row_out["rank_pass1"] = r["_rank_pass1"]
            w.writerow(row_out)


def write_summary(
    path: Path,
    cfg: dict,
    source: Path,
    rows: list[dict],
    dropped_declined: int,
    field_weights_list: list[tuple[str, int, str]],
    allow_domains: set[str],
    allow_emails: set[str],
) -> None:
    total = len(rows)
    max_score = sum(w for _, w, _ in field_weights_list)
    allowlisted = [r for r in rows if r["_allowlisted"]]
    already_approved = [r for r in rows if r["_already_approved"]]
    dup_email_n = sum(1 for r in rows if r["_dup_email"])
    dup_phone_n = sum(1 for r in rows if r["_dup_phone"])
    score_hist = Counter(r["_completeness_score"] for r in rows)
    status_counts = Counter(r.get("approval_status", "") for r in rows)

    def pct(n: int, d: int) -> str:
        return f"{(n / d * 100):.1f}%" if d else "-"

    lines: list[str] = []
    ap = lines.append
    ap(f"# Pass 1 summary — {source.name}")
    ap("")
    ap(f"Event: **{(cfg.get('event_name') or '').strip() or '(unnamed)'}**")
    ap(f"Capacity target: **{cfg.get('capacity')}**")
    ap("")
    ap("## Counts")
    ap("")
    ap(f"- Kept (after dropping declined): **{total}**")
    ap(f"- Dropped declined: {dropped_declined}")
    ap(f"- Status: " + ", ".join(f"`{k}`={v}" for k, v in status_counts.most_common()))
    ap(f"- Allowlisted ({len(allow_domains)} domains + {len(allow_emails)} emails): **{len(allowlisted)}**")
    ap(f"- Already approved: {len(already_approved)}")
    ap(f"- Dup email rows: {dup_email_n} · dup phone rows: {dup_phone_n}")
    ap("")

    if allowlisted:
        ap("## Allowlist hits")
        ap("")
        for r in sorted(allowlisted, key=lambda r: r["_rank_pass1"]):
            ap(f"- **{(r.get('name') or '').strip()}** `{r.get('email')}`")
        ap("")

    ap(f"## Completeness histogram (0–{max_score})")
    ap("")
    ap("| score | count |")
    ap("|------:|------:|")
    for s in range(0, max_score + 1):
        ap(f"| {s} | {score_hist.get(s, 0)} |")
    ap("")

    ap("## Field fill rates")
    ap("")
    field_fill: Counter = Counter()
    for r in rows:
        for short, filled in r["_filled"].items():
            if filled:
                field_fill[short] += 1
    ap("| field | weight | filled | rate |")
    ap("|-------|------:|------:|-----:|")
    for _field, weight, short in field_weights_list:
        n = field_fill.get(short, 0)
        ap(f"| {short} | {weight} | {n} | {pct(n, total)} |")
    ap("")

    path.write_text("\n".join(lines), encoding="utf-8")


def main() -> int:
    cfg = load_config(HERE)
    allow_domains, allow_emails = allowlist(cfg)
    weights = field_weights(cfg)

    source = find_latest_csv()
    fieldnames, raw_rows = load_rows(source)
    missing_luma = sorted(REQUIRED_LUMA_FIELDS - set(fieldnames))
    if missing_luma:
        raise SystemExit(
            "Luma CSV is missing required headers: " + ", ".join(missing_luma)
        )
    missing = [h for h, _w, _s in weights if h not in fieldnames]
    if missing:
        raise SystemExit(
            "event_config fields not found in CSV headers: "
            + ", ".join(missing)
            + "\nFix event_config.json field mappings."
        )

    dropped_declined = 0
    rows: list[dict] = []
    for r in raw_rows:
        status = (r.get("approval_status") or "").strip().lower()
        if status == "declined":
            dropped_declined += 1
            continue
        r["_already_approved"] = status == "approved"
        compute_per_row(r, weights, allow_domains, allow_emails)
        rows.append(r)

    flag_dups(rows)
    rank(rows)

    stem = source.stem
    sorted_path = source.with_name(f"{stem}.sorted.csv")
    summary_path = source.with_name(f"{stem}.summary.md")
    write_sorted(sorted_path, fieldnames, rows)
    write_summary(
        summary_path, cfg, source, rows, dropped_declined,
        weights, allow_domains, allow_emails,
    )

    print(f"source:  {source.name}")
    print(f"kept:    {len(rows)} (dropped {dropped_declined} declined)")
    print(f"sorted:  {sorted_path.name}")
    print(f"summary: {summary_path.name}")
    print(f"allowlist: {len(allow_domains)} domains + {len(allow_emails)} emails")
    return 0


if __name__ == "__main__":
    sys.exit(main())
