"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.log = void 0;
const log = (model) => {
    if (process.env.NODE_ENV === 'development') {
        console.log(model.toJSON());
    }
};
exports.log = log;
//# sourceMappingURL=log.js.map