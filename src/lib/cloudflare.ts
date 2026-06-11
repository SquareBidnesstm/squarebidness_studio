const CF_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID!;
const CF_TOKEN = process.env.CLOUDFLARE_STREAM_API_TOKEN!;
const CF_BASE = `https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/stream`;

/** Get a one-time direct upload URL from Cloudflare Stream */
export async function createDirectUploadURL(maxDurationSeconds = 3600): Promise<{
  uid: string;
  uploadURL: string;
}> {
  const expiry = new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(); // 4 hours
  const res = await fetch(`${CF_BASE}/direct_upload`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${CF_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      maxDurationSeconds,
      expiry,
      requireSignedURLs: false,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Cloudflare direct upload failed: ${err}`);
  }

  const data = await res.json() as { result: { uid: string; uploadURL: string } };
  return { uid: data.result.uid, uploadURL: data.result.uploadURL };
}

/** Delete a video from Cloudflare Stream */
export async function deleteCloudflareVideo(videoId: string): Promise<void> {
  await fetch(`${CF_BASE}/${videoId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${CF_TOKEN}` },
  });
}

/** Get Cloudflare thumbnail URL for a video */
export function getThumbnailUrl(videoId: string, time = "1s"): string {
  return `https://videodelivery.net/${videoId}/thumbnails/thumbnail.jpg?time=${time}&width=640`;
}

/** Get Cloudflare Stream embed URL */
export function getEmbedUrl(videoId: string): string {
  return `https://iframe.videodelivery.net/${videoId}`;
}
