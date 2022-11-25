import { Response } from "express";
import { Model } from "sequelize";
import { Greeting } from "../models";
import { RequestWithParams, GreetingParams } from "../types";
import { HTTP_CODES } from "../utils/http-codes";
import { logger } from "../utils/logger";

type GreetingMessage = {
    id: number
    message: string
}
type GreetingModel = { 
    greeting: Model<any, GreetingMessage> | null    
    error: any
}

class GreetingController {
    // GET
    // /api/greeting/:id
    async getOne(req: RequestWithParams<GreetingParams>, res: Response<GreetingModel>) {
        const { id } = req.params;
        try {
            const greeting = await Greeting.findOne({
                where: { id }
            });
            logger(greeting);
            return res.status(HTTP_CODES.OK_200).json({ 
                greeting: greeting,
                error: null
            });
        } catch (error: any) {
            return res.status(HTTP_CODES.INTERNAL_SERVER_ERROR_500).json({ 
                greeting: null,
                error: error 
            } );
        }
    }
}

export default new GreetingController();
