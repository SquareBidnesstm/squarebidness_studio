import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE } from "../../../../lib/auth";

export async function GET(req: NextRequest) {
  const url = new URL("/admin/login", req.url);
  const res = NextResponse.redirect(url);
  res.cookies.delete(SESSION_COOKIE);
  return res;
}
