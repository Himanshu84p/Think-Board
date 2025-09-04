import { WS_URL } from "@/config";
import { useEffect, useState } from "react";

export function useSocket() {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const ws = new WebSocket(
      `${WS_URL}/?token=${token}`
    );
    ws.onopen = () => {
      setSocket(ws);
      setLoading(false);
    };

    return () => {
      ws.close();
    };
  }, []);

  return { socket, loading };
}
