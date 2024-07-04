import { Request, Response, Router } from "express";
import { getUser } from "../handlers/auth.handler";

export const router = Router();

router.post("/auth/login", getUser);

// /api default
router.get("/", (req: Request, res: Response) => {
  res.send("Hey there!");
});
