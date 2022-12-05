import { Request } from "express";


export type RequestWithParams<P> = Request<P>;
export type RequestWithBody<B> = Request<{}, {}, B>;
export type RequestWithParamsAndBody<P, B> = Request<P, {}, B>;
export type RequestWithQuery<Q> = Request<{}, {}, {}, Q>;


export type ClientModel<T> = {
    data: T
    error: {
        message: string
        error: any
    }
}

export type RegistrationBody = {
    email: string
    password: string
    role?: string
}


export type UserParams = {
    id?: number
    username?: string
}
export type UserBody = {
    firstname: string
    lastname: string
}


export type GreetingParams = {
    id: number
}