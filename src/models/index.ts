import { DataTypes } from "sequelize";
import sequelize from "../db";

export const Registration = sequelize.define("Registration", {
    id: { type: DataTypes.BIGINT, primaryKey: true },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    role: { type: DataTypes.STRING, defaultValue: "USER" }
}, {
    tableName: "registrations"
});

export const User = sequelize.define("User", {
        id: { type: DataTypes.BIGINT, primaryKey: true },
        firstname: { type: DataTypes.STRING, allowNull: false },
        lastname: { type: DataTypes.STRING, allowNull: false }
    }, {
        tableName: "users"
});

export const Greeting = sequelize.define("Greeting", {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        message: { type: DataTypes.STRING, allowNull: false }
    }, {
        tableName: "greetings",
        timestamps: false
});