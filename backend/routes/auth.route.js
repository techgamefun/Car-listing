import { register, login } from "../controller/auth.controller.js";
import express from "express";

const router = express.Router();

router.post("/login", login);
router.post("/register", register);

export default router;
