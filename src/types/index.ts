import { Request } from "express";

export type RequestWithParams<P> = Request<P>;
export type RequestWithBody<B> = Request<{}, {}, B>;
export type RequestWithParamsAndBody<P, B> = Request<P, {}, B>;
export type RequestWithQuery<Q> = Request<{}, {}, {}, Q>;


// registration
export type RegistrationBody = {
    email: string
    password: string
    role?: string
}

// users
export type UserParams = {
    id?: number
    username?: string
}

export type UserBody = {
    firstname: string
    lastname: string
}

// greeting
export type GreetingParams = {
    id: number
}