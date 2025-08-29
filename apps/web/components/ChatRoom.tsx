import axios from "axios";
import { HTTP_URL } from "../app/config/config";
import { ChatRoomClient } from "./ChatRoomClient";

async function getChats(id : string) {
    const response = await axios.get(`${HTTP_URL}/roomId/${id}`);
    const messages = response.data.chats;
    console.log(messages);

    return messages;
}

export async function ChatRoom({ id }: { id: string }) {
  const messages = await getChats(id);

  return <ChatRoomClient id={id} messages={messages} />
}
