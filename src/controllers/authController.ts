import { NextFunction, Request, Response } from "express";
import { RequestWithBody } from "../types";
import { RegistrationBody, } from "../types/registration";
import { HTTP_CODES } from "../utils/http-codes";
import { Registration } from "../models";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import config from "config";


// utils
const generateJwt = (id: string, email: string, role: string) => {
    return jwt.sign({ id, email, role }, config.get("jwtSecret"), { expiresIn: '24h' });
}

class AuthController {
    // GET /api/auth
    async auth(req: Request, res: Response, next: NextFunction) {
        // miss request with OPTIONS method
        if (req.method === "OPTIONS") next();
        try {
            const token: string | undefined = req.headers.authorization?.split(" ")[1]; // "Bearer <token>"
            if (!token) {
                return res.status(HTTP_CODES.UNAUTHORIZED_401).json({ message: "User is not authorized" });
            } 
            // verify a token symmetric
            const decoded: any = jwt.verify(token, config.get("jwtSecret"));
            // generate new token with user data
            const newToken = generateJwt(decoded.id, decoded.email, decoded.role);
            return res.status(HTTP_CODES.OK_200).json({ token: newToken });
        } catch (error) {
            return res.status(HTTP_CODES.UNAUTHORIZED_401).json({ message: "User is not authorized" });
        }
    }
    // POST /api/signup
    async signup(req: RequestWithBody<RegistrationBody>, res: Response) {
        const { email, password, role } = req.body;
        if (!email || !password) {
            return res.status(HTTP_CODES.BAD_REQUEST_400).json({ message: "Email or password is incorrect" })
        }
        const candidate = await Registration.findOne({ where: { email } });
        if (!!candidate) {
            return res.status(HTTP_CODES.CONFLICT_409).json({ message: `User with email ${email} already exists` });
        }
        const hashPassword = await bcrypt.hash(password, 12);
        const registration: any = await Registration.create({ id: Number(new Date), email, password: hashPassword, role });
        const token = generateJwt(registration.id, registration.email, registration.role);
        return res.status(HTTP_CODES.CREATED_201).json({ token });
    }
    // POST /api/signin
    async signin(req: Request, res: Response) {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(HTTP_CODES.BAD_REQUEST_400).json({ message: "Email or password is not filled" })
        }
        const registration: any = await Registration.findOne({ where: { email } });
        if (!registration) {
            return res.status(HTTP_CODES.INTERNAL_SERVER_ERROR_500).json({ message: "User or password is incorrect" });
        }
        const comparedPassword: boolean = bcrypt.compareSync(password, registration.password);
        if (!comparedPassword) {
            return res.status(HTTP_CODES.INTERNAL_SERVER_ERROR_500).json({ message: "User or password is incorrect" });
        } 
        const token = generateJwt(registration.id, registration.email, registration.role);
        return res.status(HTTP_CODES.OK_200).json({ token });
    }   
}

export default new AuthController();