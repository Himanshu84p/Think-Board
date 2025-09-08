import { Tool } from "@/components/Canvas";
import { getExistingShapes } from "./data";
import { parse } from "path";

type Shape =
  | {
    type: "square";
    startX: number;
    startY: number;
    height: number;
    width: number;
  }
  | {
    type: "circle";
    centerX: number;
    centerY: number;
    radius: number;
  }
  | PencilStroke
  | Eraser;

type PencilStroke = {
  type: "pencil";
  startX: number;
  startY: number;
  strokes: { x: number; y: number }[];
};

type Eraser = {
  type: "eraser";
  x: number;
  y: number;
  radius: number;
};

export class Play {
  private canvas: HTMLCanvasElement;
  private socket: WebSocket;
  private ctx: CanvasRenderingContext2D;
  private roomId: string;
  private allShapes: Shape[] = [];
  private startX: number = 0;
  private startY: number = 0;
  private clicked: boolean = false;
  private selectedTool: Tool = "drag";
  private lastX: number = 0;
  private lastY: number = 0;
  private pencilStroke: PencilStroke = {
    type: "pencil",
    startX: 0,
    startY: 0,
    strokes: [],
  };
  private pan: { x: number; y: number };
  private userId: string;

  constructor(
    canvas: HTMLCanvasElement,
    socket: WebSocket,
    roomId: string,
    userId: string
  ) {
    this.canvas = canvas;
    this.socket = socket;
    this.roomId = roomId;
    this.ctx = canvas.getContext("2d")!;
    this.startX = 0;
    this.startY = 0;
    this.initSocketHandler();
    this.addMouseEventHandlers();
    this.pan = { x: 0, y: 0 };
    this.userId = userId;
  }

  async initPlay() {
    const shapes = await getExistingShapes(this.roomId);
    if (shapes) {
      this.allShapes = shapes
    } else {
      this.allShapes = [];
    }
    this.clearCanvas();
  }

  destroyHandlers() {
    this.removeMouseEventHandlers();
  }

  clearCanvas() {
    // reset transform before clearing/drawing
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);

    // Clear background
    this.ctx.fillStyle = "rgb(32 35 42)";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Apply pan transform for drawing shapes
    this.ctx.save();
    // console.log("pan", this.pan);
    this.ctx.translate(this.pan.x, this.pan.y);

    // Draw existing elements with current pan
    this.allShapes.map((dr) => {
      this.ctx.strokeStyle = "white";
      if (dr.type === "square") {
        this.ctx.strokeRect(dr.startX, dr.startY, dr.width, dr.height);
      } else if (dr.type === "circle") {
        this.ctx.beginPath();
        this.ctx.arc(dr.centerX, dr.centerY, dr.radius, 0, 2 * Math.PI);
        this.ctx.strokeStyle = "#fff";
        this.ctx.stroke();
        this.ctx.closePath();
      } else if (dr.type === "pencil") {
        this.ctx.beginPath();
        this.ctx.moveTo(dr.startX, dr.startY);
        dr.strokes.forEach((s) => {
          this.ctx.lineTo(s.x, s.y);
          this.ctx.stroke();
        });
      }
    });

