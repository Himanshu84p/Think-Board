import jwt, { JwtPayload } from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import { JWT_SECRET } from "@repo/backend/config";

export function isAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const token = req.headers["authorization"] || "";

  const decoded = jwt.verify(token, JWT_SECRET);

  if (decoded && (decoded as JwtPayload).userId) {
    next();
  } else {
    res.status(403).json({ message: "Unauthorized!!" });
  }
}
