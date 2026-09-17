import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { normalizeRow } from "./normalize.js";
import { scoreSlopHeuristics } from "./slop.js";

describe("slop heuristics", () => {
  it("flags classic AI hyphen / buzzword paste", () => {
    const attendee = normalizeRow(
      {
        name: "Slop",
        email: "slop@example.com",
        "What do you build?":
          "I am passionate about leveraging cutting-edge AI to unlock the potential of seamless experiences. In today's rapidly evolving landscape I delve into robust and scalable solutions — end-to-end — to drive innovation and foster collaboration across holistic approaches and best practices.",
        "Why come?":
          "I am thrilled to join this game-changer event and empower my journey with best practices — cutting-edge — state-of-the-art.",
      },
      0,
    );

    const h = scoreSlopHeuristics(attendee);
    assert.ok(h.genericPhraseHits.length >= 3);
    assert.ok(h.heuristicScore >= 0.35);
    assert.equal(h.hardReject, true);
  });

  it("keeps specific builder answers", () => {
    const attendee = normalizeRow(
      {
        name: "Builder",
        email: "b@example.com",
        "What do you build?":
          "Next.js attendance bot for my college club in Hyderabad. Using Cursor Agent Mode for refactors. Repo: https://github.com/example/attendance",
        GitHub: "https://github.com/example",
      },
      1,
    );

    const h = scoreSlopHeuristics(attendee);
    assert.ok(h.specificityHits.includes("github"));
    assert.ok(h.specificityHits.includes("cursor"));
    assert.equal(h.hardReject, false);
    assert.ok(h.heuristicScore < 0.45);
  });
});
