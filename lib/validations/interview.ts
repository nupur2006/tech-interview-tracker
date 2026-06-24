import { z } from "zod";
import { InterviewType, InterviewOutcome } from "@prisma/client";

export const interviewSchema = z.object({
  applicationId: z.string().min(1, "Application ID is required"),
  round: z.coerce.number().min(1).default(1),
  type: z.nativeEnum(InterviewType).default(InterviewType.VIDEO),
  scheduledAt: z.coerce.date(),
  durationMinutes: z.coerce.number().min(1).default(60),
  location: z.string().optional(),
  interviewerName: z.string().optional(),
  interviewerRole: z.string().optional(),
  outcome: z.nativeEnum(InterviewOutcome).default(InterviewOutcome.PENDING),
  notes: z.string().optional(),
});

export type InterviewInput = z.infer<typeof interviewSchema>;
