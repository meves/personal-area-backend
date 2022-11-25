import { NextFunction, Request, Response } from "express";
import { RegistrationBody, RequestWithBody } from "../types";
import { HTTP_CODES } from "../utils/http-codes";
import { Registration } from "../models";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import config from "config";


// utils
const generateJwt = (id: string, email: string, role: string) => {
    return jwt.sign({ id, email, role }, config.get("jwtSecret"), { expiresIn: '24h' });
}

// types 
type AuthModel = {
    token: string
    message: string
    error: any
}


class AuthController {

    authModel:AuthModel = {
        token: "",
        message: "",
        error: null
    }

    // GET /api/auth
    async auth(req: Request, res: Response<AuthModel>, next: NextFunction) {
        // miss request with OPTIONS method
        if (req.method === "OPTIONS") next();
        try {
            const token: string | undefined = req.headers.authorization?.split(" ")[1]; // "Bearer <token>"
            if (!token) {
                return res.status(HTTP_CODES.UNAUTHORIZED_401).json(
                    this.setAuthModel("", "User is not authorized", new Error("Unauthorized"))
                )
            } 
            // verify a token symmetric
            const decoded: any = jwt.verify(token, config.get("jwtSecret"));
            // generate new token with user data
            const newToken = generateJwt(decoded.id, decoded.email, decoded.role);
            return res.status(HTTP_CODES.OK_200).json(
                this.setAuthModel(token, "", null)
            );
        } catch (error) {
            return res.status(HTTP_CODES.INTERNAL_SERVER_ERROR_500).json(
                this.setAuthModel("", "Internal server error", new Error("Server error"))
            );
        }
    }
    // POST /api/signup
    async signup(req: RequestWithBody<RegistrationBody>, res: Response<AuthModel>) {
        const { email, password, role } = req.body;
        if (!email || !password) {
            return res.status(HTTP_CODES.BAD_REQUEST_400).json(
                this.setAuthModel("", "Email or password is incorrect", new Error("Credentials is incorrect"))
            )
        }
        try {
            const candidate = await Registration.findOne({ where: { email } });
            if (!!candidate) {
                return res.status(HTTP_CODES.CONFLICT_409).json(
                    this.setAuthModel("", `User with email ${email} already exists`, new Error("Already exists"))
                );
            }
            const hashPassword = await bcrypt.hash(password, 12);
            const registration: any = await Registration.create({ id: Number(new Date), email, password: hashPassword, role });
            const token = generateJwt(registration.id, registration.email, registration.role);
            return res.status(HTTP_CODES.CREATED_201).json(
                this.setAuthModel(token, "", null)
            );
        } catch (error) {
            return res.status(HTTP_CODES.INTERNAL_SERVER_ERROR_500).json(
                this.setAuthModel("", "Internal server error", new Error("Server error"))
            );
        }
    }
    // POST /api/signin
    async signin(req: RequestWithBody<RegistrationBody>, res: Response<AuthModel>) {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(HTTP_CODES.BAD_REQUEST_400).json(
                this.setAuthModel("", "Email or password is incorrect", new Error("Credentials is incorrect"))
            )
        }
        try {
            const registration: any = await Registration.findOne({ where: { email } });
            if (!registration) {
                return res.status(HTTP_CODES.BAD_REQUEST_400).json(
                    this.setAuthModel("", "Email or password is incorrect", new Error("Credentials is incorrect"))
                );
            }
            const comparedPassword: boolean = bcrypt.compareSync(password, registration.password);
            if (!comparedPassword) {
                return res.status(HTTP_CODES.BAD_REQUEST_400).json(
                    this.setAuthModel("", "Email or password is incorrect", new Error("Credentials is incorrect"))
                );
            } 
            const token = generateJwt(registration.id, registration.email, registration.role);
            return res.status(HTTP_CODES.OK_200).json(
                this.setAuthModel(token, "", null)
            );
        } catch (error) {
            return res.status(HTTP_CODES.INTERNAL_SERVER_ERROR_500).json(
                this.setAuthModel("", "Internal server error", new Error("Server error"))
            );
        }
    }   

    setAuthModel( token: string, message: string, error: any ) {
        this.authModel.token = token;
        this.authModel.message = message;
        this.authModel.error = error;
        return this.authModel;
    }
}

export default new AuthController();