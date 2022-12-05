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

    // api/users
    public async getAll(req: Request, res: Response<UsersModel>) {
        try {
            const users: Model<User>[] = await User.findAll();
            logger(users);
            return res
                    .status(HTTP_CODES.OK_200)
                    .json(this.setUserModel(null, users)
            );
        } catch (error) {
            return res
                    .status(HTTP_CODES.INTERNAL_SERVER_ERROR_500)
                    .json(this.setUserModel(new ServerError(error))
            );
        }
    }
    // api/users/:id
    public async getOne(req: RequestWithParams<UserParams>, res: Response<UsersModel>) {
        const { id } = req.params;
        try {
            const user = await User.findOne({
                where: { id }
            });
            if (!user) {
                return res
                        .status(HTTP_CODES.NOT_FOUND_404)
                        .json(this.setUserModel(new ServerError("User not found"))
                )
            }
            logger(user);
            return res
                    .status(HTTP_CODES.OK_200)
                    .json(this.setUserModel(null, [user])
            );
        } catch (error) {
            return res
                    .status(HTTP_CODES.INTERNAL_SERVER_ERROR_500)
                    .json(this.setUserModel(new ServerError(error))
            );
        }
    }
    // api/users
    public async create(req: RequestWithBody<UserBody>, res: Response<UsersModel>) {
        const { firstname, lastname } = req.body
        try {
            const user = await User.create({ id: Number(new Date()), firstname, lastname });
            logger(user);        
            return res
                    .status(HTTP_CODES.CREATED_201)
                    .json(this.setUserModel(null, [user])
            );
        } catch (error) {
            return res
                    .status(HTTP_CODES.INTERNAL_SERVER_ERROR_500)
                    .json(this.setUserModel(new ServerError(error))
            );
        }
    }
    // api/users/:id
    public async update(req: RequestWithParamsAndBody<UserParams, UserBody>, res: Response<UsersModel>) {
        const { id } = req.params;
        const { firstname, lastname } = req.body;
        try {
            await User.update({ firstname, lastname }, {
                where: { id }
            });
            return res
                    .status(HTTP_CODES.OK_200)
                    .json(this.setUserModel()
            );
        } catch (error) {
            return res
                .status(HTTP_CODES.INTERNAL_SERVER_ERROR_500)
                .json(this.setUserModel(new ServerError(error))
            );
        }
    }
    // api/users/:id
    public async delete(req: RequestWithParamsAndBody<UserParams, UserBody>, res: Response<UsersModel>) {
        const { id } = req.params;
        try {
            await User.destroy({
                where: { id }
            });
            return res
                    .status(HTTP_CODES.OK_200)
                    .json(this.setUserModel()
            );
        } catch (error) {
            return res
                    .status(HTTP_CODES.INTERNAL_SERVER_ERROR_500)
                    .json(this.setUserModel(new ServerError(error))
            );
        }
    }

    private setUserModel( error: ServerError | null = null, users: Model<User>[] = [] ) {
        return { 
            users, 
            message: error ? error.getMessage() : "", 
            error: error ? error.getError() : error }
    }
}

export default new UserController();

class ServerError {
    private message: string = "Internal server error";
    private error: any = null;

    constructor(error: any) {
        this.error = error;
    }

    getMessage(): string {
        return this.message
    }

    getError() {
        return this.error
    }
}