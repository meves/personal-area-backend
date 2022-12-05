interface IServerError {
    getError: () => IServerError
}

abstract class ServerError implements IServerError{
    protected error: any = null;

    constructor(error: any) {
        this.error = error
    }

    getError() {
        return this
    };
}

export class InternalServerError extends ServerError {
    private message: string = "Internal server error";    
}

export class NotFoundError extends ServerError {
    private message: string = "User not found"
}