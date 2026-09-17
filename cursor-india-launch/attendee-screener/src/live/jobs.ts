import { EventEmitter } from "node:events";
import type { ScreenedAttendee } from "../types.js";

export type LiveRow = {
  decision: string;
  decisionScore: number;
  name: string;
  email: string;
  slopScore: number;
  isAiSlop: boolean;
  githubScore: number;
  cursorUsedLikely: boolean;
  cursorSignals: string;
  rationale: string;
  at: string;
};

export type JobCounts = {
  accept: number;
  waitlist: number;
  reject: number;
};

export type ScreenJob = {
  id: string;
  status: "queued" | "running" | "done" | "error";
  createdAt: string;
  updatedAt: string;
  persona: string;
  csvName: string;
  outDir: string;
  total: number;
  done: number;
  counts: JobCounts;
  message: string;
  error?: string;
  rows: LiveRow[];
  reportUrl?: string;
  csvUrl?: string;
};

export function toLiveRow(r: ScreenedAttendee): LiveRow {
  return {
    decision: r.decision,
    decisionScore: r.decisionScore,
    name: r.attendee.name,
    email: r.attendee.email,
    slopScore: r.slop.score,
    isAiSlop: r.slop.isAiSlop,
    githubScore: r.github.builderScore,
    cursorUsedLikely: Boolean(r.github.cursorEvidence?.usedCursorLikely),
    cursorSignals: r.github.cursorSignals.join(" | "),
    rationale: r.rationale,
    at: new Date().toISOString(),
  };
}

export class JobStore {
  private jobs = new Map<string, ScreenJob>();
  private bus = new EventEmitter();

  constructor() {
    this.bus.setMaxListeners(50);
  }

  create(input: {
    id: string;
    persona: string;
    csvName: string;
    outDir: string;
  }): ScreenJob {
    const now = new Date().toISOString();
    const job: ScreenJob = {
      id: input.id,
      status: "queued",
      createdAt: now,
      updatedAt: now,
      persona: input.persona,
      csvName: input.csvName,
      outDir: input.outDir,
      total: 0,
      done: 0,
      counts: { accept: 0, waitlist: 0, reject: 0 },
      message: "Queued",
      rows: [],
    };
    this.jobs.set(job.id, job);
    this.emit(job.id, { type: "job", job: this.publicJob(job) });
    return job;
  }

  get(id: string): ScreenJob | undefined {
    return this.jobs.get(id);
  }

  list(): ScreenJob[] {
    const batchNum = (j: ScreenJob) => {
      const m = j.csvName.match(/^Batch\s+(\d+)/i);
      return m ? Number(m[1]) : null;
    };
    const rank = (j: ScreenJob) => {
      if (/to approve/i.test(j.csvName) || j.id.startsWith("to-approve-")) return 0;
      const n = batchNum(j);
      return n != null ? 100 + n : 10_000;
    };
    return [...this.jobs.values()].sort((a, b) => {
      const ra = rank(a);
      const rb = rank(b);
      if (ra !== rb) return ra - rb;
      const an = batchNum(a);
      const bn = batchNum(b);
      if (an != null && bn != null) {
        const ap = /prior/i.test(a.csvName) ? 1 : 0;
        const bp = /prior/i.test(b.csvName) ? 1 : 0;
        if (ap !== bp) return ap - bp;
      }
      return b.createdAt.localeCompare(a.createdAt);
    });
  }

  publicJob(job: ScreenJob, opts?: { includeRows?: boolean }) {
    const includeRows = opts?.includeRows !== false;
    return {
      id: job.id,
      status: job.status,
      createdAt: job.createdAt,
      updatedAt: job.updatedAt,
      persona: job.persona,
      csvName: job.csvName,
      outDir: job.outDir,
      total: job.total,
      done: job.done,
      counts: job.counts,
      message: job.message,
      error: job.error,
      reportUrl: job.reportUrl,
      csvUrl: job.csvUrl,
      rowCount: job.rows.length,
      /** Full row list — omit on list endpoints to keep UI snappy */
      rows: includeRows ? job.rows : undefined,
      recent: includeRows ? job.rows.slice(-40).reverse() : [],
    };
  }

  patch(id: string, patch: Partial<ScreenJob>) {
    const job = this.jobs.get(id);
    if (!job) return;
    Object.assign(job, patch, { updatedAt: new Date().toISOString() });
    this.emit(id, { type: "job", job: this.publicJob(job) });
  }

  pushRow(id: string, row: LiveRow, progress: { done: number; total: number }) {
    const job = this.jobs.get(id);
    if (!job) return;
    job.rows.push(row);
    job.done = progress.done;
    job.total = progress.total;
    job.updatedAt = new Date().toISOString();
    if (row.decision === "accept") job.counts.accept += 1;
    else if (row.decision === "waitlist") job.counts.waitlist += 1;
    else if (row.decision === "reject") job.counts.reject += 1;
    job.message = `${progress.done}/${progress.total} · ${row.name} → ${row.decision}`;
    this.emit(id, {
      type: "row",
      jobId: id,
      row,
      progress,
      counts: { ...job.counts },
      message: job.message,
    });
    this.emit(id, { type: "job", job: this.publicJob(job) });
  }

  status(id: string, message: string) {
    const job = this.jobs.get(id);
    if (!job) return;
    job.message = message;
    job.updatedAt = new Date().toISOString();
    this.emit(id, { type: "status", jobId: id, message });
  }

  subscribe(id: string, listener: (event: unknown) => void): () => void {
    const key = `job:${id}`;
    this.bus.on(key, listener);
    return () => this.bus.off(key, listener);
  }

  subscribeAll(listener: (event: unknown) => void): () => void {
    this.bus.on("all", listener);
    return () => this.bus.off("all", listener);
  }

  private emit(id: string, event: unknown) {
    this.bus.emit(`job:${id}`, event);
    this.bus.emit("all", event);
  }
}

export const jobStore = new JobStore();
