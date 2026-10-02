import { Request, Response } from "express";

import {
  createContactMessage,
  getAllContactMessages,
  getContactMessageById,
  updateContactMessageStatus,
  deleteContactMessage,
} from "../services/contact.service";

import {
  createContactSchema,
  updateContactStatusSchema,
} from "../schemas/contact.schema";

export const createContactMessageController =
  async (
    req: Request,
    res: Response
  ) => {
    try {
      const validation =
        createContactSchema.safeParse(
          req.body
        );

      if (!validation.success) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors:
            validation.error.issues,
        });
      }

      const contactMessage =
        await createContactMessage(
          validation.data
        );

      return res.status(201).json({
        success: true,
        message:
          "Your inquiry has been sent successfully",
        data: contactMessage,
      });
    } catch (error) {
      console.error(
        "Create contact message error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to send your inquiry",
      });
    }
  };

  export const getAllContactMessagesController =
  async (
    _req: Request,
    res: Response
  ) => {
    try {
      const messages =
        await getAllContactMessages();

      return res.status(200).json({
        success: true,
        messages,
      });
    } catch (error) {
      console.error(
        "Get contact messages error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to fetch contact messages",
      });
    }
  };

  export const getContactMessageController =
  async (
    req: Request,
    res: Response
  ) => {
    try {
      const id = Number(req.params.id);

      if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
          success: false,
          message: "Invalid message ID",
        });
      }

      const message =
        await getContactMessageById(id);

      if (!message) {
        return res.status(404).json({
          success: false,
          message: "Message not found",
        });
      }

      return res.status(200).json({
        success: true,
        message,
      });
    } catch (error) {
      console.error(
        "Get contact message error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to fetch contact message",
      });
    }
  };

  export const updateContactMessageStatusController =
  async (
    req: Request,
    res: Response
  ) => {
    try {
      const id = Number(req.params.id);

      if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
          success: false,
          message: "Invalid message ID",
        });
      }

      const validation =
        updateContactStatusSchema.safeParse(
          req.body
        );

      if (!validation.success) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors:
            validation.error.issues,
        });
      }

      const updatedMessage =
        await updateContactMessageStatus(
          id,
          validation.data.status
        );

      if (!updatedMessage) {
        return res.status(404).json({
          success: false,
          message: "Message not found",
        });
      }

      return res.status(200).json({
        success: true,
        message:
          "Message status updated successfully",
        data: updatedMessage,
      });
    } catch (error) {
      console.error(
        "Update contact status error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to update message status",
      });
    }
  };

  export const deleteContactMessageController =
  async (
    req: Request,
    res: Response
  ) => {
    try {
      const id = Number(req.params.id);

      if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
          success: false,
          message: "Invalid message ID",
        });
      }

      const deletedMessage =
        await deleteContactMessage(id);

      if (!deletedMessage) {
        return res.status(404).json({
          success: false,
          message: "Message not found",
        });
      }

      return res.status(200).json({
        success: true,
        message:
          "Message deleted successfully",
        data: deletedMessage,
      });
    } catch (error) {
      console.error(
        "Delete contact message error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to delete message",
      });
    }
  };
