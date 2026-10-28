import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { readSession, SESSION_COOKIE, sessionCookieOptions } from "@/lib/session";

export async function proxy(request: NextRequest) {
  const session = await readSession(request.cookies.get(SESSION_COOKIE)?.value);
  const path = request.nextUrl.pathname;
  const adminPath = path === "/admin" || path.startsWith("/admin/");

  if (!session) {
    const login = new URL("/login", request.url);
    login.searchParams.set("next", path);
    return NextResponse.redirect(login);
  }

  if (session.role === "student") {
    const user = await prisma.user.findUnique({
      where: { id: session.sub },
      select: { activeSessionId: true, role: true },
    });
    if (!user || user.role !== "student" || !session.sid || user.activeSessionId !== session.sid) {
      const login = new URL("/login", request.url);
      login.searchParams.set("reason", "replaced");
      const response = NextResponse.redirect(login);
      response.cookies.set(SESSION_COOKIE, "", { ...sessionCookieOptions(), maxAge: 0 });
      return response;
    }
  }

  if (adminPath && session.role !== "admin") {
    return NextResponse.redirect(new URL("/learn", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*", "/learn", "/learn/:path*"],
};
