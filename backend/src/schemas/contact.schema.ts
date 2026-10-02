import { z } from "zod";

export const createContactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters"),

  email: z
    .string()
    .trim()
    .email("Please provide a valid email address"),

  phone: z
    .string()
    .trim()
    .optional(),

  subject: z
    .string()
    .trim()
    .min(2, "Subject must be at least 2 characters"),

  message: z
    .string()
    .trim()
    .min(
      10,
      "Message must be at least 10 characters"
    ),
});

export type CreateContactInput = z.infer<
  typeof createContactSchema
>;

export const updateContactStatusSchema =
  z.object({
    status: z.enum([
      "UNREAD",
      "READ",
      "REPLIED",
    ]),
  });

export type UpdateContactStatusInput =
  z.infer<
    typeof updateContactStatusSchema
  >;