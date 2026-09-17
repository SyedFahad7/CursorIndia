"""Pass 2 — LLM scores eligible guests (Haiku + Message Batches by default).

  python3 score_pass2.py --limit 15       # calibrate (sync)
  python3 score_pass2.py                   # full batch run
  python3 score_pass2.py --sync            # sync fallback
  python3 score_pass2.py --model claude-sonnet-5
"""
from __future__ import annotations

import argparse
import csv
import json
import re
import sys
import threading
import time
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path

try:
    import anthropic
except ImportError:
    print("missing dep: pip install anthropic", file=sys.stderr)
    sys.exit(1)

try:
    from dotenv import load_dotenv
    _p = Path(__file__).resolve()
    for parent in _p.parents:
        if (parent / ".env").exists():
            load_dotenv(parent / ".env")
            break
except ImportError:
    pass

from ra_config import (
    DEFAULT_MODEL,
    build_system_prompt,
    field_header,
    load_config,
    model_from_config,
)

HERE = Path(__file__).resolve().parent
DEFAULT_BATCH_CHUNK = 200
POLL_SECONDS = 30
MAX_TOKENS = 1024
TOOLS = [{"type": "web_search_20250305", "name": "web_search"}]

# Luma always ships these columns (not form questions).
F_NAME = "name"
F_EMAIL = "email"
F_API_ID = "api_id"


def positive_int(value: str) -> int:
    parsed = int(value)
    if parsed < 1:
        raise argparse.ArgumentTypeError("must be at least 1")
    return parsed


def find_latest_sorted() -> Path:
    cands = sorted(HERE.glob("????-??-??-??-??-??.sorted.csv"))
    if not cands:
        raise SystemExit("no *.sorted.csv found — run score_pass1.py first")
    return cands[-1]


def load_sorted(path: Path) -> list[dict]:
    with path.open(newline="", encoding="utf-8-sig") as f:
        return list(csv.DictReader(f))


def eligible_for_llm(row: dict) -> bool:
    if row.get("allowlisted") == "true":
        return False
    if row.get("already_approved") == "true":
        return False
    if row.get("dup_email_keep") == "false":
        return False
    if row.get("dup_phone_keep") == "false":
        return False
    return True


def email_domain(email: str) -> str:
    em = (email or "").strip().lower()
    return em.split("@", 1)[1] if "@" in em else ""


def row_api_id(row: dict) -> str:
    return (row.get(F_API_ID) or "").strip()


def build_user_prompt(cfg: dict, row: dict) -> str:
    def val(header: str) -> str:
        s = (row.get(header) or "").strip() if header else ""
        return s if s else "(blank)"

    lines = [
        "Guest:",
        f"  name: {val(F_NAME)}",
        f"  email_domain: {email_domain(row.get(F_EMAIL, ''))}",
        f"  completeness_score: {row.get('completeness_score', '')}",
    ]
    for logical in ("company", "role", "github", "linkedin", "x"):
        header = field_header(cfg, logical)
        if header:
            lines.append(f"  {logical}: {val(header)}")

    body = "\n".join(lines) + "\n"
    for logical in ("building", "question", "showcase"):
        header = field_header(cfg, logical)
        if header:
            body += f"\n{header}\n  {val(header)}\n"
    return body


def build_request(cfg: dict, system_prompt: str, row: dict, model: str) -> dict | None:
    api_id = row_api_id(row)
    if not api_id:
        return None
    return {
        "custom_id": api_id,
        "params": {
            "model": model,
            "max_tokens": MAX_TOKENS,
            "system": system_prompt,
            "tools": TOOLS,
            "messages": [{"role": "user", "content": build_user_prompt(cfg, row)}],
        },
    }


def try_parse_json(text: str) -> dict | None:
    text = text.strip()
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        pass
    for m in reversed(list(re.finditer(r"```(?:json)?\s*\n(.*?)\n?```", text, re.DOTALL))):
        try:
            return json.loads(m.group(1).strip())
        except json.JSONDecodeError:
            continue
    end = text.rfind("}")
    while end != -1:
        depth = 0
        start = -1
        for i in range(end, -1, -1):
            ch = text[i]
            if ch == "}":
                depth += 1
            elif ch == "{":
                depth -= 1
                if depth == 0:
                    start = i
                    break
        if start == -1:
            break
        try:
            return json.loads(text[start:end + 1])
        except json.JSONDecodeError:
            end = text.rfind("}", 0, end)
    return None


def valid_decision(value: object) -> bool:
    if not isinstance(value, dict):
        return False
    score = value.get("score")
    flags = value.get("flags")
    return (
        isinstance(score, int)
        and not isinstance(score, bool)
        and 1 <= score <= 5
        and value.get("recommend") in {"approve", "decline"}
        and isinstance(value.get("one_liner"), str)
        and isinstance(flags, list)
        and all(isinstance(flag, str) for flag in flags)
    )


