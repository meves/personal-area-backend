import express from "express";
import userRouter from "./users";
import authRouter from "./auth";
import greetingRouter from "./greeting";

const router = express.Router();

// api
router.use("/", authRouter);
router.use("/users", userRouter);
router.use("/greeting", greetingRouter);

export default router;
