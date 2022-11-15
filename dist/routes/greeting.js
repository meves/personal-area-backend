"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const greetingController_1 = __importDefault(require("../controllers/greetingController"));
const router = express_1.default.Router();
// /api/greeting
router.get("/:id", greetingController_1.default.getOne); // GET greeting
exports.default = router;
//# sourceMappingURL=greeting.js.map