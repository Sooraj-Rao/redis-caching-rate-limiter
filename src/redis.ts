import Redis from "ioredis";
import dotenv from "dotenv";
dotenv.config();

const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: 11752,
  password: process.env.REDIS_PASS,
});

redis.on("connect", () => {
  console.log("Redis connected");
});

export default redis;
