"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = __importDefault(require("../controllers/userController"));
const router = express_1.default.Router();
// /api/users
router.get("/", userController_1.default.getAll); /* GET users listing */
router.get("/:id", userController_1.default.getOne); /* GET specific user */
router.post("/", userController_1.default.create); /* POST create user */
router.put("/:id", userController_1.default.update); /* PUT update specific user */
router.delete("/:id", userController_1.default.delete); /* DELETE delete specific user */
exports.default = router;
//# sourceMappingURL=users.js.map