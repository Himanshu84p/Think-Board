import { Tool } from "@/components/Canvas";
import { getExistingShapes } from "./data";

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
  | PencilStroke;

type PencilStroke = {
  type: "pencil";
  startX: number;
  startY: number;
  strokes: { x: number; y: number }[];
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
  private selectedTool: Tool = "square";
  private lastX: number = 0;
  private lastY: number = 0;
  private pencilStroke: PencilStroke = {
    type: "pencil",
    startX: 0,
    startY: 0,
    strokes: [],
  };
  private pan: { x: number; y: number };

  constructor(canvas: HTMLCanvasElement, socket: WebSocket, roomId: string) {
    this.canvas = canvas;
    this.socket = socket;
    this.roomId = roomId;
    this.ctx = canvas.getContext("2d")!;
    this.startX = 0;
    this.startY = 0;
    this.initSocketHandler();
    this.addMouseEventHandlers();
    this.pan = { x: 0, y: 0 };
  }

  async initPlay() {
    this.allShapes = await getExistingShapes(this.roomId);
    this.clearCanvas();
  }

  destroyHandlers() {
    this.removeMouseEventHandlers();
  }

  clearCanvas() {
    // Always reset transform before clearing/drawing
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);

    // Clear background
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Apply pan transform for drawing shapes
    this.ctx.save();
    this.ctx.translate(this.pan.x, this.pan.y);

    // Draw existing elements with current pan
    this.allShapes.map((dr) => {
      this.ctx.strokeStyle = "white";
      if (dr.type === "square") {
        this.ctx.strokeRect(dr.startX, dr.startY, dr.height, dr.width);
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
    console.log("mouse down event", this.selectedTool);

    this.clearCanvas();

    this.startX = e.clientX;
    this.startY = e.clientY;
    this.clicked = true;
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
      console.log("mouse move event", this.selectedTool);
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
      }
    }
  };

  mouseUpHandler = (e: MouseEvent) => {
    console.log("mouse up event ", this.selectedTool);
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

        //set currdraw
        currDraw = {
          type: "square",
          startX: this.startX,
          startY: this.startY,
          height: e.clientX - this.startX,
          width: e.clientY - this.startY,
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

        //set currdraw
        currDraw = {
          type: "circle",
          centerX: (this.startX + e.clientX) / 2,
          centerY: (this.startY + e.clientY) / 2,
          radius: radius,
        };
      } else if (this.selectedTool === "pencil") {
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
            userId: "cmerm0m5b0000v4toyplgzn1d",
          })
        );
      } else if (this.selectedTool === "circle") {
        this.socket.send(
          JSON.stringify({
            type: "chat",
            roomId: this.roomId,
            message: stringiDraw,
            userId: "cmerm0m5b0000v4toyplgzn1d",
          })
        );
      } else if (this.selectedTool === "pencil") {
        this.socket.send(
          JSON.stringify({
            type: "chat",
            roomId: this.roomId,
            message: stringiDraw,
            userId: "cmerm0m5b0000v4toyplgzn1d",
          })
        );
      }
      this.clicked = false;
    }
  };
}
