import { ReactNode, useEffect, useRef, useState } from "react";
import { Play } from "@/draw/Play";
import {
  ArrowLeftFromLine,
  Circle,
  Eraser,
  Hand,
  Pencil,
  Square,
} from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

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
  const [cursorStyle, setCursorStyle] = useState<string>("cursor-grab");
  const router = useRouter();

  const Tools: {
    name: string;
    icon: ReactNode;
    tool: Tool;
    cursorStyle: string;
  }[] = [
    {
      name: "Select & Pan",
      icon: <Hand className="w-4 h-4" />,
      tool: "drag",
      cursorStyle: `${grabbing ? "cursor-grabbing" : "cursor-grab"}`,
    },
    {
      name: "Square",
      icon: <Square className="w-4 h-4" />,
      tool: "square",
      cursorStyle: "cursor-crosshair",
    },
    {
      name: "Circle",
      icon: <Circle className="w-4 h-4" />,
      tool: "circle",
      cursorStyle: "cursor-crosshair",
    },
    {
      name: "Pencil",
      icon: <Pencil className="w-4 h-4" />,
      tool: "pencil",
      cursorStyle: "custom-cursor-pencil",
    },
    {
      name: "Eraser",
      icon: <Eraser className="w-4 h-4" />,
      tool: "eraser",
      cursorStyle: "custom-cursor-eraser",
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
        className={`overflow-hidden ${cursorStyle}`}
      />

      {/* Updated Toolbar */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed top-4 left-1/2 -translate-x-1/2 flex items-center gap-1 p-1.5 rounded-lg bg-background/95 backdrop-blur-sm border border-border/40 shadow-lg"
      >
        {Tools.map((tool, index) => (
          <div key={tool.name} className="relative group">
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "relative h-9 px-2.5 rounded-md transition-all duration-200",
                "hover:bg-foreground/50",
                selectedTool === tool.tool &&
                  "bg-primary/20 text-primary hover:bg-primary/20"
              )}
              onClick={() => {
                setSelectedTool(tool.tool);
                setCursorStyle(tool.cursorStyle);
              }}
            >
              {tool.icon}
              <span className="sr-only">{tool.name}</span>
            </Button>

            {/* Tooltip */}
            <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 px-2 py-1 rounded bg-popover text-popover-foreground text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              {tool.name}
            </div>
          </div>
        ))}
      </motion.div>

      {/* Back Button */}
      <motion.div
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="fixed top-4 left-4"
      >
        <Button
          variant="outline"
          size="sm"
          className="bg-background/95 backdrop-blur-sm hover:bg-secondary/10"
          onClick={() => {
            router.push("/room/create");
          }}
        >
          <ArrowLeftFromLine className="w-4 h-4" />
          <span className="sr-only">Back to Rooms</span>
        </Button>
      </motion.div>
    </>
  );
}
