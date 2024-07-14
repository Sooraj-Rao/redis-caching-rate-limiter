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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.redis = void 0;
// index.ts
const express_1 = __importDefault(require("express"));
const ioredis_1 = __importDefault(require("ioredis"));
const middleware_1 = require("./src/middleware");
const dummy_1 = require("./src/dummy");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
exports.redis = new ioredis_1.default({
    host: process.env.REDIS_HOST,
    port: 11752,
    password: process.env.REDIS_PASS,
});
exports.redis.on("connect", () => {
    console.log("Redis connected");
});
app.get("/", (0, middleware_1.RateLimiter)({ limit: 5, time: 60, key: "home" }), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.send(`Hello World!`);
}));
app.get("/prod", (0, middleware_1.RateLimiter)({ limit: 5, time: 20, key: "prod" }), (0, middleware_1.Middleware)("products"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const prod = yield (0, dummy_1.getProduct)();
    yield exports.redis.setex("products", 20, JSON.stringify(prod));
    res.json({ prod });
}));
app.get("/ord", (0, middleware_1.Middleware)("order"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const prod = yield (0, dummy_1.getProduct)();
    yield exports.redis.set("order", JSON.stringify(prod));
    res.json({ order: prod });
}));
app.get("/pro/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const cachedProd = yield exports.redis.get(`prod:${id}`);
    if (cachedProd) {
        return res.json({ prod: JSON.parse(cachedProd) });
    }
    const prod = yield (0, dummy_1.getProductOne)(id);
    yield exports.redis.setex(`prod:${id}`, 1000, JSON.stringify(prod));
    res.json({ prod });
}));
app.get("/order/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    yield exports.redis.del(`prod:${id}`);
    res.json(`Order success for ${id}`);
}));
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
