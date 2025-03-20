import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request) {
  const token = await getToken({
    req: request,
    secret: process.env.AUTH_SECRET,
  });

  if (token && token.isBlocked) {
    if (request.nextUrl.pathname === "/blocked") {
      return NextResponse.next();
    }

    if (request.nextUrl.pathname.startsWith("/api/auth")) {
      return NextResponse.next();
    }

    const url = new URL("/blocked", request.url);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
