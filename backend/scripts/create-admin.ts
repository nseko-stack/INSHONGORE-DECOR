import bcrypt from "bcrypt";
import dotenv from "dotenv";
import pool from "../src/config/database";

dotenv.config();

const createAdmin = async () => {
  const name = "INSHONGORE Admin";
  const email = "admin@inshongoredecor.com";
  const password = "Admin@123";

  const passwordHash =
    await bcrypt.hash(password, 10);

  await pool.query(
    `
    INSERT INTO admins (
      name,
      email,
      password_hash
    )
    VALUES ($1, $2, $3)
    `,
    [
      name,
      email,
      passwordHash,
    ]
  );

  console.log("Admin created successfully");

  await pool.end();
};

createAdmin().catch((error) => {
  console.error("Failed to create admin:", error);
  process.exit(1);
});