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
exports.cacheRequest = exports.requestRateLimiter = void 0;
const redis_1 = __importDefault(require("./utility/redis"));
const MAX_LIMIT = 10;
const TIMEOUT = 60;
const requestRateLimiter = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const ip = (_a = req === null || req === void 0 ? void 0 : req.socket) === null || _a === void 0 ? void 0 : _a.remoteAddress;
        const requests = yield redis_1.default.incr(ip);
        if (requests > MAX_LIMIT) {
            return res.status(429).send('Too many requests - try again later');
        }
        yield redis_1.default.expire(ip, TIMEOUT);
        return next();
    }
    catch (error) {
        throw error;
    }
});
exports.requestRateLimiter = requestRateLimiter;
const cacheRequest = (req, res, next) => {
    const { id } = req.params;
    console.log('888', req.params);
    redis_1.default.get(id, (error, result) => {
        if (error)
            throw error;
        if (result !== null) {
            console.log('here89', result);
            return res.json(JSON.parse(result));
        }
        else {
            return next();
        }
    });
};
exports.cacheRequest = cacheRequest;
