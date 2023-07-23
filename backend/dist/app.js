"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = __importStar(require("dotenv"));
const express_1 = __importStar(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const celebrate_1 = require("celebrate");
const validator_1 = __importDefault(require("validator"));
const cors_1 = __importDefault(require("cors"));
const index_1 = __importDefault(require("./routes/index"));
const user_1 = require("./controllers/user");
const error_1 = __importDefault(require("./middlewares/error"));
const auth_1 = __importDefault(require("./middlewares/auth"));
const logger_1 = require("./middlewares/logger");
dotenv.config();
const { PORT = 3000 } = process.env;
const { MONGOURL = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use((0, cookie_parser_1.default)());
app.use((0, express_1.json)());
mongoose_1.default.connect(MONGOURL);
app.use(logger_1.requestLogger);
app.get('/crash-test', () => {
    setTimeout(() => {
        throw new Error('Сервер сейчас упадёт');
    }, 0);
});
app.post('/signin', (0, celebrate_1.celebrate)({
    body: celebrate_1.Joi.object().keys({
        name: celebrate_1.Joi.string().min(2).max(30),
        about: celebrate_1.Joi.string().min(2).max(200),
        avatar: celebrate_1.Joi.string().custom((value, helpers) => {
            if (validator_1.default.isURL(value)) {
                return value;
            }
            return helpers.message('Невалидная ссылка');
        }),
        email: celebrate_1.Joi.string().required().email(),
        password: celebrate_1.Joi.string().required(),
    }),
}), user_1.login);
app.post('/signup', (0, celebrate_1.celebrate)({
    body: celebrate_1.Joi.object().keys({
        email: celebrate_1.Joi.string().required().email(),
        password: celebrate_1.Joi.string().required(),
    }),
}), user_1.createUser);
app.use(auth_1.default);
app.use('/', index_1.default);
app.use(logger_1.errorLogger);
app.use((0, celebrate_1.errors)());
app.use(error_1.default);
app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
});
