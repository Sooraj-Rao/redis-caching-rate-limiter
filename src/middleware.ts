import { NextFunction, Request, Response } from "express";
import { redis } from "..";

export type T_Rate = {
  limit: number;
  time: number;
  key: string;
};

export const Middleware =
  (key: string) => async (req: Request, res: Response, next: NextFunction) => {
    const data = await redis.get(key);
    if (data) return res.json(JSON.parse(data));
    next();
  };

export const RateLimiter =
  ({ limit, time, key }: T_Rate) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const count = await redis.incr(key);
    if (count == 1) await redis.expire(key, time);
    const ttl = await redis.ttl(key);
    if (count > limit) {
      return res
        .status(429)
        .send(`Too many request..Try after ${ttl} seconds !`);
    }
    next();
  };
