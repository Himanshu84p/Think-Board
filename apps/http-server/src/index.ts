import express from "express";
import jwt from "jsonwebtoken";
import { isAuthenticated } from "./middlewares/auth.middleware";
import { JWT_SECRET } from "@repo/backend/config";
import {
  CreateRoomSchema,
  UserLoginSchema,
  UserRegisterSchema,
} from "@repo/common/types";
import { prisma } from "@repo/db/prisma";
import bcrypt from "bcrypt";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(cors());


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
      const token = jwt.sign({ userId: isUserExist.id }, JWT_SECRET);

      return res.status(200).json({ token, message: "Login success" });
    } else {
      return res.status(400).json({ message: "Invalid credentials" });
    }
  } else {
    return res.status(400).json({ status: 400, message: "Invalid inputs" });
  }
});

app.post("/create-room", isAuthenticated, async (req, res) => {
  try {
    const data = CreateRoomSchema.safeParse(req.body);

    if (data.error) {
      return res.status(400).json({ message: "Invalid inputs" });
    }

    if (data.data) {
      const isSlugExist = await prisma.room.findFirst({
        where: {
          slug: data.data.slug,
        },
      });

      if (isSlugExist) {
        return res.status(400).json({ message: "room slug already exist" });
      }

      const createdRoom = await prisma.room.create({
        data: {
          slug: data.data.slug,
          adminId: data.data.adminId,
        },
      });

      return res
        .status(200)
        .json({ createdRoom, message: "room created successfully" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/chats/:roomId", isAuthenticated, async (req, res) => {
  try {
    const roomId = Number(req.params.roomId);

    const chats = await prisma.chat.findMany({
      where: {
        roomId,
      },
      take: 45,
      orderBy: {
        createdAt: "asc",
      },
    });

    return res
      .status(200)
      .json({ chats, message: "chats fetched successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/roomId/:slug", async (req, res) => {
  try {
    const slug = req.params.slug;

    if (!slug) {
      return res
        .status(400)
        .json({ message: "Slug is required" });
    }

    const room = await prisma.room.findFirst({
      where: {
        slug
      }
    })

    return res
      .status(200)
      .json({ roomId: room?.id, message: "room id fetched successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
});

app.listen(3001, () => {
  console.log("http-server is listening on the port 3001");
});
