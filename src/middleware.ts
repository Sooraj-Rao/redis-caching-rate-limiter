// middleware.ts
import { NextFunction, Request, Response } from "express";
import redis from "..";

interface RateLimiterOptions {
  limit: number;
  time: number;
  key: string;
}

export const Middleware =
  (key: string) => async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await redis.get(key);
      if (data) {
        return res.json(JSON.parse(data));
      }
      next();
    } catch (error) {
      next(error);
    }
  };

export const RateLimiter =
  ({ limit, time, key }: RateLimiterOptions) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const count = await redis.incr(key);

      if (count === 1) {
        await redis.expire(key, time);
      }

      if (count > limit) {
        const ttl = await redis.ttl(key);
        return res
          .status(429)
          .send(`Too many requests. Try after ${ttl} seconds!`);
      }

      next();
    } catch (error) {
      next(error);
    }
  };
