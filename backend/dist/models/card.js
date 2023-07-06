"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const user_1 = require("./user");
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
    },
    owner: {
        userSchema: user_1.userSchema,
        type: mongoose_1.default.Types.ObjectId,
        required: true,
    },
    likes: [{
            userSchema: user_1.userSchema,
            type: mongoose_1.default.Types.ObjectId,
            default: [],
        }],
    createdAt: {
        type: Date,
        default: Date.now(),
    }
});
exports.default = mongoose_1.default.model('card', cardSchema);
