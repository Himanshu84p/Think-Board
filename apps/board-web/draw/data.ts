import axios from "axios";
import { HTTP_URL } from "@/config";
import apiClient from "@/api/apiClient";

export async function getExistingShapes(roomId: string) {
  try {
    const response = await apiClient.get(`/chats/${roomId}`);
    const chats = response.data.chats;

    const parsedData = chats.map((chat: { message: string }) => {
      return JSON.parse(chat.message);
    });
    console.log("chat history", parsedData);
    return parsedData;
  } catch (error) {
    console.log("error in getting shapes", error);
    return null;
  }
}
