"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const celebrate_1 = require("celebrate");
const validator_1 = __importDefault(require("validator"));
const card_1 = require("../controllers/card");
const cardRoutes = (0, express_1.Router)();
cardRoutes.get('/', card_1.getCards);
cardRoutes.post('/', (0, celebrate_1.celebrate)({
    body: celebrate_1.Joi.object().keys({
        name: celebrate_1.Joi.string().required().min(2).max(30),
        link: celebrate_1.Joi.string().required().custom((value, helpers) => {
            if (validator_1.default.isURL(value)) {
                return value;
            }
            return helpers.message('Невалидная ссылка');
        }),
    }),
}), card_1.createCard);
cardRoutes.delete('/:cardId', card_1.deleteCard);
cardRoutes.put('/:cardId/likes', card_1.likeCard);
cardRoutes.delete('/:cardId/likes', card_1.dislikeCard);
exports.default = cardRoutes;
