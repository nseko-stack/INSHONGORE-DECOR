import { Router } from "express";

import {
  createContactMessageController,
  getAllContactMessagesController,
  getContactMessageController,
  updateContactMessageStatusController,
  deleteContactMessageController,
} from "../controllers/contact.controller";

import {
  authenticateAdmin,
} from "../middleware/auth.middleware";

const router = Router();

/*
 * Public
 * Customers can submit inquiries.
 */
router.post(
  "/",
  createContactMessageController
);

router.get(
  "/",
  authenticateAdmin,
  getAllContactMessagesController
);

router.patch(
  "/:id/status",
  authenticateAdmin,
  updateContactMessageStatusController
);

router.get(
  "/:id",
  authenticateAdmin,
  getContactMessageController
);

router.delete(
  "/:id",
  authenticateAdmin,
  deleteContactMessageController
);
export default router;