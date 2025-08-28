import { email, string, z } from "zod";

export const UserLoginSchema = z.object({
  email: email(),
  password: string().min(6),
});

export const UserRegisterSchema = z.object({
  name: string().min(3).max(10),
  email: email(),
  password: string().min(6),
});

export const CreateRoomSchema = z.object({
  slug: string(),
  adminId: string(),
});
