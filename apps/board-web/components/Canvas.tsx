import { ReactNode, useEffect, useRef, useState } from "react";
import { Play } from "@/draw/Play";
import { Circle, Eraser, Hand, HandGrab, Pencil, Square } from "lucide-react";
import { Button } from "./ui/button";

export type Tool = "square" | "circle" | "pencil" | "drag" | "eraser";

export function Canvas({
  roomId,
  socket,
}: {
  roomId: string;
  socket: WebSocket;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedTool, setSelectedTool] = useState<Tool>("drag");
  const [grabbing, setGrabbing] = useState<boolean>(false);
  const [play, setPlay] = useState<Play>();

  const Tools: { name: string; icon: ReactNode; tool: Tool }[] = [
    {
      name: "Square",
      icon: <Square />,
      tool: "square",
    },
    {
      name: "Circle",
      icon: <Circle />,
      tool: "circle",
    },
    {
      name: "Pencil",
      icon: <Pencil />,
      tool: "pencil",
    },
    {
      name: "Drag",
      icon: grabbing ? <HandGrab /> : <Hand />,
      tool: "drag",
    },
    {
      name: "Eraser",
      icon: <Eraser />,
      tool: "eraser",
    },
  ];
  useEffect(() => {
    play?.setToolBar(selectedTool);
  }, [play, selectedTool]);

  useEffect(() => {
    if (canvasRef.current) {
      const userId = localStorage.getItem("userId")!;
      // console.log("userId", userId);
      const play = new Play(canvasRef.current, socket, roomId, userId);
      setPlay(play);
      play.initPlay();

      return () => {
        console.log("old destroyed");
        play.destroyHandlers();
      };
    }
  }, [canvasRef]);

  return (
    <>
      <canvas
        width={window.innerWidth}
        height={window.innerHeight}
        ref={canvasRef}
        className="overflow-hidden"
      ></canvas>
      <div className="flex flex-col gap-4 fixed left-2 top-2 bg-gray-700 py-3 px-2 rounded">
        {Tools.map((tool) => (
          <Button
            key={tool.name}
            className={`${selectedTool === tool.tool ? "bg-blue-400 hover:bg-blue-400" : ""}`}
            onClick={() => {
              setSelectedTool(tool.tool);
            }}
          >
            {tool.icon}
          </Button>
        ))}
        {/* <Button
          className={`${selectedTool === "square" ? "bg-blue-400 hover:bg-blue-400" : ""}`}
          onClick={() => {
            setSelectedTool("square");
          }}
        >
          <Square />
        </Button>
        <Button
          className={`${selectedTool === "circle" ? "bg-blue-400 hover:bg-blue-400" : ""}`}
          onClick={() => {
            setSelectedTool("circle");
          }}
        >
          <Circle />
        </Button>
        <Button
          className={`${selectedTool === "pencil" ? "bg-blue-400 hover:bg-blue-400" : ""}`}
          onClick={() => {
            setSelectedTool("pencil");
          }}
        >
          <Pencil />
        </Button>
        <Button
          className={`${selectedTool === "drag" ? "bg-blue-400 hover:bg-blue-400" : ""}`}
          onClick={() => {
            setSelectedTool("drag");
          }}
        >
          {grabbing ? <HandGrab /> : <Hand />}
        </Button>
         <Button
          className={`${selectedTool === "drag" ? "bg-blue-400 hover:bg-blue-400" : ""}`}
          onClick={() => {
            setSelectedTool("drag");
          }}
        >
          {grabbing ? <HandGrab /> : <Hand />}
        </Button> */}
      </div>
    </>
  );
}
