import { NextFunction, Request, Response } from "express";
import { ClientModel, RegistrationBody, RequestWithBody } from "../types";
import { HTTP_CODES } from "../utils/http-codes";
import { Registration } from "../models";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import config from "config";


type DataForToken = {
    id: string
    email: string
    role: string
}

type Token = {
    token: string
}

type AuthModel = ClientModel<Token>


class AuthController {

    private decodedToken: any;    
    
    // GET /api/auth
    public async auth(req: Request, res: Response<AuthModel>, next: NextFunction) {
        if (this.ifRequestMethodIsOptions(req.method)) {
            next();
        }
        try {
            const token: string | undefined = this.getBearerToken(req.headers.authorization);
            if (!token) {
                return res
                        .status(HTTP_CODES.UNAUTHORIZED_401)
                        .json(this.setAuthModel("", "User is not authorized", new Error("Unauthorized")))
            } 
            this.decodedToken = jwt.verify(token, config.get("jwtSecret"));
            const newToken = this.generateJwt({
                id: this.decodedToken.id, 
                email: this.decodedToken.email, 
                role: this.decodedToken.role
            });
            return res
                    .status(HTTP_CODES.OK_200)
                    .json(this.setAuthModel(newToken, "", null));
        } catch (error) {
            return res
                    .status(HTTP_CODES.INTERNAL_SERVER_ERROR_500)
                    .json(this.setAuthModel("", "User is not authorized", new Error("Unauthorized")));
        }
    }

    private ifRequestMethodIsOptions = (method: string) => {
        return method === "OPTIONS";
    }

    private getBearerToken = (header: any) => {
        return header.split(" ")[1]; // "Bearer <token>"
    }

    // POST /api/signup
    public async signup(req: RequestWithBody<RegistrationBody>, res: Response<AuthModel>) {
        const { email, password, role } = req.body;
        if (!email || !password) {
            return res
                    .status(HTTP_CODES.BAD_REQUEST_400)
                    .json(this.setAuthModel("", "Email or password is incorrect", new Error("Credentials is incorrect")));
        }
        try {
            const candidate = await Registration.findOne({ where: { email } });
            if (!!candidate) {
                return res
                        .status(HTTP_CODES.CONFLICT_409)
                        .json(this.setAuthModel("", `User with email ${email} already exists`, new Error("Already exists")));
            }
            const hashPassword = await bcrypt.hash(password, 12);
            const registration: any = await Registration.create({ id: Number(new Date), email, password: hashPassword, role });
            const token = this.generateJwt({
                id: registration.id, 
                email: registration.email, 
                role: registration.role
            });
            return res
                    .status(HTTP_CODES.CREATED_201)
                    .json(this.setAuthModel(token, "", null));
        } catch (error) {
            return res
                    .status(HTTP_CODES.INTERNAL_SERVER_ERROR_500)
                    .json(this.setAuthModel("", "Internal server error", new Error("Server error")));
        }
    }
    // POST /api/signin
    public async signin(req: RequestWithBody<RegistrationBody>, res: Response<AuthModel>) {
        const { email, password } = req.body;
        if (!email || !password) {
            return res
                    .status(HTTP_CODES.BAD_REQUEST_400)
                    .json(this.setAuthModel("", "Email or password is incorrect", new Error("Credentials is incorrect")));
        }
        try {
            const registration: any = await Registration.findOne({ where: { email } });
            if (!registration) {
                return res
                        .status(HTTP_CODES.BAD_REQUEST_400)
                        .json(this.setAuthModel("", "Email or password is incorrect", new Error("Credentials is incorrect")));
            }
            const comparedPassword: boolean = bcrypt.compareSync(password, registration.password);
            if (!comparedPassword) {
                return res
                        .status(HTTP_CODES.BAD_REQUEST_400)
                        .json(this.setAuthModel("", "Email or password is incorrect", new Error("Credentials is incorrect")));
            } 
            const token = this.generateJwt({
                    id: registration.id, 
                    email: registration.email,
                    role: registration.role
                }
            );
            return res
                    .status(HTTP_CODES.OK_200)
                    .json(this.setAuthModel(token, "", null));
        } catch (error) {
            return res
                    .status(HTTP_CODES.INTERNAL_SERVER_ERROR_500)
                    .json(this.setAuthModel("", "Internal server error", new Error("Server error")));
        }
    }   

    private setAuthModel( token: string, message: string, error: any ) {
        return { token, message, error }
    }

    private generateJwt = (dataForToken: DataForToken) => {
        return jwt.sign(dataForToken, config.get("jwtSecret"), { expiresIn: '24h' });
    }
}

export default new AuthController();