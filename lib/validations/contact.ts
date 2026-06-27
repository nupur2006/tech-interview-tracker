import { z } from "zod";

export const CONTACT_RELATIONSHIPS = [
  "Recruiter",
  "Hiring Manager",
  "Referral",
  "Interviewer",
  "Other",
] as const;

export type ContactRelationship = (typeof CONTACT_RELATIONSHIPS)[number];

export const contactSchema = z.object({
  applicationId: z.string().min(1, "Application ID is required"),
  name: z.string().min(1, "Name is required").max(100, "Name is too long"),
  email: z
    .string()
    .email("Must be a valid email")
    .optional()
    .or(z.literal("")),
  phone: z.string().optional(),
  linkedIn: z
    .string()
    .url("Must be a valid URL")
    .optional()
    .or(z.literal("")),
  role: z.string().optional(),
  relationship: z.string().optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;
