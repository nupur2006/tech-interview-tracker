import { z } from "zod";
import { TimelineEventType } from "@prisma/client";

export const timelineEventSchema = z.object({
  applicationId: z.string().min(1, "Application ID is required"),
  type: z.nativeEnum(TimelineEventType).default(TimelineEventType.NOTE),
  date: z.coerce.date(),
  title: z.string().min(1, "Title is required").max(100, "Title is too long"),
  description: z.string().optional(),
});

export type TimelineEventInput = z.infer<typeof timelineEventSchema>;
