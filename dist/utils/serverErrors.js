"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotFoundError = exports.InternalServerError = void 0;
class ServerError {
    constructor(error) {
        this.error = null;
        this.error = error;
    }
    getError() {
        return this;
    }
    ;
}
class InternalServerError extends ServerError {
    constructor() {
        super(...arguments);
        this.message = "Internal server error";
    }
}
exports.InternalServerError = InternalServerError;
class NotFoundError extends ServerError {
    constructor() {
        super(...arguments);
        this.message = "User not found";
    }
}
exports.NotFoundError = NotFoundError;
//# sourceMappingURL=serverErrors.js.map