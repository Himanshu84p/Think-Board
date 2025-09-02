"use client";

import { useSocket } from "@/hooks/useSocket";
import { useEffect, useState } from "react";
import { Canvas } from "./Canvas";

export function RoomCanvas({ roomId }: { roomId: string }) {
  const { socket, loading } = useSocket();

  useEffect(() => {
    // console.log("joinig room", socket, loading);
    if (socket && !loading) {
      socket.send(JSON.stringify({ type: "join_room", roomId }));
    }
  }, [socket]);

  if (!socket) {
    return <div>Loading Canvas......</div>;
  }

  return <Canvas roomId={roomId} socket={socket} />;
}
