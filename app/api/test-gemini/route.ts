import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    console.log("Testing Gemini API connection...");
    console.log("API Key exists:", !!process.env.GOOGLE_AI_API_KEY);

    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || "");
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // Try a simple test prompt
    const result = await model.generateContent(
      "Say 'API is working' if you can read this."
    );
    const response = await result.response;
    const text = response.text();

    return new Response(JSON.stringify({ status: "success", message: text }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Gemini API test failed:", error);
    return new Response(
      JSON.stringify({
        status: "error",
        error: error instanceof Error ? error.message : "Unknown error",
        details: error,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
