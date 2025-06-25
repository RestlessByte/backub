"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var dotenv_1 = require("dotenv");
var telegraf_1 = require("telegraf");
// Используем самописный API HEYGEN, реализованный через fetch
var connection_1 = require("/opt/security/backend/typescript/db/connection");
(0, dotenv_1.config)();
// Самописный API HEYGEN, использующий fetch для взаимодействия с API
var HEYGEN = /** @class */ (function () {
    function HEYGEN(token) {
        var _this = this;
        // Метод для работы с аватарами
        this.avatars = {
            list: function () { return __awaiter(_this, void 0, void 0, function () {
                var response, data;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, fetch("".concat(this.baseUrl, "/avatars"), {
                                method: "GET",
                                headers: {
                                    "Authorization": "Bearer ".concat(this.token),
                                    "Content-Type": "application/json"
                                }
                            })];
                        case 1:
                            response = _a.sent();
                            if (!response.ok) {
                                throw new Error("\u041E\u0448\u0438\u0431\u043A\u0430 \u043F\u0440\u0438 \u043F\u043E\u043B\u0443\u0447\u0435\u043D\u0438\u0438 \u0430\u0432\u0430\u0442\u0430\u0440\u043E\u0432: ".concat(response.statusText));
                            }
                            return [4 /*yield*/, response.json()];
                        case 2:
                            data = _a.sent();
                            return [2 /*return*/, data];
                    }
                });
            }); }
        };
        this.token = token;
        // Базовый URL для запросов к API HEYGEN – при необходимости заменить на актуальный
        this.baseUrl = "https://api.heygen.com";
    }
    return HEYGEN;
}());
var TELEGRAM_TOKEN = process.env.BOT_TOKEN;
if (!TELEGRAM_TOKEN) {
    throw new Error('"BOT_TOKEN" env var is required!');
}
// Функция для получения пользователя из БД
var getUser = function (userId) { return __awaiter(void 0, void 0, void 0, function () {
    var res;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, connection_1.default)('hey_gen', "SELECT * FROM users WHERE user_id = $1", [userId])];
            case 1:
                res = _a.sent();
                return [2 /*return*/, res.rows[0]];
        }
    });
}); };
// Функция для обновления данных пользователя в БД
var updateUser = function (userId, fields) { return __awaiter(void 0, void 0, void 0, function () {
    var entries, setClause;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                entries = Object.entries(fields);
                setClause = entries
                    .map(function (_a, index) {
                    var key = _a[0], _ = _a[1];
                    return "".concat(key, " = $").concat(index + 2);
                })
                    .join(', ');
                return [4 /*yield*/, (0, connection_1.default)('hey_gen', "UPDATE users SET ".concat(setClause, " WHERE user_id = $1"), __spreadArray([
                        userId
                    ], entries.map(function (_a) {
                        var value = _a[1];
                        return value;
                    }), true))];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
// Обновленная функция buildMainMenu для использования токена из БД
var buildMainMenu = function (user) {
    if (!user.token) {
        // Если API токен не настроен, предлагаем его настроить
        return telegraf_1.Markup.inlineKeyboard([
            [telegraf_1.Markup.button.callback('🔑 Настроить токен', 'set_token')],
        ]);
    }
    else {
        // Если токен настроен, показываем полноценное меню с несколькими опциями
        return telegraf_1.Markup.inlineKeyboard([
            [
                telegraf_1.Markup.button.callback('⚙️ Настройки', 'settings'),
                telegraf_1.Markup.button.callback('🎬 Сгенерировать Reels', 'create_reels')
            ],
            [
                telegraf_1.Markup.button.callback('🧑‍🦰 Создать аватар', 'choose_avatar'),
                telegraf_1.Markup.button.callback('🎖️ Управление PREMIUM', 'manage_premium')
            ]
        ]);
    }
};
// Инициализация бота с использованием токена из .env
var bot = new telegraf_1.Telegraf(TELEGRAM_TOKEN);
// Обработка команды /start
bot.start(function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, user, welcomeMsg;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                userId = (_a = ctx.from) === null || _a === void 0 ? void 0 : _a.id;
                if (!userId)
                    return [2 /*return*/];
                return [4 /*yield*/, getUser(userId)];
            case 1:
                user = _b.sent();
                if (!!user) return [3 /*break*/, 4];
                // Новый пользователь: добавляем его в БД
                return [4 /*yield*/, (0, connection_1.default)('hey_gen', "INSERT INTO users (user_id) VALUES ($1)", [userId])];
            case 2:
                // Новый пользователь: добавляем его в БД
                _b.sent();
                return [4 /*yield*/, getUser(userId)];
            case 3:
                user = _b.sent();
                _b.label = 4;
            case 4:
                welcomeMsg = user.token
                    ? "\u0421 \u0432\u043E\u0437\u0432\u0440\u0430\u0449\u0435\u043D\u0438\u0435\u043C, ".concat(ctx.from.first_name, "!\n\u0412\u044B\u0431\u0435\u0440\u0438\u0442\u0435 \u043D\u0443\u0436\u043D\u043E\u0435 \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u0435:")
                    : "\u0414\u043E\u0431\u0440\u043E \u043F\u043E\u0436\u0430\u043B\u043E\u0432\u0430\u0442\u044C, ".concat(ctx.from.first_name, "!\n\u041F\u043E\u0436\u0430\u043B\u0443\u0439\u0441\u0442\u0430, \u0437\u0430\u0440\u0435\u0433\u0438\u0441\u0442\u0440\u0438\u0440\u0443\u0439\u0442\u0435\u0441\u044C \u043D\u0430 \u0441\u0430\u0439\u0442\u0435 https://app.heygen.com/ \u0438 \u043D\u0430\u0441\u0442\u0440\u043E\u0439\u0442\u0435 \u0432\u0430\u0448 API \u0442\u043E\u043A\u0435\u043D.");
                return [4 /*yield*/, ctx.reply(welcomeMsg, buildMainMenu(user))];
            case 5:
                _b.sent();
                return [2 /*return*/];
        }
    });
}); });
// Обработка нажатия кнопки "Настроить токен"
bot.action('set_token', function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
    var userId;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                userId = (_a = ctx.from) === null || _a === void 0 ? void 0 : _a.id;
                if (!userId)
                    return [2 /*return*/];
                return [4 /*yield*/, updateUser(userId, { trigger_set_token: true })];
            case 1:
                _b.sent();
                return [4 /*yield*/, ctx.reply('Пожалуйста, отправьте ваш API токен.')];
            case 2:
                _b.sent();
                return [2 /*return*/];
        }
    });
}); });
// Обработка текстовых сообщений от пользователя
bot.on('text', function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, user;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                userId = (_a = ctx.from) === null || _a === void 0 ? void 0 : _a.id;
                if (!userId)
                    return [2 /*return*/];
                return [4 /*yield*/, getUser(userId)];
            case 1:
                user = _b.sent();
                if (!user.trigger_set_token) return [3 /*break*/, 5];
                // Сохраняем API токен в БД
                return [4 /*yield*/, updateUser(userId, { token: ctx.message.text, trigger_set_token: false })];
            case 2:
                // Сохраняем API токен в БД
                _b.sent();
                return [4 /*yield*/, getUser(userId)];
            case 3:
                user = _b.sent();
                return [4 /*yield*/, ctx.reply('Токен сохранен! Выберите дальнейшее действие:', buildMainMenu(user))];
            case 4:
                _b.sent();
                return [3 /*break*/, 8];
            case 5:
                if (!user.trigger_set_reels_text) return [3 /*break*/, 8];
                // Сохраняем текст для Reels
                return [4 /*yield*/, updateUser(userId, { reels_text: ctx.message.text, trigger_set_reels_text: false })];
            case 6:
                // Сохраняем текст для Reels
                _b.sent();
                return [4 /*yield*/, ctx.reply('Текст для Reels сохранен! Теперь выберите аватар для продолжения.', telegraf_1.Markup.inlineKeyboard([
                        [telegraf_1.Markup.button.callback('🧑‍🦰 Выбрать аватар', 'choose_avatar')]
                    ]))];
            case 7:
                _b.sent();
                _b.label = 8;
            case 8: return [2 /*return*/];
        }
    });
}); });
// Обработка нажатия кнопки "Сгенерировать Reels"
bot.action('create_reels', function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
    var userId;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                userId = (_a = ctx.from) === null || _a === void 0 ? void 0 : _a.id;
                if (!userId)
                    return [2 /*return*/];
                return [4 /*yield*/, updateUser(userId, { trigger_set_reels_text: true })];
            case 1:
                _b.sent();
                return [4 /*yield*/, ctx.reply('Введите текст для вашего Reels:')];
            case 2:
                _b.sent();
                return [2 /*return*/];
        }
    });
}); });
// Обработка нажатия кнопки "Создать аватар"
bot.action('choose_avatar', function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, user, heygenInstance, avatars, avatarArray, avatarButtons;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                userId = (_a = ctx.from) === null || _a === void 0 ? void 0 : _a.id;
                if (!userId)
                    return [2 /*return*/];
                return [4 /*yield*/, getUser(userId)];
            case 1:
                user = _b.sent();
                if (!!user.token) return [3 /*break*/, 3];
                return [4 /*yield*/, ctx.reply('Пожалуйста, сначала настройте ваш API токен.', telegraf_1.Markup.inlineKeyboard([
                        [telegraf_1.Markup.button.callback('🔑 Настроить токен', 'set_token')]
                    ]))];
            case 2:
                _b.sent();
                return [2 /*return*/];
            case 3:
                heygenInstance = new HEYGEN(user.token);
                return [4 /*yield*/, heygenInstance.avatars.list()];
            case 4:
                avatars = _b.sent();
                avatarArray = Array.isArray(avatars) ? avatars : [avatars];
                avatarButtons = avatarArray.map(function (avatar) {
                    return telegraf_1.Markup.button.callback(avatar.avatar_name, "select_avatar_".concat(avatar.avatar_id));
                });
                return [4 /*yield*/, ctx.reply('Выберите аватар:', telegraf_1.Markup.inlineKeyboard(avatarButtons, { columns: 2 }))];
            case 5:
                _b.sent();
                return [2 /*return*/];
        }
    });
}); });
