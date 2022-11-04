import express from "express";
import authController from "../controllers/authController";

const router = express.Router();

// /api
router.get("/auth", authController.auth);
router.post("/signup", authController.signup);
router.post("/signin", authController.signin);

export default router;