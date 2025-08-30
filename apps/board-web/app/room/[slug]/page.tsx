import { RoomCanvas } from "@/components/RoomCanvas";
import { HTTP_URL } from "@/config";
import axios from "axios";

async function getRoomId(slug: string) {
  const response = await axios.get(`${HTTP_URL}/roomId/${slug}`);
  console.log("response", response);
  return response.data.roomId;
}

export default async function PrivateRoom({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const slug = (await params).slug;
  const roomId = await getRoomId(slug);

  return <RoomCanvas roomId={roomId} />;
}
