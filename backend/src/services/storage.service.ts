import supabase from "../config/supabase";

export const uploadGalleryImage = async (
  file: Express.Multer.File
) => {
  const fileExtension = file.originalname
    .split(".")
    .pop();

  const fileName = `${Date.now()}-${Math.random()
    .toString(36)
    .substring(2)}.${fileExtension}`;

  const filePath = `gallery/${fileName}`;

  const { error } = await supabase.storage
    .from("gallery")
    .upload(filePath, file.buffer, {
      contentType: file.mimetype,
      upsert: false,
    });

  if (error) {
    throw error;
  }

  const { data } = supabase.storage
    .from("gallery")
    .getPublicUrl(filePath);

  return data.publicUrl;
};

export const deleteGalleryImage = async (
  imageUrl: string
) => {
  const marker = "/storage/v1/object/public/gallery/";

  const index = imageUrl.indexOf(marker);

  if (index === -1) {
    throw new Error(
      "Invalid Supabase gallery image URL"
    );
  }

  const filePath = imageUrl.substring(
    index + marker.length
  );

  const { error } = await supabase.storage
    .from("gallery")
    .remove([filePath]);

  if (error) {
    throw error;
  }
};

export const replaceGalleryImage = async (
  oldImageUrl: string,
  file: Express.Multer.File
) => {
  // Upload the new image first
  const newImageUrl =
    await uploadGalleryImage(file);

  try {
    // Delete the old image only after
    // the new image has uploaded successfully
    await deleteGalleryImage(oldImageUrl);

    return newImageUrl;
  } catch (error) {
    // If deleting the old image fails,
    // keep the new image because it is valid.
    console.error(
      "Failed to delete old gallery image:",
      error
    );

    return newImageUrl;
  }
};