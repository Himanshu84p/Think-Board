import express, { CookieOptions } from "express";
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
import cors, { CorsOptions } from "cors";
import cookieParser from "cookie-parser";

const app = express();
const corsOptions: CorsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cookieParser());
app.use(express.json());
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("hello there");
});

app.post("/signup", async (req, res) => {
  const { data, error } = UserRegisterSchema.safeParse(req.body);

  if (error && error.issues && error.issues[0]?.message) {
    const errorMessage: string = error.issues[0]?.message;
    console.log(error.issues);
    return res.status(400).json({
      status: 400,
      success: false,
      message: errorMessage,
      error: error,
    });
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
        return res.status(200).json({
          status: 200,
          success: true,
          message: "Signed up successfully",
        });
      }
    } catch (error) {
      console.log("error while creating user", error);
      return res
        .status(500)
        .json({ status: 500, success: false, message: "Server error" });
    }
  }
});

app.post("/signin", async (req, res) => {
  console.log("body", req.body);
  const { data, error } = UserLoginSchema.safeParse(req.body);

  if (error && error.issues && error.issues[0]?.message) {
    const errorMessage: string = error.issues[0]?.message;
    console.log(error);
    return res.status(400).json({
      status: 400,
      success: false,
      message: errorMessage,
      error: error,
    });
  }
  if (data) {
    const { email, password } = data;

    const isUserExist = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (!isUserExist) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: "Email is not registered",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      isUserExist?.password || ""
    );

    if (isPasswordCorrect) {
      const token = jwt.sign({ userId: isUserExist.id }, JWT_SECRET);

      const cookieOptions: CookieOptions = {
        secure: true,
        httpOnly: false,
        sameSite: "none",
      };

      return res
        .status(200)
        .cookie("token", token, cookieOptions)
        .json({
          status: 200,
          success: true,
          token,
          message: "Login success",
          data: {
            userId: isUserExist.id,
            email: isUserExist.email,
          },
        });
    } else {
      return res
        .status(400)
        .json({ status: 400, success: false, message: "Invalid credentials" });
    }
  }
});
app.get("/logout", async (req, res) => {
  const cookieOptions: CookieOptions = {
    secure: true,
    httpOnly: false,
    sameSite: "none",
  };

  return res.status(200).clearCookie("token", cookieOptions).json({
    status: 200,
    success: true,
    message: "Logout success",
  });
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
        return res.status(400).json({ message: "Room name already exist" });
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
      take: 200,
      orderBy: {
        createdAt: "asc",
      },
    });
    // console.log(chats);
    return res
      .status(200)
      .json({ chats, message: "chats fetched successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/roomId/:slug", isAuthenticated, async (req, res) => {
  try {
    const slug = req.params.slug;
    console.log("slug", slug);
    if (!slug) {
      return res.status(400).json({ message: "Slug is required" });
    }

    const room = await prisma.room.findFirst({
      where: {
        slug,
      },
    });

    if (!room) {
      return res.status(404).json({ status: 404, message: "Room not found", success: false });
    }

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
