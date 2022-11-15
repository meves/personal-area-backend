import { Response } from "express";
import { Greeting } from "../models";
import { RequestWithParams } from "../types";
import { GreetingParams } from "../types/greeting";
import { HTTP_CODES } from "../utils/http-codes";
import { logger } from "../utils/logger";

class GreetingController {
    // GET
    // /api/greeting/:id
    async getOne(req: RequestWithParams<GreetingParams>, res: Response) {
        const { id } = req.params;
        try {
            const greeting = await Greeting.findOne({
                where: { id }
            });
            logger(greeting);
            return res.status(HTTP_CODES.OK_200).json({ data: { greeting }});
        } catch (error) {
            return res.status(HTTP_CODES.INTERNAL_SERVER_ERROR_500).json({ error } );
        }
    }
}

export default new GreetingController();
