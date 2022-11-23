"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Greeting = exports.User = exports.Registration = void 0;
const sequelize_1 = require("sequelize");
const db_1 = __importDefault(require("../db"));
exports.Registration = db_1.default.define("Registration", {
    id: { type: sequelize_1.DataTypes.BIGINT, primaryKey: true },
    email: { type: sequelize_1.DataTypes.STRING, allowNull: false, unique: true },
    password: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    role: { type: sequelize_1.DataTypes.STRING, defaultValue: "USER" }
}, {
    tableName: "registrations"
});
exports.User = db_1.default.define("User", {
    id: { type: sequelize_1.DataTypes.BIGINT, primaryKey: true },
    firstname: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    lastname: { type: sequelize_1.DataTypes.STRING, allowNull: false }
}, {
    tableName: "users"
});
exports.Greeting = db_1.default.define("Greeting", {
    id: { type: sequelize_1.DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    message: { type: sequelize_1.DataTypes.STRING, allowNull: false }
}, {
    tableName: "greetings",
    timestamps: false
});
//# sourceMappingURL=index.js.map