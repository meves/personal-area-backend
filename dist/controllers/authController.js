"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("../models");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("config"));
// utils
const generateJwt = (id, email, role) => {
    return jsonwebtoken_1.default.sign({ id, email, role }, config_1.default.get("jwtSecret"), { expiresIn: '24h' });
};
class AuthController {
    // GET /api/auth
    auth(req, res, next) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            // miss request with OPTIONS method
            if (req.method === "OPTIONS")
                next();
            try {
                const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1]; // "Bearer <token>"
                if (!token) {
                    return res.status(401 /* HTTP_CODES.UNAUTHORIZED_401 */).json({ message: "User is not authorized" });
                }
                // verify a token symmetric
                const decoded = jsonwebtoken_1.default.verify(token, config_1.default.get("jwtSecret"));
                // generate new token with user data
                const newToken = generateJwt(decoded.id, decoded.email, decoded.role);
                return res.status(200 /* HTTP_CODES.OK_200 */).json({ newToken });
            }
            catch (error) {
                console.log(`error in request: ${error}`);
                return res.status(401 /* HTTP_CODES.UNAUTHORIZED_401 */).json({ message: "User is not authorized" });
            }
        });
    }
    // POST /api/signup
    signup(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password, role } = req.body;
            if (!email || !password) {
                return res.status(400 /* HTTP_CODES.BAD_REQUEST_400 */).json({ message: "Email or password is incorrect" });
            }
            const candidate = yield models_1.Registration.findOne({ where: { email } });
            if (!!candidate) {
                return res.status(400 /* HTTP_CODES.BAD_REQUEST_400 */).json({ message: `User with email ${email} already exists` });
            }
            const hashPassword = yield bcrypt_1.default.hash(password, 12);
            const registration = yield models_1.Registration.create({ email, password: hashPassword, role });
            const token = generateJwt(registration.id, registration.email, registration.role);
            return res.status(201 /* HTTP_CODES.CREATED_201 */).json({ token });
        });
    }
    // POST /api/signin
    signin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = req.body;
            if (!email || !password) {
                return res.status(400 /* HTTP_CODES.BAD_REQUEST_400 */).json({ message: "Email or password is incorrect" });
            }
            const registration = yield models_1.Registration.findOne({ where: { email } });
            if (!registration) {
                return res.status(500 /* HTTP_CODES.INTERNAL_SERVER_ERROR_500 */).json({ message: "User or password is incorrect" });
            }
            const comparedPassword = bcrypt_1.default.compareSync(password, registration.password);
            if (!comparedPassword) {
                return res.status(500 /* HTTP_CODES.INTERNAL_SERVER_ERROR_500 */).json({ message: "User or password is incorrect" });
            }
            const token = generateJwt(registration.id, registration.email, registration.role);
            return res.status(200 /* HTTP_CODES.OK_200 */).json({ token });
        });
    }
    // DELETE /api/signout
    signout(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
}
exports.default = new AuthController();
//# sourceMappingURL=authController.js.map