    this.ctx.restore();
  }

  setToolBar(selectedTool: Tool) {
    this.selectedTool = selectedTool;
  }

  initSocketHandler() {
    this.socket.onmessage = (event) => {
      const parsedData = JSON.parse(event.data);
      // console.log("parsed message ", parsedData);
      if (parsedData.type === "chat") {
        const message: Shape = JSON.parse(parsedData.message);
        this.allShapes.push(message);

        this.clearCanvas();
      } else if (parsedData.type === "erase") {
        const message: Shape = JSON.parse(parsedData.message);
        //stringified,bcz object reference is different although values is same
        this.allShapes = this.allShapes.filter(
          (s) => JSON.stringify(s) != JSON.stringify(message)
        );
        this.clearCanvas();
      }
    };
  }

  addMouseEventHandlers() {
    this.canvas.addEventListener("mousedown", this.mouseDownHandler);
    this.canvas.addEventListener("mousemove", this.mouseMoveHandler);
    this.canvas.addEventListener("mouseup", this.mouseUpHandler);
  }
  removeMouseEventHandlers() {
    this.canvas.removeEventListener("mousedown", this.mouseDownHandler);
    this.canvas.removeEventListener("mousemove", this.mouseMoveHandler);
    this.canvas.removeEventListener("mouseup", this.mouseUpHandler);
  }

  mouseDownHandler = (e: MouseEvent) => {
    // console.log("1 mouse down event", this.startX, this.startY);

    this.clearCanvas();
    this.startX = e.clientX;
    this.startY = e.clientY;
    this.clicked = true;
    // console.log(" 2 mouse down event", this.startX, this.startY);
    if (this.selectedTool === "pencil") {
      // this.ctx.lineCap = "round";
      // this.ctx.lineJoin = "round";
      this.ctx.beginPath();
      this.ctx.moveTo(this.startX, this.startY);
      // console.log(this.pencilStroke);
      [this.lastX, this.lastY] = [e.clientX, e.clientY];
      this.pencilStroke = {
        type: "pencil",
        startX: e.clientX,
        startY: e.clientY,
        strokes: [],
      };
    }
  };

  mouseMoveHandler = (e: MouseEvent) => {
    if (this.clicked) {
      // console.log("mouse move event", this.selectedTool);
      if (this.selectedTool != "pencil") {
        this.clearCanvas();
      }
      if (this.selectedTool === "square") {
        this.ctx.strokeStyle = "white";
        this.ctx.strokeRect(
          this.startX,
          this.startY,
          e.clientX - this.startX,
          e.clientY - this.startY
        );
      } else if (this.selectedTool === "circle") {
        const radius =
          Math.max(
            Math.abs(e.clientX - this.startX),
            Math.abs(e.clientY - this.startY)
          ) / 2;
        this.ctx.beginPath();
        this.ctx.arc(
          (this.startX + e.clientX) / 2,
          (this.startY + e.clientY) / 2,
          radius,
          0,
          2 * Math.PI
        );
        this.ctx.strokeStyle = "#fff";
        this.ctx.stroke();
        this.ctx.closePath();
      } else if (this.selectedTool === "pencil") {
        // console.log(this.lastX, this.lastY);
        this.ctx.lineTo(this.lastX, this.lastY);
        this.pencilStroke.strokes.push({ x: this.lastX, y: this.lastY });
        this.ctx.strokeStyle = "white";
        this.ctx.stroke();
        this.lastX = e.offsetX;
        this.lastY = e.offsetY;
      } else if (this.selectedTool === "drag") {
        // Incremental pan by delta from last event
        const dx = e.clientX - this.startX;
        const dy = e.clientY - this.startY;
        this.pan.x += dx;
        this.pan.y += dy;
        // Update starting point for next move
        this.startX = e.clientX;
        this.startY = e.clientY;
        // Redraw with new pan applied in clearCanvas()
        this.clearCanvas();
      } else if (this.selectedTool === "eraser") {
        // console.log(
        //   "eraser selected",
        //   this.startX,
        //   this.startY,
        //   e.clientX,
        //   e.clientY
        // );

        //?1.erase from the canvas
        const eraser: Eraser = {
          type: "eraser",
          x: e.clientX - this.pan.x,
          y: e.clientY - this.pan.y,
          radius: 10,
        };
        this.allShapes = this.allShapes.filter(
          (s) => !this.intersects(s, eraser)
        );
        //erase from the db
      }
    }
  };

  mouseUpHandler = (e: MouseEvent) => {
    // console.log("mouse up event ", this.selectedTool);
    if (this.clicked) {
      this.clearCanvas();
      let currDraw: Shape | null = null;

      this.ctx.strokeStyle = "white";
      if (this.selectedTool === "square") {
        this.ctx.strokeRect(
          this.startX,
          this.startY,
          e.clientX - this.startX,
          e.clientY - this.startY
        );

        // console.log(
        //   " startX, startY ",
        //   this.startX,
        //   this.startY,
        //   "this.pan.x",
        //   this.pan.x,
        //   this.pan.y
        // );
        //set currdraw as per panning coordinates after translate
        currDraw = {
          type: "square",
          startX: this.startX - this.pan.x,
          startY: this.startY - this.pan.y,
          width: e.clientX - this.startX,
          height: e.clientY - this.startY,
        };
      } else if (this.selectedTool === "circle") {
        const radius: number =
          Math.max(
            Math.abs(e.clientX - this.startX),
            Math.abs(e.clientY - this.startY)
          ) / 2;
        this.ctx.beginPath();
        this.ctx.arc(
          (this.startX + e.clientX) / 2,
          (this.startY + e.clientY) / 2,
          radius,
          0,
          2 * Math.PI
        );
        this.ctx.strokeStyle = "#fff";
        this.ctx.stroke();
        this.ctx.closePath();

        const centerX =
          (this.startX - this.pan.x + (e.clientX - this.pan.x)) / 2;
        const centerY =
          (this.startY - this.pan.y + (e.clientY - this.pan.y)) / 2;
        // console.log(
        //   "centerX, centerY, radius",
        //   centerX,
        //   centerY,
        //   radius,
        //   "this.startX",
        //   this.startX,
        //   "client x",
        //   e.clientX,
        //   this.startY
        // );
        //set currdraw
        currDraw = {
          type: "circle",
          centerX: centerX,
          centerY: centerY,
          radius: radius,
        };
      } else if (this.selectedTool === "pencil") {
        this.pencilStroke.startX = this.startX - this.pan.x;
        this.pencilStroke.startY = this.startY - this.pan.y;
        this.pencilStroke.strokes = this.pencilStroke.strokes.map((s) => ({
          x: s.x - this.pan.x,
          y: s.y - this.pan.y,
        }));
        currDraw = this.pencilStroke;
        this.pencilStroke = {
          type: "pencil",
          startX: this.lastX,
          startY: this.lastY,
          strokes: [],
        };
      }
      if (!currDraw) {
        this.clicked = false;
        return;
      }
      //broadcast drawing to the room
      this.allShapes.push(currDraw);

      const stringiDraw = JSON.stringify(currDraw);
      if (this.selectedTool === "square") {
        this.socket.send(
          JSON.stringify({
            type: "chat",
            roomId: this.roomId,
            message: stringiDraw,
            userId: this.userId,
          })
        );
      } else if (this.selectedTool === "circle") {
        this.socket.send(
          JSON.stringify({
            type: "chat",
            roomId: this.roomId,
            message: stringiDraw,
            userId: this.userId,
          })
        );
      } else if (this.selectedTool === "pencil") {
        this.socket.send(
          JSON.stringify({
            type: "chat",
            roomId: this.roomId,
            message: stringiDraw,
            userId: this.userId,
          })
        );
      }
      this.clicked = false;
    }
  };

  intersects(shape: Shape, eraser: Eraser): boolean {
    if (shape.type === "square") {
      const rectX =
        shape.width >= 0 ? shape.startX : shape.startX + shape.width;
      const rectY =
        shape.height >= 0 ? shape.startY : shape.startY + shape.height;
      const rectW = Math.abs(shape.width);
      const rectH = Math.abs(shape.height);

      // Four edges
      const edges: [number, number, number, number][] = [
        [rectX, rectY, rectX + rectW, rectY], // top
        [rectX + rectW, rectY, rectX + rectW, rectY + rectH], // right
        [rectX + rectW, rectY + rectH, rectX, rectY + rectH], // bottom
        [rectX, rectY + rectH, rectX, rectY], // left
      ];

      return edges.some(([x1, y1, x2, y2]) =>
        this.circleLineIntersect(
          eraser.x,
          eraser.y,
          eraser.radius,
          x1,
          y1,
          x2,
          y2,
          shape
        )
      );
    }

    if (shape.type === "circle") {
      const dx = eraser.x - shape.centerX;
      const dy = eraser.y - shape.centerY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const result =
        distance >= shape.radius - eraser.radius &&
        distance <= shape.radius + eraser.radius;

      if (result) {
        const msg = JSON.stringify({
          type: "erase",
          message: JSON.stringify(shape),
          roomId: this.roomId,
        });
        this.socket.send(msg);
      }
      return result;
    }

    if (shape.type === "pencil") {
      // Check if eraser is close to any stroke point
      const result = shape.strokes.some((pt) => {
        const dx = eraser.x - pt.x;
        const dy = eraser.y - pt.y;
        return dx * dx + dy * dy <= eraser.radius * eraser.radius;
      });
      // console.log("pencil result", result);
      if (result) {
        const msg = JSON.stringify({
          type: "erase",
          message: JSON.stringify(shape),
          roomId: this.roomId,
        });
        this.socket.send(msg);
      }
      return result;
    }

    return false;
  }
  circleLineIntersect(
    cx: number,
    cy: number,
    r: number,
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    shape: Shape
  ): boolean {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const lenSq = dx * dx + dy * dy;
    const t = Math.max(
      0,
      Math.min(1, ((cx - x1) * dx + (cy - y1) * dy) / lenSq)
    );

    const closestX = x1 + t * dx;
    const closestY = y1 + t * dy;

    const distX = cx - closestX;
    const distY = cy - closestY;

    const result = distX * distX + distY * distY <= r * r;
    if (result) {
      // console.log("shape erased", shape);
      const msg = JSON.stringify({
        type: "erase",
        message: JSON.stringify(shape),
        roomId: this.roomId,
      });
      this.socket.send(msg);
    }
    return result;
  }
}
