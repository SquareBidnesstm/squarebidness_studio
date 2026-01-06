import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

function parseDataUrl(input: string) {
  const match = input.match(/^data:(.+?);base64,(.+)$/);
  if (!match) return { mimeType: "image/jpeg", base64Data: input };
  return { mimeType: match[1] || "image/jpeg", base64Data: match[2] || "" };
}

export async function POST(req: Request) {
  try {
    const { prompt, baseImage } = await req.json();

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json({ error: "Missing prompt" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Missing GEMINI_API_KEY" }, { status: 500 });
    }

    const ai = new GoogleGenAI({ apiKey });

    const systemInstruction = `
You are the Visual Infrastructure Lead for Square Bidness Tech Lab.
Veteran-led mindset. Transform reference photos into high-performance Open Graph assets.

Brand:
SB Tech Lab — commerce and AI infrastructure. Quiet, disciplined, Louisiana-rooted.

Visual Language:
- Midnight Black (#020617) + International Orange (#f97316)
- Cinematic low-key lighting, professional engineering workspace
- “Quietly installed” branding, never loud

Execution:
- Use uploaded photo as blueprint
- Replace generic elements with Tech Lab infrastructure
- Sharp depth of field, production-ready
`.trim();

    const parts: any[] = [{ text: `${systemInstruction}\n\nOperator Vision: ${prompt}` }];

    if (baseImage && typeof baseImage === "string") {
      const { mimeType, base64Data } = parseDataUrl(baseImage);
      parts.push({ inlineData: { data: base64Data, mimeType } });
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents: [{ parts }],
      config: { imageConfig: { aspectRatio: "16:9" } }
    });

    const partsOut = response.candidates?.[0]?.content?.parts || [];
    for (const p of partsOut) {
      if (p?.inlineData?.data) {
        return NextResponse.json({
          dataUrl: `data:image/png;base64,${p.inlineData.data}`
        });
      }
    }

    return NextResponse.json({ error: "No image returned" }, { status: 500 });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Server error" }, { status: 500 });
  }
}
