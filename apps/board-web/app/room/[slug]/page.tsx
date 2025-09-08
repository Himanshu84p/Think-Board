import apiClient from "@/api/apiClient";
import { RoomCanvas } from "@/components/RoomCanvas";
import { AxiosError } from "axios";
import { cookies } from "next/headers";
// import { useRouter } from "next/navigation";
import { toast } from "sonner";

async function getRoomId(slug: string) {
  // const router = useRouter();
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
    if (error instanceof AxiosError) {
      const errorMessage: string = error.response?.data.message;
      console.log("error message", errorMessage);
      // toast.error(errorMessage);
      // router.push("/room/create");
      return;
    }
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
