import express from "express";
import authController from "../controllers/authController";

const router = express.Router();

// /api
router.get("/auth", authController.auth.bind(authController));
router.post("/signup", authController.signup.bind(authController));
router.post("/signin", authController.signin.bind(authController));

export default router;