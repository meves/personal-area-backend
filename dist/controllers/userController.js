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
    constructor() {
        this.userModel = {
            users: [],
            message: "",
            error: null
        };
    }
    // GET /api/users
    getAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield models_1.User.findAll();
                (0, logger_1.logger)(users);
                return res.status(200 /* HTTP_CODES.OK_200 */).json(this.setUserModel(users, "", null));
            }
            catch (error) {
                this.setUserModel([], "Internal server error", error);
                return res.status(500 /* HTTP_CODES.INTERNAL_SERVER_ERROR_500 */).json(this.userModel);
            }
        });
    }
    // /api/users/:id
    getOne(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                const user = yield models_1.User.findOne({
                    where: { id }
                });
                if (!user) {
                    return res.status(404 /* HTTP_CODES.NOT_FOUND_404 */).json(this.setUserModel([], "The requested user not found", new Error("User not found")));
                }
                (0, logger_1.logger)(user);
                return res.status(200 /* HTTP_CODES.OK_200 */).json(this.setUserModel([user], "", null));
            }
            catch (error) {
                return res.status(500 /* HTTP_CODES.INTERNAL_SERVER_ERROR_500 */).json(this.setUserModel([], "Internal server error", error));
            }
        });
    }
    // POST
    // /api/users
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { firstname, lastname } = req.body;
            try {
                const user = yield models_1.User.create({ id: Number(new Date()), firstname, lastname });
                (0, logger_1.logger)(user);
                return res.status(201 /* HTTP_CODES.CREATED_201 */).json(this.setUserModel([user], "", null));
            }
            catch (error) {
                return res.status(500 /* HTTP_CODES.INTERNAL_SERVER_ERROR_500 */).json(this.setUserModel([], "Internal server error", error));
            }
        });
    }
    // PUT
    // /api/users/:id
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const { firstname, lastname } = req.body;
            try {
                const affectedCount = yield models_1.User.update({ firstname, lastname }, {
                    where: { id }
                });
                return res.status(200 /* HTTP_CODES.OK_200 */).json(this.setUserModel([], "", null));
            }
            catch (error) {
                return res.status(500 /* HTTP_CODES.INTERNAL_SERVER_ERROR_500 */).json(this.setUserModel([], "Internal server error", error));
            }
        });
    }
    // DELETE
    // /api/users/:id
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                const deletedCount = yield models_1.User.destroy({
                    where: { id }
                });
                return res.status(200 /* HTTP_CODES.OK_200 */).json(this.setUserModel([], "", null));
            }
            catch (error) {
                return res.status(500 /* HTTP_CODES.INTERNAL_SERVER_ERROR_500 */).json(this.setUserModel([], "Internal server error", error));
            }
        });
    }
    setUserModel(users, message, error) {
        this.userModel.users = users;
        this.userModel.message = message;
        this.userModel.error = error;
        return this.userModel;
    }
}
exports.default = new UserController();
//# sourceMappingURL=userController.js.map