
import { GoogleGenAI } from "@google/genai";

// Ensure API_KEY is set in the environment variables
const apiKey = process.env.API_KEY;
if (!apiKey) {
    throw new Error("API_KEY environment variable not set.");
}
const ai = new GoogleGenAI({ apiKey });

export async function getSecurityTip(): Promise<string> {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: 'Provide a concise, actionable web security tip for developers. The tip should be a single sentence.',
      config: {
        temperature: 0.8,
        maxOutputTokens: 100,
      }
    });

    return response.text.trim();
  } catch (error) {
    console.error("Error fetching security tip from Gemini:", error);
    // Provide a fallback tip in case of an API error
    const fallbackTips = [
        "Always sanitize user inputs to prevent XSS attacks.",
        "Use prepared statements to guard against SQL injection.",
        "Implement strong Content Security Policies (CSP).",
        "Keep all your software dependencies up to date."
    ];
    return fallbackTips[Math.floor(Math.random() * fallbackTips.length)];
  }
}
