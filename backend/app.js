import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.config.js";
import authRoutes from "./routes/auth.route.js";
import carRoutes from "./routes/car.route.js";
import cors from "cors";
import morgan from "morgan";

dotenv.config();
connectDB();
const app = express();

app.use(morgan("dev"));

app.use(
  cors({
    origin: "http://localhost:3000", // ✅ Your frontend's domain
    credentials: true, // ✅ Allow cookies/headers with credentials
  })
);

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Hi from express app" });
});

app.use("/api/auth", authRoutes);
app.use("/api/cars", carRoutes);

app.listen(process.env.PORT, () => console.log("express sever is runnnig"));
