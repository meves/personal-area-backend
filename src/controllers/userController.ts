import { User } from "../models";
import { logger } from "../utils/logger";
import { HTTP_CODES } from "../utils/http-codes";
import { Request, Response } from "express";
import { RequestWithBody, RequestWithParams, RequestWithParamsAndBody } from "../types";
import { UserBody, UserParams } from "../types/user";
import { Op } from "sequelize";

class UserController {
    // GET /api/users
    async getAll(req: Request, res: Response) {
        try {
            const users = await User.findAll();
            logger(users);
            return res.status(HTTP_CODES.OK_200).json({ users });
        } catch (error) {
            return res.status(HTTP_CODES.INTERNAL_SERVER_ERROR_500).json({ message: "Internal server error" });
        }
    }
    // /api/users/:id
    async getOne(req: RequestWithParams<UserParams>, res: Response) {
        const { id } = req.params;
        try {
            const user = await User.findOne({
                where: { id }
            });
            logger(user);
            return res.status(HTTP_CODES.OK_200).json({ users: [user] });
        } catch (error) {
            return res.status(HTTP_CODES.INTERNAL_SERVER_ERROR_500).json({ message: "Internal server error" });
        }
    }
    // POST
    // /api/users
    async create(req: RequestWithBody<UserBody>, res: Response) {
        const { firstname, lastname } = req.body
        try {
            const user = await User.create({ id: Number(new Date()), firstname, lastname });
            logger(user);        
            return res.status(HTTP_CODES.CREATED_201).json({ users: [user] })
        } catch (error) {
            return res.status(HTTP_CODES.INTERNAL_SERVER_ERROR_500).json({ message: `Internal server error` });
        }
    }
    // PUT
    // /api/users/:id
    async update(req: RequestWithParamsAndBody<UserParams, UserBody>, res: Response) {
        const { id } = req.params;
        const { firstname, lastname } = req.body;
        try {
            await User.update({ firstname, lastname }, {
                where: { id }
            });
            return res.send(HTTP_CODES.NO_CONTENT_204);
        } catch (error) {
            return res.status(HTTP_CODES.INTERNAL_SERVER_ERROR_500).json({ message: "Internal server error" });
        }
    }
    // DELETE
    // /api/users/:id
    async delete(req: RequestWithParamsAndBody<UserParams, UserBody>, res: Response) {
        const { id } = req.params;
        try {
            await User.destroy({
                where: { id }
            });
            return res.send(HTTP_CODES.NO_CONTENT_204);
        } catch (error) {
            return res.status(HTTP_CODES.INTERNAL_SERVER_ERROR_500).json({ message: "Internal server error" });
        }
    }
}

export default new UserController();