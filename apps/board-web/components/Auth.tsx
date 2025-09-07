"use client";

import { AxiosError } from "axios";
import { useState } from "react";
import { toast } from "sonner";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2Icon } from "lucide-react";
import apiClient from "@/api/apiClient";

export function Auth({ signIn }: { signIn: boolean }) {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  function clearControls() {
    setName("");
    setEmail("");
    setPassword("");
  }

  async function handleSubmit() {
    try {
      const submitUrl = signIn ? `/signin` : `/signup`;
      if (signIn) {
        setLoading(true);
        const formData = { email, password };
        const response = await apiClient.post(submitUrl, formData);

        if (response.status) {
          const userId = response.data.data.userId;
          localStorage.setItem("userId", userId);
          localStorage.setItem("token", response.data.token);
          toast.success("Signed in successfully");
          clearControls();
          setLoading(false);
          router.push("/home");
          return;
        }
      } else {
        const formData = { name, email, password };
        const response = await apiClient.post(submitUrl, formData);

        if (response.status) {
          toast.success(
            "Signed up successfully, Sign in to access your account"
          );
          clearControls();
          setLoading(false);
          router.push("/auth/signin");
          return;
        }
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        const errorMessage: string = error.response?.data.message;
        toast.error(errorMessage);
        setLoading(false);
        return;
      } else {
        toast.error("Something went wrong try after some time");
        setLoading(false);
        return;
      }
    }
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>{signIn ? "Login to" : "Signup"} your account</CardTitle>
        <CardDescription>
          Enter your details below to {signIn ? "Login" : "Signup"} to your
          account
        </CardDescription>
        <CardAction>
          {signIn ? (
            <Link href={"/auth/signup"}>
              <Button variant="link">Signup</Button>
            </Link>
          ) : (
            <Link href={"/auth/signin"}>
              <Button variant="link">Signin</Button>
            </Link>
          )}
        </CardAction>
      </CardHeader>
      <CardContent>
        <form>
          <div className="flex flex-col gap-6">
            {signIn ? (
              <></>
            ) : (
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  type="name"
                  placeholder="Himanshu"
                  required
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            )}
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="think@dev.com"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                {signIn ? (
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a>
                ) : null}
              </div>
              <Input
                id="password"
                type="password"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <Button
          disabled={loading}
          type="submit"
          className="w-full"
          onClick={() => handleSubmit()}
        >
          {loading ? <Loader2Icon className="animate-spin" /> : null}
          {signIn ? "Login" : "Signup"}
        </Button>
      </CardFooter>
    </Card>
  );
}
