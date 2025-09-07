"use client";
import apiClient from "@/api/apiClient";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AxiosError } from "axios";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export function CreateRoom() {
  const [createRoomSlug, setCreateRoomSlug] = useState<string>("");
  const [joinRoomSlug, setJoinRoomSlug] = useState<string>("");
  const [userId, setUserId] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    const id = localStorage.getItem("userId");
    if (id) {
      setUserId(id);
    }
    return () => {
      console.log("clean up create room");
    };
  }, []);

  const handleCreateRoom = async () => {
    try {
      const response = await apiClient.post("/create-room", {
        slug: createRoomSlug,
        adminId: userId,
      });
      console.log("create room", response);

      if (response.status) {
        toast.success("Room Created Successfully");
        router.push(`/room/${response.data.createdRoom.slug}`);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log("error while creating room", error);
      if (error instanceof AxiosError) {
        const errorMessage: string = error.response?.data.message;
        toast.error(errorMessage);
        return;
      }
    }
  };

  const handleJoinRoom = async () => {
    try {
      router.push(`/room/${joinRoomSlug}`);
    } catch (error) {
      console.log("error while joining room", error);
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="flex w-full max-w-sm flex-col gap-6">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Tabs defaultValue="create">
          <TabsList>
            <TabsTrigger value="create">Create</TabsTrigger>
            <TabsTrigger value="join">Join</TabsTrigger>
          </TabsList>
          <TabsContent value="create">
            <Card>
              <CardHeader>
                <CardTitle>Create Room</CardTitle>
                <CardDescription></CardDescription>
              </CardHeader>
              <CardContent className="grid gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="create-room">Room Name</Label>
                  <Input
                    id="create-room"
                    type="text"
                    placeholder="my-room"
                    onChange={(e) => {
                      setCreateRoomSlug(e.target.value);
                    }}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={() => handleCreateRoom()}>Create</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="join">
            <Card>
              <CardHeader>
                <CardTitle>Join Room</CardTitle>
                <CardDescription></CardDescription>
              </CardHeader>
              <CardContent className="grid gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="join-room">Room Name</Label>
                  <Input
                    
                    id="join-room"
                    type="text"
                    onChange={(e) => {
                      setJoinRoomSlug(e.target.value);
                    }}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={() => handleJoinRoom()}>Join</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}
