import { User } from "../models";
import { logger } from "../utils/logger";
import { HTTP_CODES } from "../utils/http-codes";
import { Request, Response } from "express";
import { RequestWithBody, RequestWithParams, RequestWithParamsAndBody } from "../types";
import { UserBody, UserParams, UserModel } from "../types/user";
import { Model } from "sequelize";

//  /api/users
class UserController {
    // GET
    async getAll(req: Request, res: Response<Model<UserModel>[]>) {
        const users = await User.findAll();
        logger(users);
        return res.status(HTTP_CODES.OK_200).json(users);
    }
    async getOne(req: RequestWithParams<UserParams>, res: Response<Model<UserModel> | null>) {
        const { id } = req.params;
        const user = await User.findOne({
            where: { id }
        });
        logger(user);
        return res.status(HTTP_CODES.OK_200).json(user);
    }
    // POST
    async create(req: RequestWithBody<UserBody>, res: Response) {
        const { firstname, lastname } = req.body
        const user = await User.create({ firstname, lastname });
        logger(user);        
        return res.status(HTTP_CODES.CREATED_201).json({ user })
    }
    // PUT
    async update(req: RequestWithParamsAndBody<UserParams, UserBody>, res: Response) {
        const { id } = req.params;
        const { firstname, lastname } = req.body;
        await User.update({ firstname, lastname }, {
            where: { id }
        });
        return res.status(HTTP_CODES.NO_CONTENT_204).json({});
    }
    // DELETE
    async delete(req: RequestWithParams<UserParams>, res: Response) {
        const { id } = req.params;
        await User.destroy({
            where: { id }
        });
        return res.status(HTTP_CODES.NO_CONTENT_204).json({});
    }
}

export default new UserController();