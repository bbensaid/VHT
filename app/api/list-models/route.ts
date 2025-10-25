import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    console.log("Listing available Gemini models...");
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || "");
    
    // Try to list models
    const response = await fetch("https://generativelanguage.googleapis.com/v1/models", {
      headers: {
        "Authorization": `Bearer ${process.env.GOOGLE_AI_API_KEY}`,
      },
    });

    const data = await response.json();
    
    return new Response(JSON.stringify({ 
      status: "success", 
      models: data 
    }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Failed to list models:", error);
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