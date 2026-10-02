
import { Router } from "express";

import {
  getDashboardController,
} from "../controllers/dashboard.controller";

import {
  authenticateAdmin,
} from "../middleware/auth.middleware";

const router = Router();

/*
 * Dashboard is only available to authenticated admins.
 */
router.get(
  "/",
  authenticateAdmin,
  getDashboardController
);

export default router;

