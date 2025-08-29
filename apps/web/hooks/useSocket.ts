
import { useState, useEffect } from "react";
import { WS_URL } from "../app/config/config";

export function useSocket() {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [socket, setSocket] = useState<WebSocket>();

    useEffect(() => {
        const ws = new WebSocket(`${WS_URL}/?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjbWV2c3YyZmUwMDAwdjR0OHdueW4zZTg4IiwiaWF0IjoxNzU2NDQxMzAwfQ.wRBI-oaEBOUZT99u158t9_bXeT9gLCPCKOQbS3u1wcg`);

        ws.onopen = () => {
            setIsLoading(false);
            setSocket(ws);
        }
    }, [])

    return { isLoading, socket }

}