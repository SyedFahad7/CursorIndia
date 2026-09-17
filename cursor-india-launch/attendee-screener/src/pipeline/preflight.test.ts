import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { EventConfig } from "../event-config.js";
import type { NormalizedAttendee } from "../types.js";
import { applyCapacityCap, completenessScore, runPreflight } from "./preflight.js";

function attendee(
  partial: Partial<NormalizedAttendee> & Pick<NormalizedAttendee, "email">,
): NormalizedAttendee {
  return {
    id: partial.id || partial.email,
    rowIndex: partial.rowIndex ?? 0,
    name: partial.name || "Test",
    email: partial.email,
    phone: partial.phone,
    approvalStatus: partial.approvalStatus,
    registeredAt: partial.registeredAt,
    linkedinUrl: partial.linkedinUrl,
    githubUrl: partial.githubUrl,
    answers: partial.answers || [],
    responseText: partial.responseText || "",
    raw: partial.raw || {},
  };
}

const cfg: EventConfig = {
  eventName: "Test",
  capacity: 2,
  prioritize: ["builders"],
  deprioritize: ["spam"],
  notes: "",
  allowlist: { domains: ["cursor.com"], emails: [] },
  dropDeclined: true,
  applyCapacity: true,
};

describe("preflight", () => {
  it("drops declined and allowlists cursor.com", () => {
    const { kept, droppedDeclined } = runPreflight(
      [
        attendee({
          email: "a@x.com",
          approvalStatus: "declined",
        }),
        attendee({
          email: "host@cursor.com",
          approvalStatus: "pending_approval",
          linkedinUrl: "https://linkedin.com/in/x",
          answers: [{ question: "q", answer: "building agents with MCP in prod" }],
        }),
      ],
      cfg,
    );
    assert.equal(droppedDeclined, 1);
    assert.equal(kept.length, 1);
    assert.equal(kept[0]!.preflight.allowlisted, true);
  });

  it("keeps one email duplicate", () => {
    const { kept, skippedDup } = runPreflight(
      [
        attendee({
          email: "dup@example.com",
          registeredAt: "2026-01-01T00:00:00Z",
        }),
        attendee({
          email: "dup@example.com",
          registeredAt: "2026-02-01T00:00:00Z",
        }),
      ],
      cfg,
    );
    assert.equal(kept.length, 2);
    assert.equal(skippedDup, 1);
    assert.equal(kept.filter((k) => k.preflight.dupEmailKeep).length, 1);
  });

  it("scores completeness from profiles + answers", () => {
    const score = completenessScore(
      attendee({
        email: "b@x.com",
        githubUrl: "https://github.com/x",
        linkedinUrl: "https://linkedin.com/in/x",
        answers: [
          {
            question: "showcase",
            answer: "A".repeat(220),
          },
        ],
      }),
    );
    assert.ok(score >= 7);
  });

  it("applies capacity cap but protects allowlisted", () => {
    const capped = applyCapacityCap(
      [
        {
          decision: "accept",
          decisionScore: 0.9,
          allowlisted: true,
        },
        {
          decision: "accept",
          decisionScore: 0.8,
        },
        {
          decision: "accept",
          decisionScore: 0.7,
        },
        {
          decision: "accept",
          decisionScore: 0.6,
        },
      ],
      2,
    );
    const accepts = capped.filter((r) => r.decision === "accept");
    assert.equal(accepts.length, 2);
    assert.ok(accepts.some((r) => r.allowlisted));
  });
});
