import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("token");

  if (req.nextUrl.pathname.startsWith("/room") && !token) {
    return NextResponse.redirect(new URL("/auth/signin", req.url));
  }
  return NextResponse.next();
}
const protectedRoutes = ["/room", "/home"];

export const config = {
  mathcer: ["/room/:path*", "/home/:path*"],
};
