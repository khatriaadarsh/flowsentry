import { GoogleGenAI } from "@google/genai";

/**
 * Executes hosted Gemma content generation using the official @google/genai SDK
 * Exclusively server-side; safe against client exposure.
 */
export async function queryGemma(prompt, systemInstruction) {
  const apiKey = process.env.GOOGLE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.trim() === "" || apiKey === "your_google_ai_studio_api_key_here") {
    return {
      success: false,
      error: "Google Gemini API key is not configured in the server environment.",
    };
  }

  const modelName = process.env.GEMMA_MODEL || "gemma-4-26b-a4b-it";

  try {
    const ai = new GoogleGenAI({ apiKey });

    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.1, // Deterministic evidence extraction
        responseMimeType: "application/json",
      },
    });

    if (!response || !response.text) {
      return {
        success: false,
        error: "Empty response received from Gemma API",
      };
    }

    return {
      success: true,
      text: response.text,
      model: modelName,
    };
  } catch (err) {
    let errorMessage = err.message || "Unknown error calling hosted Gemma API";
    if (
      errorMessage.includes("429") ||
      errorMessage.toLowerCase().includes("quota")
    ) {
      errorMessage =
        "Google Gemma API rate limit exceeded or quota exhausted (HTTP 429).";
    } else if (
      errorMessage.includes("API key not valid") ||
      errorMessage.includes("403")
    ) {
      errorMessage = "Invalid GEMINI_API_KEY provided.";
    }

    return {
      success: false,
      error: errorMessage,
    };
  }
}
