import { Request, Response } from "express";
import {
  getAllServices,
  getAllServicesForAdmin,
  createService,
  getServiceById,
  updateService, deactivateService,
  updateServiceStatus,
} from "../services/service.service";

import {
  updateServiceStatusSchema,
} from "../schemas/service.schema";

export const getServices = async (
  _req: Request,
  res: Response
) => {
  try {
    const services = await getAllServices();

    return res.status(200).json({
      success: true,
      data: services,
    });
  } catch (error) {
    console.error("Error fetching services:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch services",
    });
  }
};

export const getService = async (
  req: Request,
  res: Response
) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid service ID",
      });
    }

    const service = await getServiceById(id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: service,
    });
  } catch (error) {
    console.error("Error fetching service:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch service",
    });
  }
};
export const createServiceController = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      name,
      category,
      description,
      price,
    } = req.body;

    const service = await createService(
      name,
      category,
      description ?? null,
      price
    );

    return res.status(201).json({
      success: true,
      data: service,
    });
  } catch (error) {
    console.error("Error creating service:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create service",
    });
  }
};

export const updateServiceController = async (
  req: Request,
  res: Response
) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid service ID",
      });
    }

    const service = await updateService(id, req.body);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: service,
    });
  } catch (error) {
    console.error("Error updating service:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update service",
    });
  }
};

export const deleteServiceController = async (
  req: Request,
  res: Response
) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid service ID",
      });
    }

    const service = await deactivateService(id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Service deactivated successfully",
      data: service,
    });
  } catch (error) {
    console.error("Error deactivating service:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to deactivate service",
    });
  }
};

export const getAllServicesForAdminController = async (
  _req: Request,
  res: Response
) => {
  try {
    const services = await getAllServicesForAdmin();

    res.status(200).json({
      success: true,
      services,
    });
  } catch (error) {
    console.error(
      "Failed to fetch admin services:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch services",
    });
  }
};

export const updateServiceStatusController = async (
  req: Request,
  res: Response
) => {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid service ID",
      });

      return;
    }

    const validation =
      updateServiceStatusSchema.safeParse(req.body);

    if (!validation.success) {
      res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: validation.error.issues,
      });

      return;
    }

    const service = await updateServiceStatus(
      id,
      validation.data.is_active
    );

    if (!service) {
      res.status(404).json({
        success: false,
        message: "Service not found",
      });

      return;
    }

    res.status(200).json({
      success: true,
      message: validation.data.is_active
        ? "Service activated successfully"
        : "Service deactivated successfully",
      service,
    });
  } catch (error) {
    console.error(
      "Failed to update service status:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to update service status",
    });
  }
};