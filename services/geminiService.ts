export const evolveImage = async (
  baseImageBase64: string | null,
  userPrompt: string
): Promise<string> => {
  const res = await fetch("/api/evolve", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt: userPrompt, baseImage: baseImageBase64 })
  });

  if (!res.ok) {
    const msg = await res.text().catch(() => "");
    throw new Error(msg || `HTTP_${res.status}`);
  }

  const data = await res.json();
  if (!data?.dataUrl) throw new Error("No image returned.");
  return data.dataUrl as string;
};
