import pool from "../config/database";

/**
 * GET all active gallery images
 */
export const getAllGalleryImages = async () => {
  const result = await pool.query(`
    SELECT *
    FROM gallery_images
    WHERE is_active = true
    ORDER BY created_at DESC
  `);

  return result.rows;
};

/**
 * GET gallery image by ID
 */
export const getGalleryImageById = async (
  id: number
) => {
  const result = await pool.query(
    `
    SELECT *
    FROM gallery_images
    WHERE id = $1
    `,
    [id]
  );

  return result.rows[0] ?? null;
};

/**
 * CREATE gallery image
 */
export const createGalleryImage = async (
  title: string,
  description: string | null,
  imageUrl: string,
  category: string | null,
  isFeatured: boolean = false
) => {
  const result = await pool.query(
    `
    INSERT INTO gallery_images (
      title,
      description,
      image_url,
      category,
      is_featured,
      is_active
    )
    VALUES ($1, $2, $3, $4, $5, true)
    RETURNING *
    `,
    [
      title,
      description,
      imageUrl,
      category,
      isFeatured,
    ]
  );

  return result.rows[0];
};

/**
 * UPDATE gallery image
 */
export const updateGalleryImage = async (
  id: number,
  data: {
    title?: string;
    description?: string;
    category?: string;
    is_featured?: boolean;
    is_active?: boolean;
    image_url?: string;
  }
) => {
  const fields: string[] = [];
  const values: unknown[] = [];
  let index = 1;

  if (data.title !== undefined) {
    fields.push(`title = $${index++}`);
    values.push(data.title);
  }

  if (data.description !== undefined) {
    fields.push(`description = $${index++}`);
    values.push(data.description);
  }

  if (data.category !== undefined) {
    fields.push(`category = $${index++}`);
    values.push(data.category);
  }

  if (data.is_featured !== undefined) {
    fields.push(`is_featured = $${index++}`);
    values.push(data.is_featured);
  }

  if (data.is_active !== undefined) {
    fields.push(`is_active = $${index++}`);
    values.push(data.is_active);
  }

  if (data.image_url !== undefined) {
    fields.push(`image_url = $${index++}`);
    values.push(data.image_url);
  }

  if (fields.length === 0) {
    return getGalleryImageById(id);
  }

  fields.push(
    `updated_at = CURRENT_TIMESTAMP`
  );

  values.push(id);

  const result = await pool.query(
    `
    UPDATE gallery_images
    SET ${fields.join(", ")}
    WHERE id = $${index}
    RETURNING *
    `,
    values
  );

  return result.rows[0] ?? null;
};

/**
 * DELETE gallery image permanently
 */
export const deleteGalleryImage = async (
  id: number
) => {
  const result = await pool.query(
    `
    DELETE FROM gallery_images
    WHERE id = $1
    RETURNING *
    `,
    [id]
  );

  return result.rows[0] ?? null;
};