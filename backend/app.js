import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.config.js";
import authRoutes from "./routes/auth.route.js";
import carRoutes from "./routes/car.route.js";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";

dotenv.config();
connectDB();
const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(morgan("dev"));
app.use(
  cors({
    origin: process.env.CLIENT, // ✅ Your frontend's domain
    credentials: true, // ✅ Allow cookies/headers with credentials
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.get("/", (req, res) => {
  res.json({ message: "Hi from express app" });
});

app.use("/api/auth", authRoutes);
app.use("/api/cars", carRoutes);

// In Express.js backend
app.post("/api/auth/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "none", // <-- must match how you set it
    secure: true,
    domain: undefined,
  });
  res.clearCookie("refreshToken", {
    httpOnly: true,
    sameSite: "none", // <-- must match how you set it
    secure: true,
    domain: undefined,
  });
  res.status(200).json({ message: "Logged out successfully" });
});

app.listen(process.env.PORT, () => console.log("express sever is runnnig"));
