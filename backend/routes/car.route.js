import {
  createCar,
  allCars,
  getCarByid,
  updateCar,
  deleteCar,
} from "../controller/car.controller.js";
import { authenticate } from "../middleware/auth.js";
import express from "express";
import upload from "../config/multer.js";

const router = express.Router();

router.post("/", upload.array("images"), createCar);
router.get("/", allCars);
router.get("/:id", getCarByid);
router.put("/:id", upload.array("images"), updateCar);
router.delete("/:id", deleteCar);

export default router;
