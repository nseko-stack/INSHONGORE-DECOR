import { Router } from "express";

import {
  getGalleryImages,
  getGalleryImage,
  createGalleryImageController,
  updateGalleryImageController,
  deleteGalleryImageController,
} from "../controllers/gallery.controller";

import {
  validateCreateGallery,
  validateUpdateGallery,
} from "../middleware/gallery.validation";
import upload from "../middleware/upload.middleware";

import {
  uploadGalleryImageController,
} from "../controllers/gallery.controller";

import {
  authenticateAdmin,
} from "../middleware/auth.middleware";

const router = Router();


// GET /api/gallery
router.get("/", getGalleryImages);
router.get("/:id", getGalleryImage);

router.post(
  "/upload",
  upload.single("image"),
  uploadGalleryImageController
);

router.get("/:id", getGalleryImage);

router.post(
  "/",
  authenticateAdmin,
  upload.single("image"),
  validateCreateGallery,
  createGalleryImageController
);

router.patch(
  "/:id",
  authenticateAdmin,
  upload.single("image"),
  updateGalleryImageController
);

router.delete(
  "/:id",
  authenticateAdmin,
  deleteGalleryImageController
);
export default router;