
import { Request, Response } from "express";

import {
  getDashboardStats,
  getRecentBookings,
} from "../services/dashboard.service";


export const getDashboardController = async (
  _req: Request,
  res: Response
) => {
  try {
    const stats = await getDashboardStats();

    const recentBookings =
      await getRecentBookings();

    res.status(200).json({
      success: true,

      stats,

      recentBookings,
    });
  } catch (error) {
    console.error(
      "Dashboard error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to load dashboard data",
    });
  }
};

