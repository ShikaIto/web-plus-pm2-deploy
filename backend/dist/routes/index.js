"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_1 = __importDefault(require("./user"));
const card_1 = __importDefault(require("./card"));
const routes = (0, express_1.Router)();
routes.use('/users', user_1.default);
routes.use('/cards', card_1.default);
routes.use('*', (req, res) => {
    res.status(404).send({ message: 'Страница не найдена' });
});
exports.default = routes;
