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
class GreetingController {
    // GET
    // /api/greeting/:id
    getOne(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                const greeting = yield models_1.Greeting.findOne({
                    where: { id }
                });
                (0, logger_1.logger)(greeting);
                return res.status(200 /* HTTP_CODES.OK_200 */).json({ data: { greeting } });
            }
            catch (error) {
                return res.status(500 /* HTTP_CODES.INTERNAL_SERVER_ERROR_500 */).json({ error });
            }
        });
    }
}
exports.default = new GreetingController();
//# sourceMappingURL=greetingController.js.map