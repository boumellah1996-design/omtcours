import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { readSession, SESSION_COOKIE } from "@/lib/session";

export async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const adminPath = path === "/admin" || path.startsWith("/admin/");
  const session = await readSession(request.cookies.get(SESSION_COOKIE)?.value);

  if (!session) {
    const login = new URL("/login", request.url);
    login.searchParams.set("next", path);
    return NextResponse.redirect(login);
  }

  if (adminPath && session.role !== "admin") {
    return NextResponse.redirect(new URL("/learn", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*", "/learn", "/learn/:path*"],
};
