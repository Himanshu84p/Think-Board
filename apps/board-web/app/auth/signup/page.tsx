import { Auth } from "@/components/Auth";

export default function SignUp() {
  return (
    <div className="h-screen w-full flex justify-center items-center">
      <Auth signIn={false} />
    </div>
  );
}
