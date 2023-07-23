"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const celebrate_1 = require("celebrate");
const validator_1 = __importDefault(require("validator"));
const user_1 = require("../controllers/user");
const userRoutes = (0, express_1.Router)();
userRoutes.get('/', user_1.getUsers);
userRoutes.get('/me', user_1.getUser);
userRoutes.patch('/me', (0, celebrate_1.celebrate)({
    body: celebrate_1.Joi.object().keys({
        name: celebrate_1.Joi.string().min(2).max(30),
        about: celebrate_1.Joi.string().min(2).max(200),
    }),
}), user_1.updateUser);
userRoutes.patch('/me/avatar', (0, celebrate_1.celebrate)({
    body: celebrate_1.Joi.object().keys({
        avatar: celebrate_1.Joi.string()
            .required()
            .custom((value, helpers) => {
            if (validator_1.default.isURL(value)) {
                return value;
            }
            return helpers.message('Невалидная ссылка');
        }),
    }),
}), user_1.updateAvatar);
exports.default = userRoutes;
