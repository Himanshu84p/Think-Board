import axios from "axios";
import { HTTP_URL } from "../../config/config";
import { ChatRoom } from "../../../components/ChatRoom";

async function getRoomId(slug: string): Promise<string> {
  const response = await axios.get(`${HTTP_URL}/roomId/${slug}`);
  const roomId = await response.data.roomId;
  // console.log("roomid", response);
  return roomId;
}

export default async function Room({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const slug = (await params).slug;
  const roomId = await getRoomId(slug);
  return <ChatRoom id={roomId} />;
}
