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
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("../models");
const logger_1 = require("../utils/logger");
class UserController {
    // api/users
    getAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield models_1.User.findAll();
                (0, logger_1.logger)(users);
                return res
                    .status(200 /* HTTP_CODES.OK_200 */)
                    .json(this.setUserModel(null, users));
            }
            catch (error) {
                return res
                    .status(500 /* HTTP_CODES.INTERNAL_SERVER_ERROR_500 */)
                    .json(this.setUserModel(new ServerError(error)));
            }
        });
    }
    // api/users/:id
    getOne(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                const user = yield models_1.User.findOne({
                    where: { id }
                });
                if (!user) {
                    return res
                        .status(404 /* HTTP_CODES.NOT_FOUND_404 */)
                        .json(this.setUserModel(new ServerError("User not found")));
                }
                (0, logger_1.logger)(user);
                return res
                    .status(200 /* HTTP_CODES.OK_200 */)
                    .json(this.setUserModel(null, [user]));
            }
            catch (error) {
                return res
                    .status(500 /* HTTP_CODES.INTERNAL_SERVER_ERROR_500 */)
                    .json(this.setUserModel(new ServerError(error)));
            }
        });
    }
    // api/users
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { firstname, lastname } = req.body;
            try {
                const user = yield models_1.User.create({ id: Number(new Date()), firstname, lastname });
                (0, logger_1.logger)(user);
                return res
                    .status(201 /* HTTP_CODES.CREATED_201 */)
                    .json(this.setUserModel(null, [user]));
            }
            catch (error) {
                return res
                    .status(500 /* HTTP_CODES.INTERNAL_SERVER_ERROR_500 */)
                    .json(this.setUserModel(new ServerError(error)));
            }
        });
    }
    // api/users/:id
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const { firstname, lastname } = req.body;
            try {
                yield models_1.User.update({ firstname, lastname }, {
                    where: { id }
                });
                return res
                    .status(200 /* HTTP_CODES.OK_200 */)
                    .json(this.setUserModel());
            }
            catch (error) {
                return res
                    .status(500 /* HTTP_CODES.INTERNAL_SERVER_ERROR_500 */)
                    .json(this.setUserModel(new ServerError(error)));
            }
        });
    }
    // api/users/:id
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                yield models_1.User.destroy({
                    where: { id }
                });
                return res
                    .status(200 /* HTTP_CODES.OK_200 */)
                    .json(this.setUserModel());
            }
            catch (error) {
                return res
                    .status(500 /* HTTP_CODES.INTERNAL_SERVER_ERROR_500 */)
                    .json(this.setUserModel(new ServerError(error)));
            }
        });
    }
    setUserModel(error = null, users = []) {
        return {
            users,
            message: error ? error.getMessage() : "",
            error: error ? error.getError() : error
        };
    }
}
exports.default = new UserController();
class ServerError {
    constructor(error) {
        this.message = "Internal server error";
        this.error = null;
        this.error = error;
    }
    getMessage() {
        return this.message;
    }
    getError() {
        return this.error;
    }
}
//# sourceMappingURL=userController.js.map