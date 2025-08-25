import { WebSocketServer } from "ws";
import { JWT_SECRET } from "@repo/backend/config";
import jwt, { JwtPayload } from "jsonwebtoken";

const wss = new WebSocketServer({ port: 8080 });

wss.on("connection", function (socket, request) {
  const url = request.url;

  if (!url) {
    return;
  }

  const token = new URLSearchParams(url).get("token") || "";
  
  const decoded = jwt.verify(token, JWT_SECRET);
  if (!decoded) {
    socket.close();
  }

  console.log("socket connected to the server");

  socket.on("message", function (data) {
    console.log(`message received from socket ${data}`);
  });
});
