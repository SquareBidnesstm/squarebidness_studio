import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

const SESSION_COOKIE = "sbs_admin_session";
const MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

function getSecret(): string {
  const s = process.env.APP_SECRET;
  if (!s) throw new Error("APP_SECRET not set");
  return s;
}

export function computeSessionToken(): string {
  const issuedAt = Date.now();
  const hmac = createHmac("sha256", getSecret()).update(String(issuedAt)).digest("hex");
  return `${issuedAt}.${hmac}`;
}

export function verifyToken(token: string): boolean {
  const dot = token.indexOf(".");
  if (dot === -1) return false;
  const issuedAt = Number(token.slice(0, dot));
  if (!issuedAt || isNaN(issuedAt)) return false;
  if (Date.now() - issuedAt > MAX_AGE_MS) return false;
  const expectedHmac = createHmac("sha256", getSecret()).update(String(issuedAt)).digest("hex");
  const actualHmac = token.slice(dot + 1);
  try {
    return timingSafeEqual(Buffer.from(expectedHmac, "hex"), Buffer.from(actualHmac, "hex"));
  } catch {
    return false;
  }
}

export async function isAdminAuthed(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE)?.value;
    if (!token) return false;
    return verifyToken(token);
  } catch {
    return false;
  }
}

export { SESSION_COOKIE };
