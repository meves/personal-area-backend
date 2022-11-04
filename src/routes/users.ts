import express from 'express';
import userController from '../controllers/userController';

const router = express.Router();

// /api/users
router.get("/", userController.getAll); /* GET users listing */
router.get("/:id", userController.getOne); /* GET specific user */
router.post("/", userController.create); /* POST create user */
router.put("/:id", userController.update); /* PUT update specific user */
router.delete("/:id", userController.delete); /* DELETE delete specific user */

export default router;
