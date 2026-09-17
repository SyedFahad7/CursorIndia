import { z } from "zod";

export const TierSchema = z.enum(["approve", "waitlist", "reject"]);
export type Tier = z.infer<typeof TierSchema>;

export const GuestAnswerSchema = z.object({
  question: z.string(),
  answer: z.string(),
});

export const GuestInputSchema = z.object({
  /** Notion page id or Luma guest id — echoed back for Workato mapping */
  id: z.string().min(1),
  name: z.string().min(1),
  email: z.string().email().or(z.string().min(3)),
  linkedinUrl: z.string().optional(),
  lumaStatus: z.string().optional(),
  registeredAt: z.string().optional(),
  answers: z.array(GuestAnswerSchema).default([]),
  /** Pre-flattened registration text if answers aren't structured */
  responseText: z.string().optional(),
});

export type GuestInput = z.infer<typeof GuestInputSchema>;

export const EventConfigSchema = z.object({
  eventName: z.string().min(1),
  batchSize: z.number().int().min(1).max(100).default(50),
  targetAccepts: z.number().int().min(1).max(5000).default(80),
  /** Host criteria Cursor must follow when scoring */
  criteria: z.string().default(""),
  /** True until host has provided criteria at least once */
  criteriaNeeded: z.boolean().default(true),
});

export type EventConfig = z.infer<typeof EventConfigSchema>;

export const ScoredGuestSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  score: z.number().min(0).max(100),
  tier: TierSchema,
  reason: z.string(),
  persona: z.string(),
  approvalMessage: z.string(),
  strengths: z.array(z.string()),
  risks: z.array(z.string()),
});

export type ScoredGuest = z.infer<typeof ScoredGuestSchema>;

export const ScreenBatchRequestSchema = z.object({
  guests: z.array(GuestInputSchema).min(1).max(100),
  criteria: z.string().optional(),
  eventName: z.string().optional(),
  /** How many accepts already in Notion — used to prefer waitlist near capacity */
  alreadyAccepted: z.number().int().min(0).default(0),
  targetAccepts: z.number().int().min(1).optional(),
});

export type ScreenBatchRequest = z.infer<typeof ScreenBatchRequestSchema>;

export const ScreenBatchResponseSchema = z.object({
  ok: z.literal(true),
  criteriaUsed: z.string(),
  screened: z.array(ScoredGuestSchema),
  summary: z.object({
    approve: z.number(),
    waitlist: z.number(),
    reject: z.number(),
    remainingAcceptSlots: z.number(),
  }),
});

export type ScreenBatchResponse = z.infer<typeof ScreenBatchResponseSchema>;

export const BatchJudgeItemSchema = z.object({
  id: z.string(),
  score: z.number().min(0).max(100),
  tier: TierSchema,
  reason: z.string(),
  persona: z.string(),
  strengths: z.array(z.string()),
  risks: z.array(z.string()),
});

export const BatchJudgeSchema = z.object({
  guests: z.array(BatchJudgeItemSchema),
});
