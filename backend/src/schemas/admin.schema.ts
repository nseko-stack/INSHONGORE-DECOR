import { z } from "zod";

export const registerAdminSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters"),

  email: z
    .string()
    .trim()
    .email("Invalid email address"),

  password: z
    .string()
    .min(
      8,
      "Password must be at least 8 characters"
    ),
});

export type RegisterAdminInput = z.infer<
  typeof registerAdminSchema
>;

export const loginAdminSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Invalid email address"),

  password: z
    .string()
    .min(1, "Password is required"),
});

export type LoginAdminInput = z.infer<
  typeof loginAdminSchema
>;