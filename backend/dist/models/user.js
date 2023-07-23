"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const validator_1 = __importDefault(require("validator"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const validation_err_1 = __importDefault(require("../errors/validation-err"));
exports.userSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        minLength: 2,
        maxLength: 30,
        default: 'Жак-Ив Кусто',
    },
    about: {
        type: String,
        minLength: 2,
        maxLength: 200,
        default: 'Исследователь',
    },
    avatar: {
        type: String,
        validate: {
            validator: (v) => validator_1.default.isURL(v),
            message: 'Невалидная ссылка',
        },
        default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: (v) => validator_1.default.isEmail(v),
            message: 'Невалидный email',
        },
    },
    password: {
        type: String,
        required: true,
        select: false,
    },
});
exports.userSchema.static('findUserByCredentials', async function findUserByCredentials(email, password) {
    const user = await this.findOne({ email }).select('+password');
    if (!user) {
        throw new validation_err_1.default('Неправильные почта или пароль');
    }
    const matched = await bcrypt_1.default.compare(password, user.password);
    if (!matched) {
        throw new validation_err_1.default('Неправильные почта или пароль');
    }
    return user;
});
exports.default = mongoose_1.default.model('user', exports.userSchema);
