import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest } from "next/server";

// Initialize the Gemini API with your API key
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || "");

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();

    if (!text) {
      return new Response(JSON.stringify({ error: "No text provided" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // For long documents, we might need to truncate the text to fit within Gemini's limits
    const maxLength = 30000; // Adjust based on Gemini's actual limits
    const truncatedText = text.slice(0, maxLength);

    // Initialize the model (using Gemini Pro for text generation)
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `Please provide a comprehensive summary of the following document. Focus on the main points, key findings, and important conclusions. Keep the summary clear and concise:

${truncatedText}`;

    // Generate the summary
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const summary = response.text();

    return new Response(JSON.stringify({ summary }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error generating summary:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to generate summary",
        details: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}