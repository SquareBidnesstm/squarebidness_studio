import { NextResponse } from "next/server";
import { createDirectUploadURL } from "../../../../lib/cloudflare";

export async function POST() {
  try {
    const { uid, uploadURL } = await createDirectUploadURL(3600);
    return NextResponse.json({ uid, uploadURL });
  } catch (err: any) {
    console.error("Upload URL error:", err);
    return NextResponse.json({ error: err.message ?? "Failed to get upload URL" }, { status: 500 });
  }
}
