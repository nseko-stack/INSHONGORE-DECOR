import pool from "../config/database";
import { CreateContactInput } from "../schemas/contact.schema";

export const createContactMessage = async (
  data: CreateContactInput
) => {
  const result = await pool.query(
    `
    INSERT INTO contact_messages (
      name,
      email,
      phone,
      subject,
      message
    )
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
    `,
    [
      data.name,
      data.email,
      data.phone || null,
      data.subject,
      data.message,
    ]
  );

  return result.rows[0];
};

export const getAllContactMessages = async () => {
  const result = await pool.query(`
    SELECT *
    FROM contact_messages
    ORDER BY created_at DESC
  `);

  return result.rows;
};

export const getContactMessageById = async (
  id: number
) => {
  const result = await pool.query(
    `
    SELECT *
    FROM contact_messages
    WHERE id = $1
    `,
    [id]
  );

  return result.rows[0] ?? null;
};

export const updateContactMessageStatus = async (
  id: number,
  status: "UNREAD" | "READ" | "REPLIED"
) => {
  const result = await pool.query(
    `
    UPDATE contact_messages
    SET
      status = $1,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = $2
    RETURNING *
    `,
    [status, id]
  );

  return result.rows[0] ?? null;
};

export const deleteContactMessage = async (
  id: number
) => {
  const result = await pool.query(
    `
    DELETE FROM contact_messages
    WHERE id = $1
    RETURNING *
    `,
    [id]
  );

  return result.rows[0] ?? null;
};