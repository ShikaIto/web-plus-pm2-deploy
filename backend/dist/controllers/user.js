"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.updateAvatar = exports.updateUser = exports.getUser = exports.createUser = exports.getUsers = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const not_found_err_1 = __importDefault(require("../errors/not-found-err"));
const validation_err_1 = __importDefault(require("../errors/validation-err"));
const user_1 = __importDefault(require("../models/user"));
const getUsers = async (req, res, next) => {
    try {
        const users = await user_1.default.find();
        return res.status(200).send(users);
    }
    catch (error) {
        return next(error);
    }
};
exports.getUsers = getUsers;
const createUser = async (req, res, next) => {
    try {
        const { password } = req.body;
        const hash = await bcrypt_1.default.hash(password, 10);
        const newUser = await user_1.default.create({ ...req.body, password: hash });
        return res.status(201).send(newUser);
    }
    catch (error) {
        if (error instanceof mongoose_1.default.Error.ValidationError) {
            throw new validation_err_1.default('Ошибка валидации');
        }
        if (error.code === 11000) {
            throw new validation_err_1.default('Такой email уже существует');
        }
        return next(error);
    }
};
exports.createUser = createUser;
const getUser = async (req, res, next) => {
    try {
        const id = req.user;
        const user = await user_1.default.findById(id);
        if (!user) {
            throw new not_found_err_1.default('Пользователь не найден');
        }
        return res.status(200).send(user);
    }
    catch (error) {
        if (error instanceof mongoose_1.default.Error.CastError) {
            throw new validation_err_1.default('Ошибка валидации');
        }
        return next(error);
    }
};
exports.getUser = getUser;
const updateUser = async (req, res, next) => {
    try {
        const id = req.user;
        const { about, name } = req.body;
        const user = await user_1.default.findByIdAndUpdate(id, { about, name }, {
            new: true,
            runValidators: true,
        });
        if (!user) {
            throw new not_found_err_1.default('Пользователь не найден');
        }
        return res.status(200).send(user);
    }
    catch (error) {
        if (error instanceof mongoose_1.default.Error.ValidationError) {
            throw new validation_err_1.default('Ошибка валидации');
        }
        return next(error);
    }
};
exports.updateUser = updateUser;
const updateAvatar = async (req, res, next) => {
    try {
        const id = req.user;
        const { avatar } = req.body;
        const user = await user_1.default.findByIdAndUpdate(id, { avatar }, { new: true, runValidators: true });
        if (!user) {
            throw new not_found_err_1.default('Пользователь не найден');
        }
        return res.status(200).send(user);
    }
    catch (error) {
        if (error instanceof mongoose_1.default.Error.ValidationError) {
            throw new validation_err_1.default('Ошибка валидации');
        }
        return next(error);
    }
};
exports.updateAvatar = updateAvatar;
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await user_1.default.findUserByCredentials(email, password);
        const token = jsonwebtoken_1.default.sign({ userId: user._id }, 'some-secret-key', {
            expiresIn: '7d',
        });
        return res
            .cookie('jwt', token, { maxAge: 3600000 * 24 * 7, httpOnly: true })
            .status(200)
            .send({ message: 'Авторизация успешна', token });
    }
    catch (error) {
        return next(error);
    }
};
exports.login = login;
