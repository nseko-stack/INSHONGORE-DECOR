import { z } from "zod";

export const createServiceSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Service name must be at least 2 characters"),

  category: z
    .string()
    .trim()
    .min(2, "Category must be at least 2 characters"),

  description: z
    .string()
    .trim()
    .optional(),

  price: z
    .string()
    .trim()
    .min(1, "Price is required"),
});

export type CreateServiceInput = z.infer<
  typeof createServiceSchema
>;

export const updateServiceSchema =
  createServiceSchema.partial();

export type UpdateServiceInput = z.infer<
  typeof updateServiceSchema
>;
export const updateServiceStatusSchema = z.object({
  is_active: z.boolean(),
});

export type UpdateServiceStatusInput = z.infer<
  typeof updateServiceStatusSchema
>;