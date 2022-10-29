import express from "express";
import userRouter from "./users";
import authRouter from "./auth";

const router = express.Router();

// api
router.use("/", authRouter);
router.use("/users", userRouter);

export default router;
