import { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 8080 });

wss.on("connection", function (socket) {
  console.log("socket connected to the server");

  socket.on("message", function (data) {
    console.log(`message received from socket ${data}`);
  });
});
