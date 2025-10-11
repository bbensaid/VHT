import { NextResponse } from "next/server";
import { KeywordService } from "@/services/keyword-service";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Validate ID parameter
    const id = params.id;
    if (!id) {
      return NextResponse.json(
        { error: "Keyword ID is required" },
        { status: 400 }
      );
    }

    console.log("Deleting keyword with ID:", id);

    // Check if keyword exists before deleting
    const keyword = await KeywordService.getKeywordById(id);
    if (!keyword) {
      console.log("Keyword not found:", id);
      return NextResponse.json({ error: "Keyword not found" }, { status: 404 });
    }

    await KeywordService.removeKeyword(id);
    console.log("Keyword deleted successfully:", id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting keyword:", error);
    return NextResponse.json(
      {
        error: "Failed to delete keyword",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
