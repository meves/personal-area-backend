"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = __importDefault(require("../controllers/authController"));
const router = express_1.default.Router();
// /api
router.get("/auth", authController_1.default.auth);
router.post("/signup", authController_1.default.signup);
router.post("/signin", authController_1.default.signin);
exports.default = router;
//# sourceMappingURL=auth.js.map