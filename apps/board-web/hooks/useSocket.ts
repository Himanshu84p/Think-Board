import { WS_URL } from "@/config";
import { useEffect, useState } from "react";

export function useSocket() {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const ws = new WebSocket(
      `${WS_URL}/?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjbWV2cnl1aWYwMDAxdjRya2E5YmFkOXByIiwiaWF0IjoxNzU2NDA4MDY2fQ.PFVJrRoBQTlQoLBSB74YdVJ8JTupul8GALlciEclw9A`
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
