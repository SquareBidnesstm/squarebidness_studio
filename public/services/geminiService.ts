import { GoogleGenAI } from "@google/genai";

export const evolveImage = async (
  baseImageBase64: string | null,
  userPrompt: string
): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const systemInstruction = `
    You are the Visual Infrastructure Lead for Square Bidness Tech Lab. 
    You are an operator with a veteran-led mindset. Your goal is to transform reference photos into high-performance 1200x630 (16:9) Open Graph assets.
    
    The Brand: 
    SB Tech Lab is a commerce and AI infrastructure company. We are quiet, disciplined, and rooted in Louisiana.
    
    The Visual Language:
    - Primary Colors: Midnight Black (#020617) and International Orange (#f97316).
    - Lighting: Cinematic, low-key, professional workspace vibes.
    - Atmosphere: High-end engineering. Think Mac Studio, 5K displays, clean cables, and the glow of an execution engine at work.
    
    The Execution:
    - Use the uploaded photo as the "blueprint."
    - Replace generic elements with "Tech Lab" infrastructure.
    - Ensure any branding (SB or Tech Lab) feels quietly installed, not loudly advertised.
    - Deliver sharp, production-ready depth of field.
  `;

  const textPart = {
    text: `${systemInstruction}\n\nOperator Vision: ${userPrompt}`
  };

  const parts: any[] = [textPart];

  if (baseImageBase64) {
    const base64Data = baseImageBase64.includes(',') 
      ? baseImageBase64.split(',')[1] 
      : baseImageBase64;
      
    parts.push({
      inlineData: {
        data: base64Data,
        mimeType: 'image/jpeg'
      }
    });
  }

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: [{ parts }],
    config: {
      imageConfig: {
        aspectRatio: "16:9"
      }
    }
  });

  const candidates = response.candidates;
  if (candidates && candidates.length > 0) {
    for (const part of candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
  }

  throw new Error("Infrastructure failed to render. Retry install.");
};
