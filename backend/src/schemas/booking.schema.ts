import { z } from "zod";

const bookingStatusSchema = z.enum([
  "PENDING",
  "CONFIRMED",
  "COMPLETED",
  "CANCELLED",
]);

export const createBookingSchema = z.object({
  customer_name: z
    .string()
    .trim()
    .min(2, "Customer name must be at least 2 characters"),

  phone: z
    .string()
    .trim()
    .min(7, "Phone number must be at least 7 characters"),

  email: z
    .string()
    .trim()
    .email("Invalid email address")
    .optional()
    .or(z.literal("")),

  service_id: z
    .number()
    .int()
    .positive("Service ID must be a positive number"),

  event_date: z
    .string()
    .trim()
    .min(1, "Event date is required"),

  location: z
    .string()
    .trim()
    .min(2, "Location must be at least 2 characters"),

  notes: z
    .string()
    .trim()
    .optional(),

  status: bookingStatusSchema.optional(),
});

export type CreateBookingInput = z.infer<
  typeof createBookingSchema
>;

export const updateBookingSchema =
  createBookingSchema.partial();

export const updateBookingStatusSchema = z.object({
  status: bookingStatusSchema,
});

export type UpdateBookingInput = z.infer<
  typeof updateBookingSchema
>;