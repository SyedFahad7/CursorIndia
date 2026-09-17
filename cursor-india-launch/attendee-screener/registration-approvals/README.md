# Registration approvals (community skill)

Vendored from [`cursorcommunityled/skills`](https://github.com/cursorcommunityled/skills) → `registration-approvals`.

Use this **alongside** the Cursor-SDK attendee screener:

| Path | Engine | Best for |
|---|---|---|
| `pnpm screen` / `pnpm ui` | Cursor SDK + GitHub/Exa | Fast local triage, personas, live CSV |
| `registration-approvals/` | Anthropic Pass1 + Pass2 | Official ambassador approve/decline export for Luma |

## Privacy

Pass 2 sends guest fields (+ optional web-fetched profile text) to **Anthropic**. Only run if your event privacy posture allows it. Human review of `*.scored.csv` is required before export.

## Setup

```bash
cd cursor-india-launch/attendee-screener
pip install -r registration-approvals/requirements.txt
# needs ANTHROPIC_API_KEY in env or .env
```

## Run (Workato example)

```bash
# 1) Prepare a run folder (normalizes guest_id → api_id, copies scripts + config)
pnpm ra:prepare -- --csv "./Cursor × Workato.csv" --config ./registration-approvals/config/event_config.workato.example.json --name workato

# 2) Score
cd registration-approvals/runs/workato
python score_pass1.py
python score_pass2.py --limit 15    # calibrate
python score_pass2.py               # full batch
# review *.scored.csv — flip llm_recommend where needed
python export_decisions.py --confirm-reviewed
```

Outputs land in the run folder: `approve.csv` / `decline.csv` for Luma bulk update.

## Config templates

- `config/event_config.workato.example.json`
- `config/event_config.agents.example.json`
- `config/event_config.example.json` (upstream template)

Copy/edit into the run as `event_config.json` (prepare does this for you). Field header strings must **exactly** match the Luma CSV.

## When to use which tool

1. **Quick shortlist / professionals / idea quality** → existing `scripts/shortlist-*.ts` + Cursor screener  
2. **Official capacity-based approve/decline with LLM + completeness** → this skill  
3. Combine: use Cursor screener for enrichment notes, then RA export for Luma bulk actions
