import {
  Request,
  Response,
  NextFunction,
} from "express";

import jwt from "jsonwebtoken";

export const authenticateAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies.admin_token;

    if (!token) {
      res.status(401).json({
        success: false,
        message: "Authentication required",
      });

      return;
    }

    const jwtSecret =
      process.env.JWT_SECRET ??
      process.env.JWT_SECRETE ??
      "dev-local-jwt-secret";

    const decoded = jwt.verify(
      token,
      jwtSecret
    ) as {
      id: number;
      email: string;
    };

    req.admin = {
      id: decoded.id,
      email: decoded.email,
    };

    next();
  } catch (error) {
    console.error(
      "Authentication error:",
      error
    );

    res.status(401).json({
      success: false,
      message: "Invalid or expired session",
    });
  }
};