import axios from "axios";
import { HTTP_URL } from "../app/config/config";
import { ChatRoomClient } from "./ChatRoomClient";

async function getChats(id: string) {
  // console.log("id", id);
  const response = await axios.get(`${HTTP_URL}/chats/${Number(id)}`);
  const messages = response.data.chats;
  // console.log("resposne", response);

  return messages;
}

export async function ChatRoom({ id }: { id: string }) {
  const messages = await getChats(id);
  // console.log("123", id, messages);
  return <ChatRoomClient id={id} messages={messages} />;
}
