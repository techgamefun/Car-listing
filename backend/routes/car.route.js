import { createCar, allcars } from "../controller/car.controller.js";
import { authenticate } from "../middleware/auth.js";
import express from "express";

const router = express.Router();

router.post("/createcar", authenticate, createCar);
router.get("/allcars", allcars);

export default router;
