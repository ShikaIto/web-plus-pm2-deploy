"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dislikeCard = exports.likeCard = exports.deleteCard = exports.createCard = exports.getCards = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const card_1 = __importDefault(require("../models/card"));
const not_found_err_1 = __importDefault(require("../errors/not-found-err"));
const validation_err_1 = __importDefault(require("../errors/validation-err"));
const getCards = async (req, res, next) => {
    try {
        const cards = await card_1.default.find();
        return res.status(200).send(cards);
    }
    catch (error) {
        return next(error);
    }
};
exports.getCards = getCards;
const createCard = async (req, res, next) => {
    try {
        const { name, link } = req.body;
        const newCard = await card_1.default.create({ name, link, owner: req.user });
        return res.status(201).send(newCard);
    }
    catch (error) {
        if (error instanceof mongoose_1.default.Error.ValidationError) {
            throw new validation_err_1.default('Ошибка валидации');
        }
        return next(error);
    }
};
exports.createCard = createCard;
const deleteCard = async (req, res, next) => {
    try {
        const { cardId } = req.params;
        const userId = req.user;
        const card = await card_1.default.findById(cardId);
        if (!card) {
            throw new not_found_err_1.default('Карточка не найдена');
        }
        if (card.owner.toString() !== userId) {
            throw new validation_err_1.default('Нелья удалять чужие карточки');
        }
        await card.remove();
        return res.status(200).send({ message: 'Пост удален' });
    }
    catch (error) {
        if (error instanceof mongoose_1.default.Error.CastError) {
            throw new validation_err_1.default('Ошибка валидации');
        }
        return next(error);
    }
};
exports.deleteCard = deleteCard;
const likeCard = async (req, res, next) => {
    try {
        const { cardId } = req.params;
        const userId = req.user;
        const card = await card_1.default.findByIdAndUpdate(cardId, { $addToSet: { likes: userId } }, { new: true });
        if (!card) {
            throw new not_found_err_1.default('Карточка не найдена');
        }
        return res.status(200).send(card);
    }
    catch (error) {
        if (error instanceof mongoose_1.default.Error.ValidationError) {
            throw new validation_err_1.default('Ошибка валидации');
        }
        if (error instanceof mongoose_1.default.Error.CastError) {
            throw new validation_err_1.default('Ошибка валидации');
        }
        return next(error);
    }
};
exports.likeCard = likeCard;
const dislikeCard = async (req, res, next) => {
    try {
        const { cardId } = req.params;
        const userId = req.user;
        const card = await card_1.default.findByIdAndUpdate(cardId, { $pull: { likes: userId } }, { new: true });
        if (!card) {
            throw new not_found_err_1.default('Карточка не найдена');
        }
        return res.status(200).send(card);
    }
    catch (error) {
        if (error instanceof mongoose_1.default.Error.ValidationError) {
            throw new validation_err_1.default('Ошибка валидации');
        }
        if (error instanceof mongoose_1.default.Error.CastError) {
            throw new validation_err_1.default('Ошибка валидации');
        }
        return next(error);
    }
};
exports.dislikeCard = dislikeCard;
