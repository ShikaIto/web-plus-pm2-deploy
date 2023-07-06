"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_1 = require("controllers/user");
const userRoutes = (0, express_1.Router)();
userRoutes.get('/', user_1.getUsers);
userRoutes.post('/', user_1.createUser);
userRoutes.get('/:userId', user_1.getUser);
exports.default = userRoutes;
