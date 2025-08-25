import express from "express";
import jwt from "jsonwebtoken";
import { isAuthenticated } from "./middlewares/auth.middleware";
import { JWT_SECRET } from "@repo/backend/config";
import { UserLoginSchema, UserRegisterSchema } from "@repo/common/types";
import { prisma } from "@repo/db/prisma";
import bcrypt from "bcrypt";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("hello there");
});

app.post("/signup", async (req, res) => {
  const { data, error } = UserRegisterSchema.safeParse(req.body);

  if (error) {
    res.status(400).json({ status: 400, message: "Invalid inputs" });
    return;
  }

  if (data) {
    const { name, email, password } = data;

    const hasedPassword = await bcrypt.hash(password, 12);

    try {
      const createdUser = await prisma.user.create({
        data: {
          name,
          email,
          password: hasedPassword,
        },
        select: {
          email: true,
          name: true,
        },
      });

      if (createdUser) {
        return res
          .status(200)
          .json({ status: 200, message: "Signed Up success" });
      }
    } catch (error) {
      console.log("error while creating user", error);
      return res.status(500).json({ status: 500, message: "Server error" });
    }
  }
});

app.post("/signin", async (req, res) => {
  const { data, error } = UserLoginSchema.safeParse(req.body);

  if (data) {
    const { email, password } = data;

    const isUserExist = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (!isUserExist) {
      return res
        .status(404)
        .json({ status: 404, message: "User not found with this email" });
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      isUserExist?.password || ""
    );

    if (isPasswordCorrect) {
      const token = jwt.sign(data?.email, JWT_SECRET);

      return res.status(200).json({ token, message: "Login success" });
    }
  } else {
    return res.status(400).json({ status: 400, message: "Invalid inputs" });
  }

  return res
    .status(500)
    .json({ status: 500, message: "Internal server error" });
});

app.post("/room", isAuthenticated, (req, res) => {
  console.log("create room");
});

app.listen(3001, () => {
  console.log("http-server is listening on the port 3001");
});
