export function ChatRoomClient({
  id,
  messages,
}: {
  id: string;
  messages: string[];
}) {
  return (
    <div className="">
      <div className="flex flex-column gap-2">
        {messages.map((msg) => {
          return <p className=" text-white bg-gray-800 rounded py-2 px-3">{}</p>;
        })}
      </div>
    </div>
  );
}
