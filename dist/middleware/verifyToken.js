"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("config"));
const authMiddleware = (req, res, next) => {
    var _a;
    // miss request with OPTION method
    if (req.method === "OPTION")
        next();
    try {
        const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1]; // "Bearer <token>"
        if (!token) {
            return res.status(401 /* HTTP_CODES.UNAUTHORIZED_401 */).json({ message: "User is not authorized" });
        }
        // verify a token symmetric
        return jsonwebtoken_1.default.verify(token, config_1.default.get("jwtSecret"));
    }
    catch (error) {
        return res.status(401 /* HTTP_CODES.UNAUTHORIZED_401 */).json({ message: "User is not authorized" });
    }
};
exports.authMiddleware = authMiddleware;
//# sourceMappingURL=verifyToken.js.map