import express from "express";
import greetingController from "../controllers/greetingController";

const router = express.Router();

// /api/greeting
router.get("/:id", greetingController.getOne); // GET greeting

export default router;
