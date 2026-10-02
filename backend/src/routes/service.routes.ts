import { Router } from "express";
import { authenticateAdmin } from "../middleware/auth.middleware";

import {
  getServices,
  getService,
  createServiceController,
  updateServiceController,
  deleteServiceController,
  getAllServicesForAdminController,
  updateServiceStatusController,
} from "../controllers/service.controller";

import {
  validateCreateService,
  validateUpdateService,
} from "../middleware/service.validation";

const router = Router();

router.get("/", getServices);

router.get(
  "/admin",
  authenticateAdmin,
  getAllServicesForAdminController
);

router.patch(
  "/:id/status",
  authenticateAdmin,
  updateServiceStatusController
);

router.get("/:id", getService);

router.post(
  "/",
  validateCreateService,
  createServiceController
);

router.patch(
  "/:id",
  validateUpdateService,
  updateServiceController
);

router.delete(
  "/:id",
  deleteServiceController
);

export default router;
