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
  | {
      type: "pencil";
      lineX: number;
      lineY: number;
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

  constructor(canvas: HTMLCanvasElement, socket: WebSocket, roomId: string) {
    this.canvas = canvas;
    this.socket = socket;
    this.roomId = roomId;
    this.ctx = canvas.getContext("2d")!;
    this.startX = 0;
    this.startY = 0;
    this.initSocketHandler();
    this.addMouseEventHandlers();
  }

  async initPlay() {
    this.allShapes = await getExistingShapes(this.roomId);
    this.clearCanvas();
  }

  destroyHandlers() {
    this.removeMouseEventHandlers();
  }

  clearCanvas() {
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    //draw existing elements
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
      }
    });
  }

  setToolBar(selectedTool: Tool) {
    this.selectedTool = selectedTool;
  }

  initSocketHandler() {
    this.socket.onmessage = (event) => {
      const parsedData = JSON.parse(event.data);
      console.log("parsed message ", parsedData);
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
      this.ctx.strokeStyle = "#333";
      //   this.ctx.lineWidth = 2;
      this.ctx.lineCap = "round";
      this.ctx.lineJoin = "round";
      this.ctx.beginPath();
      this.ctx.moveTo(e.offsetX, e.offsetY);
    }
  };

  mouseMoveHandler = (e: MouseEvent) => {
    if (this.clicked) {
      console.log("mouse move event", this.selectedTool);
      this.clearCanvas();

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
        this.ctx.lineTo(e.offsetX, e.offsetY);
        [this.lastX, this.lastY] = [e.offsetX, e.offsetY];
        this.ctx.stroke();
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
        // this.ctx.closePath();

        currDraw = {
          type: "pencil",
          lineX: this.lastX,
          lineY: this.lastY,
        };
      }
      if (!currDraw) {
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
      }
      this.clicked = false;
    }
  };
}
