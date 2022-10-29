"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateJwt = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("config"));
const generateJwt = (id, email, role) => {
    return jsonwebtoken_1.default.sign({ id, email, role }, config_1.default.get("jwtSecret"), { expiresIn: '24h' });
};
exports.generateJwt = generateJwt;
//# sourceMappingURL=generateJwt.js.map