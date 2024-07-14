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
Object.defineProperty(exports, "__esModule", { value: true });
exports.RateLimiter = exports.Middleware = void 0;
const __1 = require("..");
const Middleware = (key) => (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield __1.redis.get(key);
        if (data) {
            return res.json(JSON.parse(data));
        }
        next();
    }
    catch (error) {
        next(error);
    }
});
exports.Middleware = Middleware;
const RateLimiter = ({ limit, time, key }) => (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const count = yield __1.redis.incr(key);
        if (count === 1) {
            yield __1.redis.expire(key, time);
        }
        if (count > limit) {
            const ttl = yield __1.redis.ttl(key);
            return res
                .status(429)
                .send(`Too many requests. Try after ${ttl} seconds!`);
        }
        next();
    }
    catch (error) {
        next(error);
    }
});
exports.RateLimiter = RateLimiter;
