import { z } from "zod";

export const followUpSchema = z
  .object({
    title: z
      .string()
      .min(1, "Title is required")
      .max(200, "Title must be under 200 characters"),
    dueDate: z.coerce.date(),
    contactId: z.string().optional(),
    applicationId: z.string().optional(),
  })
  .refine((data) => data.contactId || data.applicationId, {
    message: "Either a contact or an application must be specified",
    path: ["contactId"],
  });

export type FollowUpInput = z.infer<typeof followUpSchema>;
