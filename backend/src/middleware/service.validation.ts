import { Request, Response, NextFunction } from "express";
import { createServiceSchema, updateServiceSchema } from "../schemas/service.schema";

export const validateCreateService = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const result = createServiceSchema.safeParse(req.body);

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

export const validateUpdateService = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const result = updateServiceSchema.safeParse(req.body);

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