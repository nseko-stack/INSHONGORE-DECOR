import bcrypt from "bcrypt";

import {
  findAdminByEmail,
} from "./admin.service";

import pool from "../config/database";
import jwt from "jsonwebtoken";
export const registerAdmin = async (
  name: string,
  email: string,
  password: string
) => {
  const existingAdmin =
    await findAdminByEmail(email);

  if (existingAdmin) {
    return {
      error: "EMAIL_EXISTS",
    };
  }

  const passwordHash =
    await bcrypt.hash(password, 10);

  const result = await pool.query(
    `
    INSERT INTO admins (
      name,
      email,
      password_hash
    )
    VALUES ($1, $2, $3)
    RETURNING
      id,
      name,
      email,
      created_at
    `,
    [
      name,
      email,
      passwordHash,
    ]
  );

  return {
    admin: result.rows[0],
  };
};

export const loginAdmin = async (
  email: string,
  password: string
) => {
  const admin = await findAdminByEmail(email);

  if (!admin) {
    return {
      error: "INVALID_CREDENTIALS",
    };
  }

  const passwordMatches =
    await bcrypt.compare(
      password,
      admin.password_hash
    );

  if (!passwordMatches) {
    return {
      error: "INVALID_CREDENTIALS",
    };
  }

  const jwtSecret =
    process.env.JWT_SECRET ??
    process.env.JWT_SECRETE ??
    "dev-local-jwt-secret";

  const token = jwt.sign(
    {
      id: admin.id,
      email: admin.email,
    },
    jwtSecret,
    {
      expiresIn: "1d",
    }
  );

  return {
    admin: {
      id: admin.id,
      name: admin.name,
      email: admin.email,
    },
    token,
  };
};