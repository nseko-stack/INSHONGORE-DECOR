import { Request, Response } from "express";

import {
  loginAdmin,
} from "../services/auth.service";

export const loginAdminController = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      email,
      password,
    } = req.body;

    const result = await loginAdmin(
      email,
      password
    );

    if (result.error === "INVALID_CREDENTIALS") {
      res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });

      return;
    }

    res
  .cookie("admin_token", result.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite:
      process.env.NODE_ENV === "production"
        ? "none"
        : "lax",
    maxAge: 24 * 60 * 60 * 1000,
  })
  .status(200)
  .json({
    success: true,
    message: "Login successful",
    admin: result.admin,
  });
  } catch (error) {
    console.error(
      "Admin login error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Login failed",
    });
  }
};

export const logoutAdminController = (
  _req: Request,
  res: Response
) => {
  res
    .clearCookie("admin_token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite:
        process.env.NODE_ENV === "production"
          ? "none"
          : "lax",
    })
    .status(200)
    .json({
      success: true,
      message: "Logout successful",
    });
};

export const getCurrentAdminController = (
  req: Request,
  res: Response
) => {
  if (!req.admin) {
    res.status(401).json({
      success: false,
      message: "Not authenticated",
    });

    return;
  }

  res.status(200).json({
    success: true,
    admin: req.admin,
  });
};