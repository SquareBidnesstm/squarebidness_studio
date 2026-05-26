"use client";
import { useEffect } from "react";

export function ViewTracker({ slug }: { slug: string }) {
  useEffect(() => {
    const key = `sbv_${slug}`;
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, "1");
    fetch(`/api/videos/${slug}/view`, { method: "POST" }).catch(() => {});
  }, [slug]);
  return null;
}
