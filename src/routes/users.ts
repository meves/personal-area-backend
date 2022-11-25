import express from 'express';
import userController from '../controllers/userController';

const router = express.Router();

// /api/users
router.get("/", userController.getAll.bind(userController)); /* GET users listing */
router.get("/:id", userController.getOne.bind(userController)); /* GET specific user */
router.post("/", userController.create.bind(userController)); /* POST create user */
router.put("/:id", userController.update.bind(userController)); /* PUT update specific user */
router.delete("/:id", userController.delete.bind(userController)); /* DELETE delete specific user */

export default router;
