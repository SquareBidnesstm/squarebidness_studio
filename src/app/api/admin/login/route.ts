import { NextRequest, NextResponse } from "next/server";
import { computeSessionToken, SESSION_COOKIE } from "../../../../lib/auth";
import { checkRateLimit } from "../../../../lib/utils";

function timingSafeEqual(a: string, b: string): boolean {
  const enc = new TextEncoder();
  const aB = enc.encode(a), bB = enc.encode(b);
  if (aB.length !== bB.length) return false;
  let diff = 0;
  for (let i = 0; i < aB.length; i++) diff |= aB[i] ^ bB[i];
  return diff === 0;
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const { limited } = await checkRateLimit(`admin_login:${ip}`, 10);
  if (limited) return NextResponse.redirect(new URL("/admin/login?error=rate_limited", req.url));

  const form = await req.formData();
  const password = (form.get("password") as string ?? "").trim();
  const expected = process.env.ADMIN_PASSWORD ?? "";

  if (!expected) {
    console.error("ADMIN_PASSWORD not set");
    return NextResponse.redirect(new URL("/admin/login?error=server_error", req.url));
  }

  if (!timingSafeEqual(password, expected)) {
    return NextResponse.redirect(new URL("/admin/login?error=invalid", req.url));
  }

  const token = computeSessionToken();
  const res = NextResponse.redirect(new URL("/admin", req.url));
  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true, secure: true, sameSite: "lax",
    maxAge: 30 * 24 * 60 * 60, path: "/",
  });
  return res;
}
