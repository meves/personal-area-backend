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
class AuthController {
    constructor() {
        this.ifRequestMethodIsOptions = (method) => {
            return method === "OPTIONS";
        };
        this.getBearerToken = (header) => {
            return header.split(" ")[1]; // "Bearer <token>"
        };
        this.generateJwt = (dataForToken) => {
            return jsonwebtoken_1.default.sign(dataForToken, config_1.default.get("jwtSecret"), { expiresIn: '24h' });
        };
    }
    // GET /api/auth
    auth(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.ifRequestMethodIsOptions(req.method)) {
                next();
            }
            try {
                const token = this.getBearerToken(req.headers.authorization);
                if (!token) {
                    return res
                        .status(401 /* HTTP_CODES.UNAUTHORIZED_401 */)
                        .json(this.setAuthModel("", "User is not authorized", new Error("Unauthorized")));
                }
                this.decodedToken = jsonwebtoken_1.default.verify(token, config_1.default.get("jwtSecret"));
                const newToken = this.generateJwt({
                    id: this.decodedToken.id,
                    email: this.decodedToken.email,
                    role: this.decodedToken.role
                });
                return res
                    .status(200 /* HTTP_CODES.OK_200 */)
                    .json(this.setAuthModel(newToken, "", null));
            }
            catch (error) {
                return res
                    .status(500 /* HTTP_CODES.INTERNAL_SERVER_ERROR_500 */)
                    .json(this.setAuthModel("", "User is not authorized", new Error("Unauthorized")));
            }
        });
    }
    // POST /api/signup
    signup(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password, role } = req.body;
            if (!email || !password) {
                return res
                    .status(400 /* HTTP_CODES.BAD_REQUEST_400 */)
                    .json(this.setAuthModel("", "Email or password is incorrect", new Error("Credentials is incorrect")));
            }
            try {
                const candidate = yield models_1.Registration.findOne({ where: { email } });
                if (!!candidate) {
                    return res
                        .status(409 /* HTTP_CODES.CONFLICT_409 */)
                        .json(this.setAuthModel("", `User with email ${email} already exists`, new Error("Already exists")));
                }
                const hashPassword = yield bcrypt_1.default.hash(password, 12);
                const registration = yield models_1.Registration.create({ id: Number(new Date), email, password: hashPassword, role });
                const token = this.generateJwt({
                    id: registration.id,
                    email: registration.email,
                    role: registration.role
                });
                return res
                    .status(201 /* HTTP_CODES.CREATED_201 */)
                    .json(this.setAuthModel(token, "", null));
            }
            catch (error) {
                return res
                    .status(500 /* HTTP_CODES.INTERNAL_SERVER_ERROR_500 */)
                    .json(this.setAuthModel("", "Internal server error", new Error("Server error")));
            }
        });
    }
    // POST /api/signin
    signin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = req.body;
            if (!email || !password) {
                return res
                    .status(400 /* HTTP_CODES.BAD_REQUEST_400 */)
                    .json(this.setAuthModel("", "Email or password is incorrect", new Error("Credentials is incorrect")));
            }
            try {
                const registration = yield models_1.Registration.findOne({ where: { email } });
                if (!registration) {
                    return res
                        .status(400 /* HTTP_CODES.BAD_REQUEST_400 */)
                        .json(this.setAuthModel("", "Email or password is incorrect", new Error("Credentials is incorrect")));
                }
                const comparedPassword = bcrypt_1.default.compareSync(password, registration.password);
                if (!comparedPassword) {
                    return res
                        .status(400 /* HTTP_CODES.BAD_REQUEST_400 */)
                        .json(this.setAuthModel("", "Email or password is incorrect", new Error("Credentials is incorrect")));
                }
                const token = this.generateJwt({
                    id: registration.id,
                    email: registration.email,
                    role: registration.role
                });
                return res
                    .status(200 /* HTTP_CODES.OK_200 */)
                    .json(this.setAuthModel(token, "", null));
            }
            catch (error) {
                return res
                    .status(500 /* HTTP_CODES.INTERNAL_SERVER_ERROR_500 */)
                    .json(this.setAuthModel("", "Internal server error", new Error("Server error")));
            }
        });
    }
    setAuthModel(token, message, error) {
        return { token, message, error };
    }
}
exports.default = new AuthController();
//# sourceMappingURL=authController.js.map