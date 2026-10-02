import {
  Request,
  Response,
  NextFunction,
} from "express";

import {
  createGallerySchema,
  updateGallerySchema,
} from "../schemas/gallery.schema";

export const validateCreateGallery = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const result = createGallerySchema.safeParse(
    req.body
  );

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

export const validateUpdateGallery = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const result = updateGallerySchema.safeParse(
    req.body
  );

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