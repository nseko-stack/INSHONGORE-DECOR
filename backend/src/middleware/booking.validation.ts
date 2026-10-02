import { Request, Response, NextFunction } from "express";

import {
  createBookingSchema,
  updateBookingSchema,
  updateBookingStatusSchema,
} from "../schemas/booking.schema";

export const validateCreateBooking = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const result = createBookingSchema.safeParse(req.body);

  if (!result.success) {
    res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: result.error.issues,
    });

    return;
  }

  req.body = result.data;

  next();
};

export const validateUpdateBooking = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const result = updateBookingSchema.safeParse(req.body);

  if (!result.success) {
    res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: result.error.issues,
    });

    return;
  }

  if (Object.keys(result.data).length === 0) {
    res.status(400).json({
      success: false,
      message: "At least one field is required",
    });

    return;
  }

  req.body = result.data;

  next();
};

export const validateBookingStatus = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const result = updateBookingStatusSchema.safeParse(req.body);

  if (!result.success) {
    res.status(400).json({
      success: false,
      message: "Invalid booking status",
      errors: result.error.issues,
    });

    return;
  }

  req.body = result.data;

  next();
};
