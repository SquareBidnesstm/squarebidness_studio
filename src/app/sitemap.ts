import { MetadataRoute } from "next";
import { supabaseServer } from "../lib/supabase/server";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = "https://studio.squarebidness.com";
  const statics: MetadataRoute.Sitemap = [
    { url: base, lastModified: new Date(), changeFrequency: "hourly", priority: 1 },
  ];
  try {
    const { data } = await supabaseServer
      .from("videos").select("slug, updated_at").eq("status", "published");
    const videoUrls: MetadataRoute.Sitemap = (data ?? []).map(v => ({
      url: `${base}/watch/${v.slug}`,
      lastModified: new Date(v.updated_at),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));
    return [...statics, ...videoUrls];
  } catch { return statics; }
}
