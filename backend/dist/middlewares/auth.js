"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authorization_err_1 = __importDefault(require("../errors/authorization-err"));
const auth = (req, res, next) => {
    let token = req.cookies.jwt;
    const { authorization } = req.headers;
    if (!token && (!authorization || !authorization.startsWith('Bearer '))) {
        throw new authorization_err_1.default('Необходима авторизация');
    }
    if (!token && authorization) {
        token = authorization.replace('Bearer ', '');
    }
    let payload;
    try {
        payload = jsonwebtoken_1.default.verify(token, 'some-secret-key');
    }
    catch (error) {
        throw new authorization_err_1.default('Необходима авторизация');
    }
    req.user = payload.userId;
    next();
};
exports.default = auth;
