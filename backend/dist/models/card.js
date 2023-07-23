"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const validator_1 = __importDefault(require("validator"));
const cardSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
        minLength: 2,
        maxLength: 30,
    },
    link: {
        type: String,
        required: true,
        validate: {
            validator: (v) => validator_1.default.isURL(v),
            message: 'Невалидная ссылка',
        },
    },
    owner: {
        type: mongoose_1.default.Types.ObjectId,
        ref: 'user',
        required: true,
    },
    likes: [{
            type: mongoose_1.default.Types.ObjectId,
            ref: 'user',
            default: [],
        }],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});
exports.default = mongoose_1.default.model('card', cardSchema);
