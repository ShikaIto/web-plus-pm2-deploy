"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ValidationError extends Error {
    statusCode;
    constructor(message) {
        super(message);
        this.statusCode = 400;
    }
}
exports.default = ValidationError;
