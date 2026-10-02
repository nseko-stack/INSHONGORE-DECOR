import { z } from "zod";

export const createGallerySchema = z.object({
  title: z
    .string()
    .trim()
    .min(2, "Title must be at least 2 characters"),

  description: z
    .string()
    .trim()
    .optional(),

  category: z
    .string()
    .trim()
    .optional(),

  is_featured: z.preprocess(
    (value) => {
      if (value === "true") return true;
      if (value === "false") return false;

      return value;
    },
    z.boolean().optional()
  ),
});

export type CreateGalleryInput = z.infer<
  typeof createGallerySchema
>;

export const updateGallerySchema =
  createGallerySchema.partial();

export type UpdateGalleryInput = z.infer<
  typeof updateGallerySchema
>;