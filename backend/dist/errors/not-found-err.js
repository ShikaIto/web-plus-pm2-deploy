"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class NotFoundError extends Error {
    statusCode;
    constructor(message) {
        super(message);
        this.statusCode = 404;
    }
}
exports.default = NotFoundError;
