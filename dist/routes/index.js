"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const users_1 = __importDefault(require("./users"));
const auth_1 = __importDefault(require("./auth"));
const router = express_1.default.Router();
// api
router.use("/", auth_1.default);
router.use("/users", users_1.default);
exports.default = router;
//# sourceMappingURL=index.js.map