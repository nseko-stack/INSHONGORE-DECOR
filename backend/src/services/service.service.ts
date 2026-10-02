import pool from "../config/database";

export const getAllServices = async () => {
  const result = await pool.query(
    `SELECT *
     FROM services
     WHERE is_active = true
     ORDER BY created_at DESC`
  );

  return result.rows;
};

export const createService = async (
  name: string,
  category: string,
  description: string | null,
  price: string
) => {
  const result = await pool.query(
    `INSERT INTO services (
      name,
      category,
      description,
      price
    )
    VALUES ($1, $2, $3, $4)
    RETURNING *`,
    [name, category, description, price]
  );

  return result.rows[0];
};

export const getServiceById = async (id: number) => {
  const result = await pool.query(
    `SELECT *
     FROM services
     WHERE id = $1`,
    [id]
  );

  return result.rows[0] ?? null;
};

export const updateService = async (
  id: number,
  data: {
    name?: string;
    category?: string;
    description?: string;
    price?: string;
  }
) => {
  const fields: string[] = [];
  const values: unknown[] = [];

  if (data.name !== undefined) {
    fields.push(`name = $${values.length + 1}`);
    values.push(data.name);
  }

  if (data.category !== undefined) {
    fields.push(`category = $${values.length + 1}`);
    values.push(data.category);
  }

  if (data.description !== undefined) {
    fields.push(`description = $${values.length + 1}`);
    values.push(data.description);
  }

  if (data.price !== undefined) {
    fields.push(`price = $${values.length + 1}`);
    values.push(data.price);
  }

  fields.push(`updated_at = CURRENT_TIMESTAMP`);

  values.push(id);

  const result = await pool.query(
    `UPDATE services
     SET ${fields.join(", ")}
     WHERE id = $${values.length}
     RETURNING *`,
    values
  );

  return result.rows[0] ?? null;
};

export const deactivateService = async (id: number) => {
  const result = await pool.query(
    `UPDATE services
     SET is_active = false,
         updated_at = CURRENT_TIMESTAMP
     WHERE id = $1
     RETURNING *`,
    [id]
  );

  return result.rows[0] ?? null;
};

export const getAllServicesForAdmin = async () => {
  const result = await pool.query(`
    SELECT *
    FROM services
    ORDER BY created_at DESC
  `);

  return result.rows;
};

export const updateServiceStatus = async (
  id: number,
  isActive: boolean
) => {
  const result = await pool.query(
    `
    UPDATE services
    SET
      is_active = $1,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = $2
    RETURNING *
    `,
    [isActive, id]
  );

  return result.rows[0] ?? null;
};