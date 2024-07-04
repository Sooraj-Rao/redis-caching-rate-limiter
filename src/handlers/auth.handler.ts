import { Request, Response } from "express";

export function getUser(req: Request, res: Response) {
  try {
    const { email, password } = req.body;
    if (email && password) res.status(200).json({ email, password });
    else res.status(400).json({ error: true, message: "All fileds Mandatory" });
  } catch (error) {
    res.status(400).json({ error: true, message: "Internal Server Error" });
  }
}
