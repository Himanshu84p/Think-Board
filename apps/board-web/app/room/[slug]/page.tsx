import apiClient from "@/api/apiClient";
import { RoomCanvas } from "@/components/RoomCanvas";
import { cookies } from "next/headers";

async function getRoomId(slug: string) {
  try {
    const cookieStore = cookies();
    const cookieHeader = (await cookieStore).toString();
    // console.log(slug);
    const response = await apiClient.get(`/roomId/${slug}`, {
      headers: { Cookie: cookieHeader },
    });
    // console.log("response", response);
    return response.data.roomId;
  } catch (error) {
    console.log("error in getting room id", error);
  }
}

export default async function PrivateRoom({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const slug = (await params).slug;
  // console.log("slug", slug);
  const roomId = await getRoomId(slug);

  return <RoomCanvas roomId={roomId} />;
}
