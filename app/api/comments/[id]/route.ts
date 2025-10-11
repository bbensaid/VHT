import { NextResponse } from "next/server";
import { CommentService } from "@/services/comment-service";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Validate ID parameter
    const id = params.id;
    if (!id) {
      return NextResponse.json(
        { error: "Comment ID is required" },
        { status: 400 }
      );
    }

    const comment = await CommentService.getCommentById(id);
    if (!comment) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 });
    }

    return NextResponse.json(comment);
  } catch (error) {
    console.error("Error fetching comment:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch comment",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Validate ID parameter
    const id = params.id;
    if (!id) {
      return NextResponse.json(
        { error: "Comment ID is required" },
        { status: 400 }
      );
    }

    // Check if comment exists before deleting
    const comment = await CommentService.getCommentById(id);
    if (!comment) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 });
    }

    await CommentService.removeComment(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting comment:", error);
    return NextResponse.json(
      {
        error: "Failed to delete comment",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
