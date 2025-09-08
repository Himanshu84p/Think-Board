"use client";

import { useSocket } from "@/hooks/useSocket";
import { useEffect, useState } from "react";
import { Canvas } from "./Canvas";
import { Loader2Icon } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function RoomCanvas({ roomId }: { roomId: string }) {
  const { socket, loading } = useSocket();
  const router = useRouter();
  useEffect(() => {
    console.log("joinig room", loading);
    if (!roomId) {
      toast.error("Room not found");
      router.push("/room/create");
      return;
    }
    if (!socket || loading) return;

    socket.send(JSON.stringify({ type: "join_room", roomId }));

    return () => {
      console.log("leaving room", loading);
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({ type: "leave_room", roomId }));
      }
    };
  }, [socket, loading, roomId]);

  if (!socket) {
    return (
      <div className="min-h-screen w-full justify-center items-center">
        <Loader2Icon className="animate-spin" />
      </div>
    );
  }

  return <Canvas roomId={roomId} socket={socket} />;
}
