import jwt, { JwtPayload } from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import { JWT_SECRET } from "@repo/backend/config";

export function isAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const token = req.headers["authorization"] || req.cookies.token;
    if (!token) {
      res
        .status(400)
        .json({ status: 400, message: "Invalid token", success: false });
    }
    // console.log("cookiess jwt ", req.cookies);
    const decoded = jwt.verify(token, JWT_SECRET);

    if (decoded && (decoded as JwtPayload).userId) {
      next();
    } else {
      res.status(403).json({ message: "Unauthorized!!" });
    }
  } catch (error) {
    console.log("error in middleware", error);
  }
}
