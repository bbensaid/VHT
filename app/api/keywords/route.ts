import { NextResponse } from "next/server";
import { KeywordService } from "@/services/keyword-service";

export async function GET() {
  try {
    const keywords = await KeywordService.getKeywords();
    return NextResponse.json(keywords);
  } catch (error) {
    console.error("Error fetching keywords:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch keywords",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    // Validate request content type
    const contentType = request.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      return NextResponse.json(
        { error: "Content-Type must be application/json" },
        { status: 400 }
      );
    }

    const data = await request.json();

    if (Array.isArray(data)) {
      // Bulk create/update
      // Validate array items
      for (const item of data) {
        if (
          !item.term ||
          typeof item.term !== "string" ||
          !item.definition ||
          typeof item.definition !== "string"
        ) {
          return NextResponse.json(
            {
              error: "Each keyword must have a term and definition as strings",
            },
            { status: 400 }
          );
        }
      }

      // Import keywords
      const keywords = await KeywordService.importKeywords(data);
      return NextResponse.json(keywords);
    } else {
      // Single create/update
      // Validate single item
      if (
        !data.term ||
        typeof data.term !== "string" ||
        !data.definition ||
        typeof data.definition !== "string"
      ) {
        return NextResponse.json(
          { error: "Keyword must have a term and definition as strings" },
          { status: 400 }
        );
      }

      const keyword = await KeywordService.addKeyword(
        data.term,
        data.definition
      );
      return NextResponse.json(keyword);
    }
  } catch (error) {
    console.error("Error creating/updating keywords:", error);
    return NextResponse.json(
      {
        error: "Failed to create/update keywords",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
