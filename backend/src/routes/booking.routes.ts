import { Router } from "express";

import {
  getBookings,
  getBooking,
  createBookingController,
  updateBookingController,
  updateBookingStatusController,
  deleteBookingController,
} from "../controllers/booking.controller";

import {
  validateCreateBooking,
  validateUpdateBooking,
  validateBookingStatus,
} from "../middleware/booking.validation";

import {
  authenticateAdmin,
} from "../middleware/auth.middleware";

const router = Router();

// Public booking submissions
router.post(
  "/",
  validateCreateBooking,
  createBookingController
);

// GET /api/bookings
router.get(
  "/",
  authenticateAdmin,
  getBookings
);

router.get(
  "/:id",
  authenticateAdmin,
  getBooking
);

router.patch(
  "/:id/status",
  authenticateAdmin,
  validateBookingStatus,
  updateBookingStatusController
);

router.patch(
  "/:id",
  authenticateAdmin,
  validateUpdateBooking,
  updateBookingController
);

router.delete(
  "/:id",
  authenticateAdmin,
  deleteBookingController
);

export default router;
