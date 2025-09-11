import { WebSocketServer, WebSocket } from "ws";
import { JWT_SECRET } from "@repo/backend/config";
import jwt, { JwtPayload } from "jsonwebtoken";
import { prisma } from "@repo/db/prisma";

const wss = new WebSocketServer({ port: 8080 });

interface User {
  ws: WebSocket;
  userId: string;
  rooms: number[];
}

const users: User[] = [];

function CheckUser(token: string): string | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    if (typeof decoded === "string") {
      return null;
    }

    if (!decoded || !decoded.userId) {
      return null;
    }

    return decoded.userId;
  } catch (error) {
    console.log(error);
    return null;
  }
}
wss.on("connection", function (socket, request) {
  const tokenStr = request.url?.split("?")[1];

  const token = new URLSearchParams(tokenStr).get("token") || "";

  if (!token) {
    socket.close();
    return;
  }

  const userId = CheckUser(token);

  if (!userId) {
    socket.close();
    return;
  }

  users.push({
    ws: socket,
    userId,
    rooms: [],
  });

  // console.log("user connected:", users);
  console.log("socket connected to the server");

  socket.on("message", async function (data) {
    // if (typeof data === "string") {
    //   socket.send("Invalid input");
    //   return;
    // }
    const parsedData = JSON.parse(data.toString());
    // console.log("parsed data ", parsedData)

    if (parsedData && parsedData.type === "join_room") {
      //check whether room exist
      //check whether already joined room or not
      // console.log("joined room");
      const user = users.find((x) => x.ws === socket);

      user?.rooms.push(parsedData.roomId);
    }

    if (parsedData && parsedData.type === "leave_room") {
      // console.log("leave room");
      const user = users.find((x) => x.ws === socket);
      user?.rooms.filter((x) => x != parsedData.roomId);
    }

    if (parsedData && parsedData.type === "chat") {
      const message: string = parsedData.message;
      const roomId: number = parsedData.roomId;
      // console.log("chat message", message);
      if (message) {
        try {
          //find broadcast room to send message, then send it to the users which are connected to that room
          const joinedUsers = users.filter((x) => x.rooms.includes(roomId) && x.ws != socket);

          //db call to store the chat
          //TODO: optimal approach would be to put message in queue so db call delay will not impact message delivery time

          const sentChat = await prisma.chat.create({
            data: {
              message,
              roomId,
              userId,
            },
          });

          // console.log("db saved chat", sentChat);
          joinedUsers.forEach((user) => {
            user.ws.send(
              JSON.stringify({
                type: "chat",
                message,
                roomId,
              })
            );
          });
        } catch (error) {
          // socket.send("Invalid message");
          return;
        }
      }
    } else if (parsedData && parsedData.type === "erase") {
      // console.log("shape erased", parsedData);
      const message = parsedData.message;
      const roomId = parsedData.roomId;

      if (message) {
        try {
          // const erasedShape = await prisma.chat.findFirst({
          //   where: {
          //     message: message,
          //   },
          // });
          // // console.log("shape found", erasedShape);
          // if (erasedShape) {
          const deletedShape = await prisma.chat.deleteMany({
            where: {
              message: message,
              roomId: roomId,
            },
          });
          // console.log("deleted shape", deletedShape);

          users.forEach(async (u) => {
            if (u.rooms.includes(roomId)) {
              const parsedMsg = JSON.stringify({
                type: "erase",
                message: message,
                roomId: roomId,
              });
              u.ws.send(parsedMsg);
            }
          });
          // }
        } catch (error) {
          console.log("error while erasing", error);
        }
      }
    }
  });
  socket.on("close", function (data) {
    const idx = users.findIndex((x) => x.ws === socket);
    if (idx != -1) {
      users.splice(idx, 1);
    }
    // console.log("user disconnected");
  });
});
