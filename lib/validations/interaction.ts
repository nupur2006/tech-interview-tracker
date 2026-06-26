import { z } from "zod";

export const INTERACTION_TYPES = [
  "EMAIL",
  "PHONE_CALL",
  "MEETING",
] as const;

export type InteractionTypeValue = (typeof INTERACTION_TYPES)[number];

export const INTERACTION_TYPE_LABELS: Record<InteractionTypeValue, string> = {
  EMAIL: "Email",
  PHONE_CALL: "Phone Call",
  MEETING: "Meeting",
};

export const interactionSchema = z.object({
  contactId: z.string().min(1, "Contact ID is required"),
  type: z.enum(INTERACTION_TYPES, {
    required_error: "Interaction type is required",
  }),
  date: z.coerce.date({
    required_error: "Date is required",
  }),
  summary: z
    .string()
    .min(1, "Summary is required")
    .max(2000, "Summary must be under 2000 characters"),
});

export type InteractionInput = z.infer<typeof interactionSchema>;
