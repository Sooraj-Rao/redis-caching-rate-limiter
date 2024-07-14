import express from "express";
import Redis from "ioredis";
import { Middleware, RateLimiter } from "./src/middleware";
import { getProduct, getProductOne } from "./src/dummy";
import dotenv from "dotenv";
dotenv.config();

const app = express();
export const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASS,
});

redis.on("connect", () => {
  console.log("Redis connected");
});

app.get(
  "/",
  RateLimiter({ limit: 5, time: 60, key: "home" }),
  async (req, res) => {
    res.send(`Hello World!`);
  }
);

app.get(
  "/prod",
  RateLimiter({ limit: 5, time: 60, key: "prod" }),
  Middleware("products"),
  async (req, res) => {
    const prod = await getProduct();
    await redis.set("products", JSON.stringify(prod));
    res.json({ prod: prod });
  }
);

app.get("/ord", Middleware("order"), async (req, res) => {
  const prod = await getProduct();
  await redis.set("order", JSON.stringify(prod));
  res.json({ order: prod });
});

app.get("/pro/:id", async (req, res) => {
  let id: string = req.params.id;
  const isExit = await redis.get(`prod:${id}`);
  if (isExit) {
    return res.json({ prod: JSON.parse(isExit) });
  }
  let prod = await getProductOne(id);
  await redis.setex(`prod:${id}`, 1000, JSON.stringify(prod));
  res.json({ prod });
});

app.get("/order/:id", async (req, res) => {
  let id = req.params.id;
  await redis.del(`prod:${id}`);
  res.json(`Order success for ${id}`);
});

app.listen(3000, () => {
  console.log("Server started");
});
