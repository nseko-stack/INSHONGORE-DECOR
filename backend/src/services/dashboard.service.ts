
import pool from "../config/database";

/*
 * Get the numbers displayed on the admin dashboard.
 */
export const getDashboardStats = async () => {
  const result = await pool.query(`
    SELECT
      (SELECT COUNT(*) FROM bookings) AS total_bookings,

      (
        SELECT COUNT(*)
        FROM bookings
        WHERE status = 'PENDING'
      ) AS pending_bookings,

      (
        SELECT COUNT(*)
        FROM services
        WHERE is_active = true
      ) AS total_services,

      (
        SELECT COUNT(*)
        FROM gallery_images
        WHERE is_active = true
      ) AS total_gallery_images
  `);

  const stats = result.rows[0];

  return {
    totalBookings: Number(stats.total_bookings),
    pendingBookings: Number(stats.pending_bookings),
    totalServices: Number(stats.total_services),
    totalGalleryImages: Number(stats.total_gallery_images),
  };
};


/*
 * Get the latest bookings for the dashboard.
 */
export const getRecentBookings = async () => {
  const result = await pool.query(`
    SELECT
      bookings.id,
      bookings.customer_name,
      bookings.event_date,
      bookings.status,

      services.name AS service_name

    FROM bookings

    JOIN services
      ON bookings.service_id = services.id

    ORDER BY bookings.created_at DESC

    LIMIT 5
  `);

  return result.rows;
};

