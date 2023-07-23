"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AuthorizationError extends Error {
    statusCode;
    constructor(message) {
        super(message);
        this.statusCode = 401;
    }
}
exports.default = AuthorizationError;
