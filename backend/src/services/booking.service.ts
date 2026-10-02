import pool from "../config/database";

/**
 * Get all bookings
 */
export const getAllBookings = async () => {
  const result = await pool.query(`
    SELECT
      bookings.id,
      bookings.customer_name,
      bookings.phone,
      bookings.email,
      bookings.event_date,
      bookings.location,
      bookings.notes,
      bookings.status,
      bookings.created_at,
      bookings.updated_at,

      services.id AS service_id,
      services.name AS service_name,
      services.category AS service_category

    FROM bookings

    JOIN services
      ON bookings.service_id = services.id

    ORDER BY bookings.created_at DESC
  `);

  return result.rows;
};


/**
 * Get one booking by ID
 */
export const getBookingById = async (id: number) => {
  const result = await pool.query(
    `
    SELECT
      bookings.id,
      bookings.customer_name,
      bookings.phone,
      bookings.email,
      bookings.event_date,
      bookings.location,
      bookings.notes,
      bookings.status,
      bookings.created_at,
      bookings.updated_at,

      services.id AS service_id,
      services.name AS service_name,
      services.category AS service_category

    FROM bookings

    JOIN services
      ON bookings.service_id = services.id

    WHERE bookings.id = $1
    `,
    [id]
  );

  return result.rows[0] ?? null;
};


/**
 * Create a booking
 */
export const createBooking = async (
  customer_name: string,
  phone: string,
  email: string | null,
  service_id: number,
  event_date: string,
  location: string,
  notes: string | null,
  status?: string
) => {
  const result = await pool.query(
    `
    INSERT INTO bookings (
      customer_name,
      phone,
      email,
      service_id,
      event_date,
      location,
      notes,
      status
    )
    VALUES (
      $1,
      $2,
      $3,
      $4,
      $5,
      $6,
      $7,
      COALESCE($8, 'PENDING')
    )
    RETURNING *
    `,
    [
      customer_name,
      phone,
      email,
      service_id,
      event_date,
      location,
      notes,
      status,
    ]
  );

  return result.rows[0];
};


/**
 * Update a booking
 */
export const updateBooking = async (
  id: number,
  data: {
    customer_name?: string;
    phone?: string;
    email?: string;
    service_id?: number;
    event_date?: string;
    location?: string;
    notes?: string;
    status?: string;
  }
) => {
  const fields: string[] = [];
  const values: unknown[] = [];

  if (data.customer_name !== undefined) {
    fields.push(`customer_name = $${values.length + 1}`);
    values.push(data.customer_name);
  }

  if (data.phone !== undefined) {
    fields.push(`phone = $${values.length + 1}`);
    values.push(data.phone);
  }

  if (data.email !== undefined) {
    fields.push(`email = $${values.length + 1}`);
    values.push(data.email);
  }

  if (data.service_id !== undefined) {
    fields.push(`service_id = $${values.length + 1}`);
    values.push(data.service_id);
  }

  if (data.event_date !== undefined) {
    fields.push(`event_date = $${values.length + 1}`);
    values.push(data.event_date);
  }

  if (data.location !== undefined) {
    fields.push(`location = $${values.length + 1}`);
    values.push(data.location);
  }

  if (data.notes !== undefined) {
    fields.push(`notes = $${values.length + 1}`);
    values.push(data.notes);
  }

  if (data.status !== undefined) {
    fields.push(`status = $${values.length + 1}`);
    values.push(data.status);
  }

  fields.push(`updated_at = CURRENT_TIMESTAMP`);

  values.push(id);

  const result = await pool.query(
    `
    UPDATE bookings
    SET ${fields.join(", ")}
    WHERE id = $${values.length}
    RETURNING *
    `,
    values
  );

  return result.rows[0] ?? null;
};


/**
 * Delete a booking
 *
 * Unlike services, we're physically deleting it for now.
 */
export const deleteBooking = async (id: number) => {
  const result = await pool.query(
    `
    DELETE FROM bookings
    WHERE id = $1
    RETURNING *
    `,
    [id]
  );

  return result.rows[0] ?? null;
};

export const updateBookingStatus = async (
  id: number,
  newStatus: string
) => {
  const existingBooking = await pool.query(
    `
    SELECT id, status
    FROM bookings
    WHERE id = $1
    `,
    [id]
  );

  const booking = existingBooking.rows[0];

  if (!booking) {
    return {
      error: "NOT_FOUND",
    };
  }

  const currentStatus = booking.status;

  const allowedTransitions: Record<string, string[]> = {
    PENDING: ["CONFIRMED", "CANCELLED"],
    CONFIRMED: ["COMPLETED"],
    COMPLETED: [],
    CANCELLED: [],
  };

  const allowedStatuses =
    allowedTransitions[currentStatus] ?? [];

  if (!allowedStatuses.includes(newStatus)) {
    return {
      error: "INVALID_TRANSITION",
      currentStatus,
      requestedStatus: newStatus,
    };
  }

  const result = await pool.query(
    `
    UPDATE bookings
    SET
      status = $1,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = $2
    RETURNING *
    `,
    [newStatus, id]
  );

  return {
    booking: result.rows[0],
  };
};