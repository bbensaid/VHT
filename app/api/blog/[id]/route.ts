import { NextResponse } from "next/server";
import { BlogService } from "@/services/blog-service";
import prisma from "@/lib/database/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json(
        { error: "Blog post ID is required" },
        { status: 400 }
      );
    }

    const post = await BlogService.getBlogPostById(id);

    if (!post) {
      return NextResponse.json(
        { error: "Blog post not found", id },
        { status: 404 }
      );
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error("Error fetching blog post:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch blog post",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json(
        { error: "Blog post ID is required" },
        { status: 400 }
      );
    }

    // Validate request content type
    const contentType = request.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      return NextResponse.json(
        { error: "Content-Type must be application/json" },
        { status: 400 }
      );
    }

    const data = await request.json();

    // Check if post exists
    const existingPost = await BlogService.getBlogPostById(id);
    if (!existingPost) {
      return NextResponse.json(
        { error: "Blog post not found", id },
        { status: 404 }
      );
    }

    // If slug is being updated, check if it conflicts with another post
    if (data.slug && data.slug !== existingPost.slug) {
      const slugExists = await prisma.blogPost.findFirst({
        where: {
          slug: data.slug.toLowerCase().trim(),
          id: { not: id },
        },
      });

      if (slugExists) {
        return NextResponse.json(
          { error: "A blog post with this slug already exists" },
          { status: 409 }
        );
      }
    }

    const updatedPost = await BlogService.updateBlogPost(id, data);
    return NextResponse.json(updatedPost);
  } catch (error) {
    console.error("Error updating blog post:", error);
    return NextResponse.json(
      {
        error: "Failed to update blog post",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json(
        { error: "Blog post ID is required" },
        { status: 400 }
      );
    }

    // Check if post exists
    const existingPost = await BlogService.getBlogPostById(id);
    if (!existingPost) {
      return NextResponse.json(
        { error: "Blog post not found", id },
        { status: 404 }
      );
    }

    await BlogService.removeBlogPost(id);
    return NextResponse.json({ success: true, id });
  } catch (error) {
    console.error("Error deleting blog post:", error);
    return NextResponse.json(
      {
        error: "Failed to delete blog post",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
