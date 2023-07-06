"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
exports.userSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
        minLength: 2,
        maxLength: 30,
    },
    about: {
        type: String,
        required: true,
        minLength: 2,
        maxLength: 200,
    },
    avatar: {
        type: String,
        required: true,
    }
});
exports.default = mongoose_1.default.model('user', exports.userSchema);