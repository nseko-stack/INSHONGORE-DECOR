import { Router } from "express";

import {
  getCurrentAdminController,
  loginAdminController,
  logoutAdminController,
} from "../controllers/auth.controller";

import {
  validateAdminLogin,
} from "../middleware/auth.validation";

import {
  authenticateAdmin,
} from "../middleware/auth.middleware";

const router = Router();

router.post(
  "/login",
  validateAdminLogin,
  loginAdminController
);

router.post(
  "/logout",
  logoutAdminController
);

router.get(
  "/me",
  authenticateAdmin,
  getCurrentAdminController
);
export default router;
