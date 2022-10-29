"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const config_1 = __importDefault(require("config"));
const sequelize = new sequelize_1.Sequelize(config_1.default.get('dBase.database'), config_1.default.get('dBase.username'), config_1.default.get('dBase.password'), {
    host: config_1.default.get('dBase.host'),
    dialect: 'mysql'
});
exports.default = sequelize;
//# sourceMappingURL=db.js.map