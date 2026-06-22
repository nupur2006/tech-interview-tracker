import { z } from "zod";
import { ApplicationStatus } from "@prisma/client";

export const applicationSchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  role: z.string().min(1, "Role is required"),
  location: z.string().optional(),
  status: z.nativeEnum(ApplicationStatus).default(ApplicationStatus.BOOKMARKED),
  appliedDate: z.date().optional().nullable(),
  jobUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  notes: z.string().optional(),
  salaryMin: z.number().min(0).optional().nullable(),
  salaryMax: z.number().min(0).optional().nullable(),
  salaryCurrency: z.string().default("USD"),
  source: z.string().optional(),
});

export type ApplicationInput = z.infer<typeof applicationSchema>;

export const updateStatusSchema = z.object({
  id: z.string(),
  status: z.nativeEnum(ApplicationStatus),
});
