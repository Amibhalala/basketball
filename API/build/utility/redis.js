"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Redis = require('ioredis');
const options = {
    host: String(process.env.REDIS_HOST),
    port: Number.parseInt(String(process.env.REDIS_PORT))
};
const redis = new Redis(options);
redis.on("error", (error) => {
    console.error('Error in connecting to redis host', error);
});
exports.default = redis;
