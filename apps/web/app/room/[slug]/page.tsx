import axios from "axios";
import { HTTP_URL } from "../../config/config";
import { ChatRoom } from "../../../components/ChatRoom";

async function getRoomId(slug: string): Promise<string> {
  const response = await axios.get(`${HTTP_URL}/roomId/${slug}`);
  const roomId = await response.data.roomId;

  return roomId;
}

export async function Room({ slug }: { slug: string }) {
  const roomId = await getRoomId(slug);
  return <ChatRoom id={roomId} />;
}
