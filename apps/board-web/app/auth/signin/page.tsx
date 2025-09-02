import { Auth } from "@/components/Auth";

export default function SignIn() {
  return (
    <div className="h-screen w-full flex justify-center items-center">
      <Auth signIn={true} />
    </div>
  );
}
