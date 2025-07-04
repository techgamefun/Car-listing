import { register, login, getMe } from "../controller/auth.controller.js";
import express from "express";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

router.post("/login", login);
router.post("/register", register);
router.get("/me", authenticate, getMe);

export default router;
