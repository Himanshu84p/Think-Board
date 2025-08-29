"use client";

import { useState } from "react";
import {useRouter} from "next/navigation";


export default function Room() {
  const [slug, setSlug] = useState<string>("");
  const router = useRouter();

  async function JoinRoom() {
    router.push(`/room/${slug}`);
  }

  return (
    <div className="flex flex-col gap-2 justify-center items-center">
      <h2 className="text-white font-bold text-2xl ">Enter the Room</h2>
      <input
        className="border-white border-1 rounded text-white px-2"
        type="text"
        value={slug}
        onChange={(e) => setSlug(e.target.value)}
      />
      <button
        className="bg-purple-400 rounded py-2 px-4 text-white my-2"
        onClick={() => JoinRoom()}
      >
        Join Room
      </button>
    </div>
  );
}
