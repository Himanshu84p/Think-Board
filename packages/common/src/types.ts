import { email, string, z } from "zod";

export const UserLoginSchema = z.object({
  email: z.email({ message: "Enter valid email" }),
  password: z.string().min(6, {message : "Password length must be greater than 6"}),
});

export const UserRegisterSchema = z.object({
  name: z.string().min(3).max(10),
  email: z.email({ message: "Enter valid email" }),
  password: z.string().min(6, { message: "Password length must be greater than 6" }),
});

export const CreateRoomSchema = z.object({
  slug: z.string(),
  adminId: z.string(),
});
