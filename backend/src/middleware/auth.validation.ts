import {
  Request,
  Response,
  NextFunction,
} from "express";

import {
  loginAdminSchema,
} from "../schemas/admin.schema";

export const validateAdminLogin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const result =
    loginAdminSchema.safeParse(req.body);

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