import { Request, Response } from "express";

import {
  getAllBookings,
  getBookingById,
  createBooking,
  updateBooking,
  updateBookingStatus,
  deleteBooking,
} from "../services/booking.service";


/**
 * GET /api/bookings
 */
export const getBookings = async (
  _req: Request,
  res: Response
) => {
  try {
    const bookings = await getAllBookings();

    return res.status(200).json({
      success: true,
      data: bookings,
    });
  } catch (error) {
    console.error("Error fetching bookings:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch bookings",
    });
  }
};


/**
 * GET /api/bookings/:id
 */
export const getBooking = async (
  req: Request,
  res: Response
) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking ID",
      });
    }

    const booking = await getBookingById(id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    console.error("Error fetching booking:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch booking",
    });
  }
};


/**
 * POST /api/bookings
 */
export const createBookingController = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      customer_name,
      phone,
      email,
      service_id,
      event_date,
      location,
      notes,
      status,
    } = req.body;

    const booking = await createBooking(
      customer_name,
      phone,
      email || null,
      service_id,
      event_date,
      location,
      notes || null,
      status
    );

    return res.status(201).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    console.error("Error creating booking:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create booking",
    });
  }
};


/**
 * PATCH /api/bookings/:id
 */
export const updateBookingController = async (
  req: Request,
  res: Response
) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking ID",
      });
    }

    const booking = await updateBooking(
      id,
      req.body
    );

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    console.error("Error updating booking:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update booking",
    });
  }
};


/**
 * DELETE /api/bookings/:id
 */
export const deleteBookingController = async (
  req: Request,
  res: Response
) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking ID",
      });
    }

    const booking = await deleteBooking(id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Booking deleted successfully",
      data: booking,
    });
  } catch (error) {
    console.error("Error deleting booking:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete booking",
    });
  }
};

/**
 * PATCH /api/bookings/:id/status
 */
export const updateBookingStatusController = async (
  req: Request,
  res: Response
) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking ID",
      });
    }

    const { status } = req.body;

    const result = await updateBookingStatus(
      id,
      status
    );

    if (result.error === "NOT_FOUND") {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    if (result.error === "INVALID_TRANSITION") {
      return res.status(409).json({
        success: false,
        message: `Cannot change booking from ${result.currentStatus} to ${result.requestedStatus}`,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Booking status updated successfully",
      data: result.booking,
    });
  } catch (error) {
    console.error(
      "Error updating booking status:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to update booking status",
    });
  }
};