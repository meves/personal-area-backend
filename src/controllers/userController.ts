import { User } from "../models";
import { logger } from "../utils/logger";
import { HTTP_CODES } from "../utils/http-codes";
import { Request, Response } from "express";
import { RequestWithBody, RequestWithParams, RequestWithParamsAndBody } from "../types";
import { UserBody, UserParams } from "../types";
import { Model } from "sequelize";


type User = {
    id: number
    firstname: string
    lastname: string
    createdAt: Date
    updatedAt: Date
}

type UsersModel = {
    users: Model<User> []
    message: string
    error: any
}

class UserController {

    userModel: UsersModel = {
        users: [],
        message: "",
        error: null
    }
    
    // GET /api/users
    async getAll(req: Request, res: Response<UsersModel>) {
        try {
            const users: Model<User>[] = await User.findAll();
            logger(users);
            return res.status(HTTP_CODES.OK_200).json(
                this.setUserModel(users, "", null)
            );
        } catch (error) {
            this.setUserModel([], "Internal server error", error)
            return res.status(HTTP_CODES.INTERNAL_SERVER_ERROR_500).json(
                this.userModel
            );
        }
    }
    // /api/users/:id
    async getOne(req: RequestWithParams<UserParams>, res: Response<UsersModel>) {
        const { id } = req.params;
        try {
            const user: Model<User> | null = await User.findOne({
                where: { id }
            });
            if (!user) {
                return res.status(HTTP_CODES.NOT_FOUND_404).json(
                    this.setUserModel([], "The requested user not found", new Error("User not found"))
                )
            }
            logger(user);
            return res.status(HTTP_CODES.OK_200).json(
                this.setUserModel([user as Model<User>], "", null)
            );
        } catch (error) {
            return res.status(HTTP_CODES.INTERNAL_SERVER_ERROR_500).json(
                this.setUserModel([], "Internal server error", error)
            );
        }
    }
    // POST
    // /api/users
    async create(req: RequestWithBody<UserBody>, res: Response<UsersModel>) {
        const { firstname, lastname } = req.body
        try {
            const user: Model<User> | null = await User.create({ id: Number(new Date()), firstname, lastname });
            logger(user);        
            return res.status(HTTP_CODES.CREATED_201).json(
                this.setUserModel([user as Model<User>], "", null)
            );
        } catch (error) {
            return res.status(HTTP_CODES.INTERNAL_SERVER_ERROR_500).json(
                this.setUserModel([], "Internal server error", error)
            );
        }
    }
    // PUT
    // /api/users/:id
    async update(req: RequestWithParamsAndBody<UserParams, UserBody>, res: Response<UsersModel>) {
        const { id } = req.params;
        const { firstname, lastname } = req.body;
        try {
            const affectedCount: number[] = await User.update({ firstname, lastname }, {
                where: { id }
            });
            return res.status(HTTP_CODES.OK_200).json(
                this.setUserModel([], "", null)
            );
        } catch (error) {
            return res.status(HTTP_CODES.INTERNAL_SERVER_ERROR_500).json(
                this.setUserModel([], "Internal server error", error)
            );
        }
    }
    // DELETE
    // /api/users/:id
    async delete(req: RequestWithParamsAndBody<UserParams, UserBody>, res: Response<UsersModel>) {
        const { id } = req.params;
        try {
            const deletedCount: number = await User.destroy({
                where: { id }
            });
            return res.status(HTTP_CODES.OK_200).json(
                this.setUserModel([], "", null)
            );
        } catch (error) {
            return res.status(HTTP_CODES.INTERNAL_SERVER_ERROR_500).json(
                this.setUserModel([], "Internal server error", error)
            );
        }
    }

    setUserModel( users: Model<User>[], message: string, error: any ) {
        this.userModel.users = users;
        this.userModel.message = message;
        this.userModel.error = error;
        return this.userModel;
    }
}

export default new UserController();