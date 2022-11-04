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
    // GET /api/users
    getAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield models_1.User.findAll();
                (0, logger_1.logger)(users);
                return res.status(200 /* HTTP_CODES.OK_200 */).json({ users });
            }
            catch (error) {
                return res.status(500 /* HTTP_CODES.INTERNAL_SERVER_ERROR_500 */).json({ message: "Internal server error" });
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
                (0, logger_1.logger)(user);
                return res.status(200 /* HTTP_CODES.OK_200 */).json({ users: [user] });
            }
            catch (error) {
                return res.status(500 /* HTTP_CODES.INTERNAL_SERVER_ERROR_500 */).json({ message: "Internal server error" });
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
                return res.status(201 /* HTTP_CODES.CREATED_201 */).json({ users: [user] });
            }
            catch (error) {
                return res.status(500 /* HTTP_CODES.INTERNAL_SERVER_ERROR_500 */).json({ message: `Internal server error` });
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
                yield models_1.User.update({ firstname, lastname }, {
                    where: { id }
                });
                return res.send(204 /* HTTP_CODES.NO_CONTENT_204 */);
            }
            catch (error) {
                return res.status(500 /* HTTP_CODES.INTERNAL_SERVER_ERROR_500 */).json({ message: "Internal server error" });
            }
        });
    }
    // DELETE
    // /api/users/:id
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                yield models_1.User.destroy({
                    where: { id }
                });
                return res.send(204 /* HTTP_CODES.NO_CONTENT_204 */);
            }
            catch (error) {
                return res.status(500 /* HTTP_CODES.INTERNAL_SERVER_ERROR_500 */).json({ message: "Internal server error" });
            }
        });
    }
}
exports.default = new UserController();
//# sourceMappingURL=userController.js.map