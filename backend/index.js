import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.config.js";
import authRoutes from "./routes/auth.route.js";
import carRoutes from "./routes/car.route.js";

dotenv.config();
connectDB();
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Hi from express app" });
});

app.use("/api/auth", authRoutes);
app.use("/api/car", carRoutes);

app.listen(process.env.PORT);
