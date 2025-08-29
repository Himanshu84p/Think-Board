"use client";

import { useState, useEffect } from "react";
import { useSocket } from "../hooks/useSocket";

export function ChatRoomClient({
  id,
  messages,
}: {
  id: string;
  messages: { message: string }[];
}) {
  const [txtMsg, setTxtMsg] = useState<string>("");
  const { socket, isLoading } = useSocket();
  const [chats, setChats] = useState(messages);
  // console.log(chats);
  async function SendMessage() {
    socket?.send(JSON.stringify({ type: "chat", roomId: id, message: txtMsg }));
    // setChats((chats) => [...chats, { message: txtMsg }]);
    setTxtMsg("");
  }

  useEffect(() => {
    if (socket && !isLoading) {
      socket.send(JSON.stringify({ type: "join_room", roomId: id }));

      socket.onmessage = (event) => {
        const data = JSON.parse(event.data);

        if (data && data.type === "chat") {
          const message = data.message;
          setChats((chats) => [...chats, { message: message }]);
        }
      };
    }
  }, [socket]);
  return (
    <div>
      <div className="flex gap-2 max-w-fit flex-col py-3">
        {chats?.map((msg, index) => {
          return (
            <p className="text-white bg-gray-800 rounded py-2 px-3" key={index}>
              {msg.message}
            </p>
          );
        })}
      </div>
      <div className="">
        <input
          type="text"
          className="text-white px-2 rounded border-1 border-white"
          value={txtMsg}
          onChange={(e) => setTxtMsg(e.target.value)}
        />
        <button
          className="bg-amber-500 text-white px-3 py-1 rounded-2xl mx-3"
          onClick={() => SendMessage()}
        >
          Send
        </button>
      </div>
    </div>
  );
}
