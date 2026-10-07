import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";

import serviceRoutes from "./routes/service.routes";
import bookingRoutes from "./routes/booking.routes";
import galleryRoutes from "./routes/gallery.routes";
import authRoutes from "./routes/auth.routes";
import dashboardRoutes from "./routes/dashboard.routes";
import contactRoutes from "./routes/contact.routes";
import cookieParser from "cookie-parser";

const envPaths = [
  path.resolve(process.cwd(), ".env"),
  path.resolve(process.cwd(), "..", ".env"),
];

for (const envPath of envPaths) {
  dotenv.config({ path: envPath });
}

if (!process.env.JWT_SECRET && !process.env.JWT_SECRETE) {
  console.warn(
    "JWT_SECRET is not set. Using a development fallback secret. Set JWT_SECRET in your environment before production use."
  );
  process.env.JWT_SECRET = "dev-local-jwt-secret";
}

const app = express();

const PORT = Number(process.env.PORT) || 5000;

const configuredOrigins = [
  process.env.CORS_ORIGIN,
  process.env.FRONTEND_URL,
  "http://localhost:3001,http://127.0.0.1:3000",
]
  .filter(Boolean)
  .flatMap((origins) => origins!.split(","))
  .map((origin) => origin.trim())
  .filter(Boolean);

const corsOptions = {
  origin: (origin: string | undefined, callback: (error: Error | null, allow?: boolean) => void) => {
    if (!origin || configuredOrigins.includes(origin)) {
      callback(null, true);
      return;
    }

    callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.options(/^(.*)$/, cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.get("/", (_req, res) => {
  res.json({
    message: "INSHONGORE DECOR API is running",
  });
});

app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "inshongore-decor-api",
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/gallery", galleryRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/contact", contactRoutes);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});