def append_result(path: Path, lock: threading.Lock, result: dict) -> None:
    with lock:
        with path.open("a", encoding="utf-8") as f:
            f.write(json.dumps(result, ensure_ascii=False) + "\n")


def load_done_ids(raw_path: Path) -> set[str]:
    done: set[str] = set()
    if not raw_path.exists():
        return done
    with raw_path.open(encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if not line:
                continue
            r = json.loads(line)
            if (r.get("result") or {}).get("type") == "succeeded":
                done.add(r.get("custom_id", ""))
    return done


def run_one(client: anthropic.Anthropic, req: dict) -> dict:
    cid = req["custom_id"]
    try:
        msg = client.messages.create(**req["params"])
        return {"custom_id": cid, "result": {"type": "succeeded", "message": msg.model_dump()}}
    except anthropic.APIError as e:
        return {
            "custom_id": cid,
            "result": {
                "type": "errored",
                "error": {"type": e.__class__.__name__, "message": str(e)[:300]},
            },
        }


def run_sync(
    client: anthropic.Anthropic,
    requests: list[dict],
    raw_path: Path,
    concurrency: int,
) -> None:
    lock = threading.Lock()
    started = time.time()
    count = 0
    with ThreadPoolExecutor(max_workers=concurrency) as ex:
        futures = [ex.submit(run_one, client, r) for r in requests]
        for fut in as_completed(futures):
            result = fut.result()
            append_result(raw_path, lock, result)
            count += 1
            if count % 10 == 0 or count == len(requests) or count <= 3:
                elapsed = time.time() - started
                rate = count / max(elapsed, 1)
                eta = (len(requests) - count) / max(rate, 0.01) / 60
                kind = result.get("result", {}).get("type", "?")
                print(
                    f"[{time.strftime('%H:%M:%S')}] {count}/{len(requests)} "
                    f"({rate:.2f}/s, eta {eta:.1f}min) last={kind}"
                )


def chunked(items: list, size: int) -> list[list]:
    return [items[i:i + size] for i in range(0, len(items), size)]


def poll_batch(client: anthropic.Anthropic, batch_id: str) -> object:
    while True:
        batch = client.messages.batches.retrieve(batch_id)
        counts = batch.request_counts
        print(
            f"[{time.strftime('%H:%M:%S')}] batch {batch_id}  "
            f"status={batch.processing_status}  "
            f"succeeded={counts.succeeded} errored={counts.errored} "
            f"processing={counts.processing} canceled={counts.canceled} "
            f"expired={counts.expired}"
        )
        if batch.processing_status == "ended":
            return batch
        time.sleep(POLL_SECONDS)


def ingest_batch_results(
    client: anthropic.Anthropic,
    batch_id: str,
    raw_path: Path,
    lock: threading.Lock,
) -> int:
    n = 0
    for item in client.messages.batches.results(batch_id):
        payload = item.model_dump() if hasattr(item, "model_dump") else dict(item)
        append_result(raw_path, lock, payload)
        n += 1
    return n


def run_batch(
    client: anthropic.Anthropic,
    requests: list[dict],
    raw_path: Path,
    meta_path: Path,
    chunk_size: int,
) -> None:
    lock = threading.Lock()
    chunks = chunked(requests, chunk_size)
    print(f"batch: {len(requests)} requests in {len(chunks)} chunk(s) of ≤{chunk_size}")
    print(
        "note:  web_search is org-throttled on Batches — large runs can take a while; "
        "use --sync if you need it faster."
    )

    for i, chunk in enumerate(chunks, 1):
        print(f"\n--- chunk {i}/{len(chunks)} ({len(chunk)} requests) ---")
        batch = client.messages.batches.create(requests=chunk)
        with meta_path.open("a", encoding="utf-8") as f:
            f.write(json.dumps({
                "batch_id": batch.id,
                "chunk": i,
                "size": len(chunk),
                "created_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
            }) + "\n")
        print(f"submitted: {batch.id}")
        poll_batch(client, batch.id)
        n = ingest_batch_results(client, batch.id, raw_path, lock)
        print(f"ingested: {n} results from {batch.id}")


def write_scored(source: Path, stem: str, raw_path: Path, model: str) -> None:
    results: dict[str, dict] = {}
    errors: dict[str, str] = {}
    total_in = total_out = total_ws = 0

    if not raw_path.exists():
        print(f"no results yet at {raw_path}")
        return

    with raw_path.open(encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if not line:
                continue
            r = json.loads(line)
            cid = r.get("custom_id", "")
            outcome = r.get("result", {})
            rtype = outcome.get("type")
            if rtype == "succeeded":
                msg = outcome.get("message", {})
                text_parts = [
                    b.get("text", "")
                    for b in (msg.get("content") or [])
                    if b.get("type") == "text"
                ]
                parsed = try_parse_json("\n".join(text_parts).strip())
                if not valid_decision(parsed):
                    errors[cid] = (
                        "json-parse-failed" if parsed is None else "invalid-decision-json"
                    )
                    continue
                assert isinstance(parsed, dict)
                results[cid] = parsed
                u = msg.get("usage") or {}
                total_in += u.get("input_tokens", 0) or 0
                total_out += u.get("output_tokens", 0) or 0
                total_ws += (u.get("server_tool_use") or {}).get("web_search_requests", 0) or 0
            else:
                err_obj = outcome.get("error") or {}
                errors[cid] = str(
                    err_obj.get("type") or err_obj.get("message") or rtype or "?"
                )

    rows = load_sorted(source)
    extra = ["llm_score", "llm_recommend", "llm_one_liner", "llm_flags", "llm_error"]
    fields = list(rows[0].keys()) + extra if rows else extra
    out_path = source.with_name(f"{stem}.scored.csv")
    with out_path.open("w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=fields)
        w.writeheader()
        for r in rows:
            out = dict(r)
            api_id = row_api_id(r)
            parsed = results.get(api_id)
            if parsed is not None:
                out["llm_score"] = parsed.get("score", "")
                out["llm_recommend"] = parsed.get("recommend", "")
                out["llm_one_liner"] = parsed.get("one_liner", "")
                flags = parsed.get("flags", [])
                out["llm_flags"] = (
                    "|".join(str(flag) for flag in flags)
                    if isinstance(flags, list)
                    else str(flags)
                )
                out["llm_error"] = ""
            else:
                out.update({k: "" for k in extra})
                out["llm_error"] = errors.get(
                    api_id, "missing-api-id" if not api_id else ""
                )
            for k in fields:
                out.setdefault(k, "")
            w.writerow(out)

    print(f"wrote:  {out_path.relative_to(HERE)}")
    print(f"scored: {len(results)}  errored: {len(errors)}  model={model}")
    print(f"tokens: in={total_in:,} out={total_out:,} web_searches={total_ws}")
    if errors:
        print("\nfirst errors:")
        for i, (c, e) in enumerate(errors.items()):
            if i >= 10:
                break
            print(f"  {c}: {e}")


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--limit", type=positive_int, default=None,
                    help="Only run the top N eligible rows. Use for calibration.")
    ap.add_argument("--sync", action="store_true",
                    help="Use sync Messages API instead of Batches.")
    ap.add_argument("--model", default=None,
                    help=f"Claude model id (default from event_config / {DEFAULT_MODEL}).")
    ap.add_argument("--concurrency", type=positive_int, default=8,
                    help="Concurrent sync API calls (ignored in batch mode).")
    ap.add_argument("--chunk-size", type=positive_int, default=DEFAULT_BATCH_CHUNK,
                    help=f"Max requests per Message Batch (default {DEFAULT_BATCH_CHUNK}).")
    args = ap.parse_args()

    cfg = load_config(HERE)
    system_prompt = build_system_prompt(cfg)
    model = args.model or model_from_config(cfg)
    use_batch = not args.sync and args.limit is None

    source = find_latest_sorted()
    stem = source.stem.replace(".sorted", "")
    bdir = HERE / "batch" / (stem + ("-calibration" if args.limit else ""))
    bdir.mkdir(parents=True, exist_ok=True)
    raw_path = bdir / "results.jsonl"
    meta_path = bdir / "batches.jsonl"

    rows = load_sorted(source)
    pool = [r for r in rows if eligible_for_llm(r)]
    if args.limit:
        pool = pool[:args.limit]
    missing_api_ids = sum(1 for row in pool if not row_api_id(row))
    if missing_api_ids:
        print(
            f"warning: {missing_api_ids} eligible row(s) have no api_id and cannot be scored",
            file=sys.stderr,
        )

    done = load_done_ids(raw_path)
    if done:
        print(f"resume: {len(done)} rows already completed in {raw_path.relative_to(HERE)}")

    requests = [
        req for r in pool
        if (req := build_request(cfg, system_prompt, r, model)) and req["custom_id"] not in done
    ]
    mode = "batch" if use_batch else "sync"
    print(
        f"source: {source.name}  eligible={len(pool)}  pending={len(requests)}  "
        f"model={model}  mode={mode}"
    )
    if not requests:
        print("nothing to do; finalizing…")
        write_scored(source, stem, raw_path, model)
        return 0

    client = anthropic.Anthropic(max_retries=5)
    started = time.time()

    if use_batch:
        run_batch(client, requests, raw_path, meta_path, args.chunk_size)
    else:
        run_sync(client, requests, raw_path, args.concurrency)

    print(f"\ndone in {(time.time() - started) / 60:.1f}min; finalizing…")
    write_scored(source, stem, raw_path, model)

    if args.limit:
        print("\n--- calibration sample ---")
        print("Open <stem>.scored.csv and eyeball score / recommend / one_liner.")
        print("Edit event_config.json event_context if verdicts feel off,")
        print("then run `python3 score_pass2.py` (no --limit) for the full set.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
