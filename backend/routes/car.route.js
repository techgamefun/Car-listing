  import {
    createCar,
    allCars,
    getCarByid,
    editCar,
    deleteCar,
  } from "../controller/car.controller.js";
  import { authenticate } from "../middleware/auth.js";
  import express from "express";
  import upload from "../config/multer.js";

  const router = express.Router();

  router.post("/", upload.array("images"), createCar);
  router.get("/", allCars);
  router.get("/:id", getCarByid);
  router.put("/:id", editCar);
  router.delete("/:id", deleteCar);

  export default router;
