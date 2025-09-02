import { HTTP_URL } from "@/config";
import axios from "axios";

interface Shape {
  type: string;
  startX: number;
  startY: number;
  height: number;
  width: number;
}

let startX = 0;
let startY = 0;
let clicked = false;
let allShapes: Shape[] = [];

export async function Game(
  canvas: HTMLCanvasElement,
  socket: WebSocket,
  roomId: string
) {
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    return;
  }

  // const drawHistory = await getExistingShapes(roomId);
  // if (drawHistory) {
  //   allShapes = [...drawHistory];

  //   allShapes.map((dr) => {
  //     draw preivous shapes getting from db
  //     ctx.strokeStyle = "white";
  //     ctx.strokeRect(dr.startX, dr.startY, dr.height, dr.width);
  //   });
  // }

  canvas.addEventListener("mousedown", function (e) {
    clearAndFillCanvas(ctx, canvas);
    startX = e.clientX;
    startY = e.clientY;
    clicked = true;
  });

  canvas.addEventListener("mousemove", function (e) {
    if (clicked) {
      clearAndFillCanvas(ctx, canvas);

      console.log("mousemove", e.clientX - startX, e.clientY - startY);
      ctx.strokeStyle = "white";
      ctx.strokeRect(startX, startY, e.clientX - startX, e.clientY - startY);
    }
  });

  canvas.addEventListener("mouseup", function (e) {
    if (clicked) {
      console.log("mouseleave", e.clientX - startX, e.clientY - startY);
      clearAndFillCanvas(ctx, canvas);

      ctx.strokeStyle = "white";
      ctx.strokeRect(startX, startY, e.clientX - startX, e.clientY - startY);

      //broadcast drawing to the room
      const currDraw = {
        type: "rect",
        startX,
        startY,
        height: e.clientX - startX,
        width: e.clientY - startY,
      };

      allShapes.push(currDraw);
      const stringiDraw = JSON.stringify(currDraw);
      socket.send(
        JSON.stringify({
          type: "chat",
          roomId,
          message: stringiDraw,
          userId: "cmerm0m5b0000v4toyplgzn1d",
        })
      );
      clicked = false;
    }
  });
}

function clearAndFillCanvas(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement
) {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  //draw existing elements
  allShapes.map((dr) => {
    ctx.strokeStyle = "white";
    ctx.strokeRect(dr.startX, dr.startY, dr.height, dr.width);
  });
}
