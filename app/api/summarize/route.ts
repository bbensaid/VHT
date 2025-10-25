import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest } from "next/server";

// Initialize the Gemini API with your API key
if (!process.env.GOOGLE_AI_API_KEY) {
  console.error("GOOGLE_AI_API_KEY is not set in environment variables");
  throw new Error("API key not configured");
}

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);

export async function POST(req: NextRequest) {
  try {
    console.log("Received summarize request");
    const { text } = await req.json();

    if (!text) {
      console.log("No text provided in request");
      return new Response(JSON.stringify({ error: "No text provided" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    console.log(`Received text of length: ${text.length}`);

    // For long documents, we might need to truncate the text to fit within Gemini's limits
    const maxLength = 30000; // Adjust based on Gemini's actual limits
    const truncatedText = text.slice(0, maxLength);

    // Initialize the model (using Gemini Pro for text generation)
    const model = genAI.getGenerativeModel({ 
      model: "models/gemini-1.0-pro",
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      },
    });

    const prompt = `Please provide a comprehensive summary of the following document. Focus on the main points, key findings, and important conclusions. Keep the summary clear and concise:

${truncatedText}`;

    // Generate the summary
    try {
      console.log("Generating content with Gemini...");
      const result = await model.generateContent(prompt);
      console.log("Content generated, getting response...");
      const response = await result.response;
      console.log("Got response, extracting text...");
      const summary = response.text();
      console.log("Summary generated successfully");
      return new Response(JSON.stringify({ summary }), {
        headers: { "Content-Type": "application/json" },
      });
    } catch (error: any) {
      console.error("Detailed Gemini API error:", {
        message: error.message,
        details: error.details,
        stack: error.stack,
      });
      throw error;
    }

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
