import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { stringify } from "csv-stringify/sync";
import {
  lumaApprovalMessage,
  whatsappInviteUrl,
} from "../approval-message.js";
import type { EventConfig } from "../event-config.js";
import type { Persona, ScreenedAttendee } from "../types.js";
import { toCsvRow } from "./live-writer.js";

export async function writeRunOutputs(input: {
  outDir: string;
  persona: Persona;
  instructions: string;
  results: ScreenedAttendee[];
  eventConfig?: EventConfig;
}): Promise<{
  scoredCsv: string;
  jsonl: string;
  report: string;
  approvalMessage: string;
  draftApproveCsv: string;
  draftDeclineCsv: string;
}> {
  await mkdir(input.outDir, { recursive: true });

  const ranked = [...input.results].sort(
    (a, b) => b.decisionScore - a.decisionScore,
  );

  const scoredCsv = path.join(input.outDir, "scored.csv");
  const jsonl = path.join(input.outDir, "judgments.jsonl");
  const report = path.join(input.outDir, "report.md");
  const approvalMessage = path.join(input.outDir, "luma-approval-message.txt");
  const draftApproveCsv = path.join(input.outDir, "approve.draft.csv");
  const draftDeclineCsv = path.join(input.outDir, "decline.draft.csv");

  const rows = ranked.map((r) => toCsvRow(r));

  await writeFile(scoredCsv, stringify(rows, { header: true }), "utf8");

  await writeFile(
    jsonl,
    ranked.map((r) => JSON.stringify(r)).join("\n") + "\n",
    "utf8",
  );

  const template = lumaApprovalMessage();
  await writeFile(approvalMessage, template, "utf8");

  const draftApprove = ranked
    .filter((r) => r.decision === "accept")
    .map((r) => ({ email: r.attendee.email }));
  const draftDecline = ranked
    .filter((r) => r.decision === "reject")
    .map((r) => ({ email: r.attendee.email }));

  await writeFile(
    draftApproveCsv,
    stringify(draftApprove, { header: true, columns: ["email"] }),
    "utf8",
  );
  await writeFile(
    draftDeclineCsv,
    stringify(draftDecline, { header: true, columns: ["email"] }),
    "utf8",
  );

  const counts = {
    accept: ranked.filter((r) => r.decision === "accept").length,
    waitlist: ranked.filter((r) => r.decision === "waitlist").length,
    reject: ranked.filter((r) => r.decision === "reject").length,
  };

  const accepts = ranked.filter((r) => r.decision === "accept");
  const capacity = input.eventConfig?.capacity;
  const vsCapacity =
    capacity == null
      ? "_not set_"
      : counts.accept === capacity
        ? "on target"
        : `${counts.accept - capacity >= 0 ? "+" : ""}${counts.accept - capacity} vs capacity ${capacity}`;

  const md = `# Attendee screen report

- Event: **${input.eventConfig?.eventName || "—"}**
- Persona: **${input.persona.label}** (\`${input.persona.id}\`)
- Total: **${ranked.length}**
- Accept: **${counts.accept}** · Waitlist: **${counts.waitlist}** · Reject: **${counts.reject}**
- Capacity: **${capacity ?? "—"}** (${vsCapacity})

## Host instructions

${input.instructions || "_none_"}

## Luma export (after human review)

1. Review \`scored.csv\` — sort by \`decision_score\`, flip \`llm_recommend\` / \`decision\` if needed
2. Run: \`pnpm export-decisions -- --out ${input.outDir} --confirm-reviewed\`
3. Upload \`approve.csv\` / \`decline.csv\` via Luma bulk Update Guests

Draft lists (unconfirmed): \`approve.draft.csv\` · \`decline.draft.csv\`

## Luma approval message (WhatsApp)

When you **Approve** someone in Luma:

1. Keep **Notify Guest** checked
2. Paste this into **Add an optional, custom message...**
3. Click **Approve**

WhatsApp link: ${whatsappInviteUrl()}

\`\`\`
${template}
\`\`\`

Also saved as \`luma-approval-message.txt\`. Accept rows in \`scored.csv\` include a personalized \`luma_approval_message\` column.

## Top accepts

${accepts
  .slice(0, 15)
  .map(
    (r, i) =>
      `${i + 1}. **${r.attendee.name}** (${r.decisionScore}) — ${r.rationale}`,
  )
  .join("\n") || "_none_"}

## Rejected for slop

${ranked
  .filter((r) => r.slop.isAiSlop)
  .slice(0, 20)
  .map((r) => `- **${r.attendee.name}** — ${r.slop.notes}`)
  .join("\n") || "_none_"}
`;

  await writeFile(report, md, "utf8");

  return {
    scoredCsv,
    jsonl,
    report,
    approvalMessage,
    draftApproveCsv,
    draftDeclineCsv,
  };
}
