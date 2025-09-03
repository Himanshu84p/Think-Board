"use client";

import { useSocket } from "@/hooks/useSocket";
import { useEffect, useState } from "react";
import { Canvas } from "./Canvas";

export function RoomCanvas({ roomId }: { roomId: string }) {
  const { socket, loading } = useSocket();

  useEffect(() => {
    console.log("joinig room", loading);
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
    return <div>Loading Canvas......</div>;
  }

  return <Canvas roomId={roomId} socket={socket} />;
}
