import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.config.js";
import authRoutes from "./routes/auth.route.js";
import carRoutes from "./routes/car.route.js";
import cors from "cors";

dotenv.config();
connectDB();
const app = express();
app.use(cors());

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Hi from express app" });
});

app.use("/api/auth", authRoutes);
app.use("/api/cars", carRoutes);

app.listen(process.env.PORT);
