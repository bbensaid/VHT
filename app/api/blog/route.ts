import { NextResponse } from "next/server";
import { BlogService } from "@/services/blog-service";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");

    if (slug) {
      const post = await BlogService.getBlogPostBySlug(slug);

      if (!post) {
        return NextResponse.json(
          { error: "Blog post not found", slug },
          { status: 404 }
        );
      }

      return NextResponse.json(post);
    }

    // If no slug is provided, return all published posts
    const posts = await BlogService.getBlogPosts();
    const publishedPosts = posts.filter((post) => post.published);
    return NextResponse.json(publishedPosts);
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch blog posts",
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
    if (!data.title || typeof data.title !== "string") {
      return NextResponse.json(
        { error: "Blog post title is required and must be a string" },
        { status: 400 }
      );
    }

    if (!data.slug || typeof data.slug !== "string") {
      return NextResponse.json(
        { error: "Blog post slug is required and must be a string" },
        { status: 400 }
      );
    }

    if (!data.content || typeof data.content !== "string") {
      return NextResponse.json(
        { error: "Blog post content is required and must be a string" },
        { status: 400 }
      );
    }

    // Check if slug already exists
    const existingPost = await BlogService.getBlogPostBySlug(data.slug);
    if (existingPost) {
      return NextResponse.json(
        { error: "A blog post with this slug already exists" },
        { status: 409 }
      );
    }

    const post = await BlogService.addBlogPost(
      data.title,
      data.slug,
      data.content,
      data.excerpt || "",
      data.authorId,
      data.published !== undefined ? Boolean(data.published) : false
    );

    return NextResponse.json(post);
  } catch (error) {
    console.error("Error creating blog post:", error);
    return NextResponse.json(
      {
        error: "Failed to create blog post",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
