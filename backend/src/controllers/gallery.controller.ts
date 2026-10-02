import { Request, Response } from "express";

import {
  getAllGalleryImages,
  getGalleryImageById,
  createGalleryImage,
  updateGalleryImage,
  deleteGalleryImage as deleteGalleryImageFromDatabase,
} from "../services/gallery.service";

import {
  uploadGalleryImage,
  deleteGalleryImage as deleteGalleryImageFromStorage,
  replaceGalleryImage,
} from "../services/storage.service";

/**
 * GET /api/gallery
 */
export const getGalleryImages = async (
  _req: Request,
  res: Response
) => {
  try {
    const images = await getAllGalleryImages();

    return res.status(200).json({
      success: true,
      data: images,
    });
  } catch (error) {
    console.error(
      "Error fetching gallery images:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch gallery images",
    });
  }
};

/**
 * GET /api/gallery/:id
 */
export const getGalleryImage = async (
  req: Request,
  res: Response
) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid gallery image ID",
      });
    }

    const image = await getGalleryImageById(id);

    if (!image) {
      return res.status(404).json({
        success: false,
        message: "Gallery image not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: image,
    });
  } catch (error) {
    console.error(
      "Error fetching gallery image:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch gallery image",
    });
  }
};

/**
 * POST /api/gallery
 */
export const createGalleryImageController =
  async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "Image file is required",
        });
      }

      const imageUrl =
        await uploadGalleryImage(req.file);

      const {
        title,
        description,
        category,
        is_featured,
      } = req.body;

      const galleryImage =
        await createGalleryImage(
          title,
          description || null,
          imageUrl,
          category || null,
          is_featured === "true" ||
            is_featured === true
        );

      return res.status(201).json({
        success: true,
        message:
          "Gallery image created successfully",
        gallery: galleryImage,
      });
    } catch (error) {
      console.error(
        "Create gallery image error:",
        error
      );

      return res.status(500).json({
        success: false,
        message: "Failed to create gallery image",
      });
    }
  };

/**
 * PATCH /api/gallery/:id
 */
export const updateGalleryImageController =
  async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);

      if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
          success: false,
          message: "Invalid gallery image ID",
        });
      }

      // Find existing gallery image
      const existingImage =
        await getGalleryImageById(id);

      if (!existingImage) {
        return res.status(404).json({
          success: false,
          message: "Gallery image not found",
        });
      }

      let imageUrl =
        existingImage.image_url;

      // If a new image was uploaded,
      // replace the old image
      if (req.file) {
        imageUrl =
          await replaceGalleryImage(
            existingImage.image_url,
            req.file
          );
      }

      const {
        title,
        description,
        category,
        is_featured,
        is_active,
      } = req.body;

      const updatedImage =
        await updateGalleryImage(id, {
          title,
          description,
          category,
          is_featured:
            is_featured !== undefined
              ? is_featured === "true" ||
                is_featured === true
              : undefined,
          is_active:
            is_active !== undefined
              ? is_active === "true" ||
                is_active === true
              : undefined,
          image_url: imageUrl,
        });

      if (!updatedImage) {
        return res.status(404).json({
          success: false,
          message: "Gallery image not found",
        });
      }

      return res.status(200).json({
        success: true,
        message:
          "Gallery image updated successfully",
        data: updatedImage,
      });
    } catch (error) {
      console.error(
        "Error updating gallery image:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to update gallery image",
      });
    }
  };
/**
 * DELETE /api/gallery/:id
 */
export const deleteGalleryImageController =
  async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);

      if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
          success: false,
          message: "Invalid gallery image ID",
        });
      }

      // Find the database record first
      const galleryImage =
        await getGalleryImageById(id);

      if (!galleryImage) {
        return res.status(404).json({
          success: false,
          message: "Gallery image not found",
        });
      }

      // Delete image from Supabase Storage
      await deleteGalleryImageFromStorage(
        galleryImage.image_url
      );

      // Delete record from PostgreSQL
      const deleted =
        await deleteGalleryImageFromDatabase(id);

      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: "Gallery image not found",
        });
      }

      return res.status(200).json({
        success: true,
        message:
          "Gallery image deleted successfully",
        gallery: deleted,
      });
    } catch (error) {
      console.error(
        "Delete gallery image error:",
        error
      );

      return res.status(500).json({
        success: false,
        message: "Failed to delete gallery image",
      });
    }
  };

/**
 * POST /api/gallery/upload
 */
export const uploadGalleryImageController =
  async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "Image file is required",
        });
      }

      const imageUrl =
        await uploadGalleryImage(req.file);

      return res.status(201).json({
        success: true,
        message: "Image uploaded successfully",
        image_url: imageUrl,
      });
    } catch (error) {
      console.error(
        "Gallery upload error:",
        error
      );

      return res.status(500).json({
        success: false,
        message: "Failed to upload image",
      });
    }
  };