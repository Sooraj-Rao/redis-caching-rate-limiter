// index.ts
import express from "express";
import Redis from "ioredis";
import { Middleware, RateLimiter } from "./src/middleware";
import { getProduct, getProductOne } from "./src/dummy";
import dotenv from "dotenv";
import redis from "./src/redis";
dotenv.config();

const app = express();


app.get(
  "/",
  RateLimiter({ limit: 5, time: 60, key: "home" }),
  async (req, res) => {
    res.send(`Hello World!`);
  }
);

app.get(
  "/prod",
  RateLimiter({ limit: 5, time: 20, key: "prod" }),
  Middleware("products"),
  async (req, res) => {
    const prod = await getProduct();
    await redis.setex("products", 20, JSON.stringify(prod));
    res.json({ prod });
  }
);

app.get("/ord", Middleware("order"), async (req, res) => {
  const prod = await getProduct();
  await redis.set("order", JSON.stringify(prod));
  res.json({ order: prod });
});

app.get("/pro/:id", async (req, res) => {
  const { id } = req.params;
  const cachedProd = await redis.get(`prod:${id}`);
  if (cachedProd) {
    return res.json({ prod: JSON.parse(cachedProd) });
  }
  const prod = await getProductOne(id);
  await redis.setex(`prod:${id}`, 1000, JSON.stringify(prod));
  res.json({ prod });
});

app.get("/order/:id", async (req, res) => {
  const { id } = req.params;
  await redis.del(`prod:${id}`);
  res.json(`Order success for ${id}`);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

export default redis;
