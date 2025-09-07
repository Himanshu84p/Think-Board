import { HTTP_URL } from "@/config";
import axios from "axios";

const apiClient = axios.create({
  baseURL: HTTP_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export default apiClient;
