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
import { ArrowLeft, Loader2Icon, Plus, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export function CreateRoom() {
  const [createRoomSlug, setCreateRoomSlug] = useState<string>("");
  const [joinRoomSlug, setJoinRoomSlug] = useState<string>("");
  const [userId, setUserId] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
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
      setLoading(true);
      const response = await apiClient.post("/create-room", {
        slug: createRoomSlug,
        adminId: userId,
      });
      console.log("create room", response);

      if (response.status) {
        setLoading(false);
        toast.success("Room Created Successfully");
        router.push(`/room/${response.data.createdRoom.slug}`);
      } else {
        setLoading(false);
        toast.error(response.data.message);
      }
    } catch (error) {
      setLoading(false);
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
      setLoading(true);
      router.push(`/room/${joinRoomSlug}`);
      setLoading(false);
    } catch (error) {
      console.log("error while joining room", error);
      toast.error("Something went wrong");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-background via-background/95 to-background">
      {/* Background blur elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div
          className="absolute -bottom-1/2 -left-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "-2s" }}
        />
      </div>

      {/* Back Button */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="absolute top-8 left-8"
      >
        <Button
          variant="ghost"
          onClick={() => router.push("/")}
          className="group flex items-center gap-2 hover:bg-background/50"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          Back to Home
        </Button>
      </motion.div>

      <div className="flex w-full max-w-md flex-col gap-6 relative">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center mb-6"
        >
          <h1 className="text-3xl font-bold mb-2">Welcome to ThinkBoard</h1>
          <p className="text-muted-foreground">
            Create or join a room to start collaborating
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Tabs defaultValue="create" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6 bg-foreground/5 shadow-lg">
              <TabsTrigger
                value="create"
                className="data-[state=active]:bg-accent/40"
              >
                <Plus />
                Create
              </TabsTrigger>
              <TabsTrigger
                value="join"
                className="data-[state=active]:bg-accent/40"
              >
                <Users />
                Join
              </TabsTrigger>
            </TabsList>

            <TabsContent value="create">
              <Card className="border-2 border-primary/20 bg-card/50 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle>Create New Room</CardTitle>
                  <CardDescription>
                    Create a new room and invite others to join
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-6">
                  <div className="grid gap-3">
                    <Label htmlFor="create-room">Room Name</Label>
                    <Input
                      id="create-room"
                      type="text"
                      placeholder="e.g., project-brainstorm"
                      className="bg-background/50"
                      onChange={(e) => setCreateRoomSlug(e.target.value)}
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    onClick={handleCreateRoom}
                    className="w-full bg-gradient-to-r from-primary to-primary/80 hover:opacity-90"
                    disabled={!createRoomSlug || loading}
                  >
                    {loading ? (
                      <Loader2Icon className="animate-spin" />
                    ) : (
                      <Plus />
                    )}
                    {loading ? "Creating Room" : "Create Room"}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="join">
              <Card className="border-2 border-primary/20 bg-card/50 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle>Join Existing Room</CardTitle>
                  <CardDescription>
                    Enter a room name to join the collaboration
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-6">
                  <div className="grid gap-3">
                    <Label htmlFor="join-room">Room Name</Label>
                    <Input
                      id="join-room"
                      type="text"
                      placeholder="e.g., project-brainstorm"
                      className="bg-background/50"
                      onChange={(e) => setJoinRoomSlug(e.target.value)}
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    onClick={handleJoinRoom}
                    className="w-full text-foreground bg-gradient-to-r from-secondary to-secondary/80 hover:opacity-90"
                    disabled={!joinRoomSlug || loading}
                  >
                    {loading ? (
                      <Loader2Icon className="animate-spin" />
                    ) : (
                      <Users />
                    )}
                    {loading ? "Joining Room" : "Join Room"}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}
