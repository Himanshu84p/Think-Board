import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

const protectedRoutes = ["/room"];

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("token");
  const { pathname } = req.nextUrl;

  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isProtected && !token) {
    return NextResponse.redirect(new URL("/auth/signin", req.url));
  }
  if (req.nextUrl.pathname.startsWith("/auth") && token) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  mathcer: ["/room/:path*", "/auth/:path*"],
};
