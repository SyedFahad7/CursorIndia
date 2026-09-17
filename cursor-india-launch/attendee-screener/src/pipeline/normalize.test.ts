import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { normalizeRow } from "./normalize.js";

describe("normalize Luma rows", () => {
  it("maps custom questions and profile columns", () => {
    const a = normalizeRow(
      {
        name: "Asha Reddy",
        email: "asha@example.com",
        approval_status: "approved",
        "What do you build?": "CLI tools",
        GitHub: "https://github.com/ashacodes",
        LinkedIn: "https://www.linkedin.com/in/asha-reddy",
        "X / Twitter": "@ashacodes",
      },
      0,
    );

    assert.equal(a.name, "Asha Reddy");
    assert.equal(a.githubUrl, "https://github.com/ashacodes");
    assert.equal(a.linkedinUrl, "https://www.linkedin.com/in/asha-reddy");
    assert.equal(a.xUrl, "https://x.com/ashacodes");
    assert.equal(a.answers.length, 1);
    assert.match(a.responseText, /CLI tools/);
  });

  it("pulls profile URLs out of free-text answers", () => {
    const a = normalizeRow(
      {
        name: "Sam",
        email: "sam@example.com",
        Bio: "Find me at https://github.com/samdev and https://www.linkedin.com/in/samdev",
      },
      2,
    );
    assert.equal(a.githubUrl, "https://github.com/samdev");
    assert.equal(a.linkedinUrl, "https://www.linkedin.com/in/samdev");
  });
});
