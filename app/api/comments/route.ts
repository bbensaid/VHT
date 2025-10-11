import { NextResponse } from "next/server";
import { CommentService } from "@/services/comment-service";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const documentName = searchParams.get("document");
    const page = searchParams.get("page");

    let comments;

    if (documentName && page) {
      const pageNum = Number.parseInt(page, 10);
      if (isNaN(pageNum)) {
        return NextResponse.json(
          { error: "Page parameter must be a valid number" },
          { status: 400 }
        );
      }
      comments = await CommentService.getComments(documentName, pageNum);
    } else if (documentName) {
      comments = await CommentService.getComments(documentName);
    } else {
      comments = await CommentService.getComments();
    }

    return NextResponse.json(comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch comments",
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

    // Validate required fields
    if (!data.content || typeof data.content !== "string") {
      return NextResponse.json(
        { error: "Comment content is required and must be a string" },
        { status: 400 }
      );
    }

    if (!data.documentName || typeof data.documentName !== "string") {
      return NextResponse.json(
        { error: "Document name is required and must be a string" },
        { status: 400 }
      );
    }

    // Validate page number if provided
    if (data.documentPage !== undefined) {
      const pageNum = Number(data.documentPage);
      if (isNaN(pageNum) || pageNum < 1) {
        return NextResponse.json(
          { error: "Document page must be a positive number" },
          { status: 400 }
        );
      }
    }

    const comment = await CommentService.addComment(
      data.content,
      data.documentName,
      data.documentPage || 1,
      data.author || "Anonymous"
    );

    return NextResponse.json(comment);
  } catch (error) {
    console.error("Error creating comment:", error);
    return NextResponse.json(
      {
        error: "Failed to create comment",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
