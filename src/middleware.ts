import { NextRequest, NextResponse } from "next/server";

const SESSION_COOKIE = "sbs_admin_session";
const MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000;

function isTokenValid(value: string): boolean {
  const dot = value.indexOf(".");
  if (dot === -1) return false;
  const issuedAt = Number(value.slice(0, dot));
  if (!issuedAt || isNaN(issuedAt)) return false;
  return Date.now() - issuedAt <= MAX_AGE_MS;
}

function hasValidSession(req: NextRequest): boolean {
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  return !!token && isTokenValid(token);
}

const PUBLIC_API = ["/api/admin/login"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    if (!hasValidSession(req)) {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
  }

  if (pathname.startsWith("/api/admin/") && !PUBLIC_API.some(p => pathname.startsWith(p))) {
    if (!hasValidSession(req)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
