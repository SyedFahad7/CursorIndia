export type PersonaId = "cursor-dev" | "founders" | "pms" | "mixed" | "agents";

export type Decision = "accept" | "waitlist" | "reject";

export type ProfileWeight = {
  github: number;
  linkedin: number;
  x: number;
  responses: number;
};

export type Persona = {
  id: PersonaId;
  label: string;
  description: string;
  weights: ProfileWeight;
  /** Extra guidance injected into the fit judge prompt */
  fitHints: string[];
};

export type AttendeeAnswer = {
  question: string;
  answer: string;
};

export type NormalizedAttendee = {
  id: string;
  rowIndex: number;
  name: string;
  email: string;
  phone?: string;
  approvalStatus?: string;
  ticketType?: string;
  registeredAt?: string;
  linkedinUrl?: string;
  xUrl?: string;
  githubUrl?: string;
  answers: AttendeeAnswer[];
  /** Flattened free-text used for slop / fit judging */
  responseText: string;
  raw: Record<string, string>;
};

export type SlopHeuristics = {
  hyphenCount: number;
  emDashCount: number;
  bulletFarmScore: number;
  genericPhraseHits: string[];
  duplicateFieldPairs: number;
  avgAnswerLength: number;
  specificityHits: string[];
  hardReject: boolean;
  hardRejectReasons: string[];
  heuristicScore: number; // 0–1, higher = more sloppy
};

export type SlopJudgment = {
  authenticity: number; // 0–1
  specificity: number; // 0–1
  isAiSlop: boolean;
  redFlags: string[];
  notes: string;
  score: number; // 0–1, higher = better / more authentic
};

export type CursorGithubEvidence = {
  /** Public code search found .cursor/ or .cursorrules */
  usedCursorLikely: boolean;
  hasCursorDir: boolean;
  hasCursorRulesFile: boolean;
  matchCount: number;
  samplePaths: string[];
  /** Search skipped / failed (no token, rate limit, etc.) */
  searchError?: string;
};

export type GithubSignal = {
  username?: string;
  url?: string;
  found: boolean;
  publicRepos?: number;
  followers?: number;
  accountAgeDays?: number;
  recentCommitDays?: number | null;
  topRepos: Array<{
    name: string;
    stars: number;
    language?: string;
    description?: string;
    pushedAt?: string;
    fork: boolean;
  }>;
  cursorSignals: string[];
  /** Stronger signal from code search for .cursor artifacts */
  cursorEvidence?: CursorGithubEvidence;
  builderScore: number; // 0–1
  notes: string[];
  error?: string;
};

export type LinkedInSignal = {
  profileId?: string;
  url?: string;
  found: boolean;
  headline?: string;
  summary?: string;
  location?: string;
  experienceTitles: string[];
  companyHints: string[];
  skills: string[];
  roleFitScore: number; // 0–1
  notes: string[];
  error?: string;
};

export type XSignal = {
  handle?: string;
  url?: string;
  found: boolean;
  displayName?: string;
  bio?: string;
  notes: string[];
  presenceScore: number; // 0–1
  error?: string;
};

export type FitJudgment = {
  fitScore: number; // 0–1
  personaMatch: string;
  strengths: string[];
  risks: string[];
  notes: string;
};

export type ScreenedAttendee = {
  attendee: NormalizedAttendee;
  heuristics: SlopHeuristics;
  slop: SlopJudgment;
  github: GithubSignal;
  linkedin: LinkedInSignal;
  x: XSignal;
  fit: FitJudgment;
  decision: Decision;
  decisionScore: number;
  rationale: string;
  /** RA-skill style triage flags */
  completenessScore?: number;
  allowlisted?: boolean;
  alreadyApproved?: boolean;
  dupEmail?: boolean;
  dupEmailKeep?: boolean;
  dupPhone?: boolean;
  dupPhoneKeep?: boolean;
  /** Final Luma bucket after human review (optional) */
  llmRecommend?: "approve" | "decline" | "";
};

export type ScreenOptions = {
  csvPath: string;
  persona: PersonaId;
  instructions: string;
  limit?: number;
  concurrency: number;
  model: string;
  apiKey: string;
  outDir: string;
  skipLlm?: boolean;
  skipProfiles?: boolean;
  enrichLinkedin?: boolean;
  enrichX?: boolean;
  /** Use fixture GitHub signals (deterministic evals / offline) */
  offlineProfiles?: boolean;
  /** Skip emails already present in outDir/scored.csv */
  resume?: boolean;
  /** Path to event_config.json (capacity, allowlist, prioritize/deprioritize) */
  eventConfigPath?: string;
  /** Fired after each attendee is screened (for live UI) */
  onAttendee?: (
    screened: ScreenedAttendee,
    progress: { done: number; total: number },
  ) => void | Promise<void>;
  onStatus?: (message: string) => void | Promise<void>;
};
