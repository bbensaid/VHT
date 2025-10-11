"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { PageLayout } from "@/components/page-layout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, User, Edit, ArrowLeft, Share2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";

type BlogPost = {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  author: string;
  createdAt: string;
  updatedAt: string;
  published: boolean;
};

export default function BlogPostPage() {
  const params = useParams();
  const router = useRouter();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const slug = params?.slug as string;

  // Fetch blog post
  useEffect(() => {
    const fetchPost = async () => {
      if (!slug) return;

      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(
          `/api/blog?slug=${encodeURIComponent(slug)}`
        );

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Blog post not found");
          }
          throw new Error("Failed to fetch blog post");
        }

        const data = await response.json();
        setPost(data);
      } catch (error) {
        console.error("Error fetching blog post:", error);
        setError(error instanceof Error ? error.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Share post
  const sharePost = async () => {
    if (!post) return;

    const url = window.location.href;
    const title = post.title;

    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: post.excerpt,
          url,
        });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      // Fallback to copying to clipboard
      navigator.clipboard.writeText(url);
      toast({
        title: "Link copied to clipboard",
        description: "You can now share this blog post with others.",
      });
    }
  };

  // Delete post
  const deletePost = async () => {
    if (!post) return;

    try {
      const response = await fetch(`/api/blog/${post.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete blog post");
      }

      toast({
        title: "Blog post deleted",
        description: "The blog post has been successfully deleted.",
      });

      router.push("/blog");
    } catch (error) {
      console.error("Error deleting blog post:", error);
      toast({
        title: "Error",
        description: "Failed to delete blog post. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Render content with proper formatting
  const renderContent = (content: string) => {
    // Simple markdown-like rendering
    // In a real app, you'd use a proper markdown renderer
    return content.split("\n\n").map((paragraph, index) => {
      if (paragraph.startsWith("# ")) {
        return (
          <h1 key={index} className="text-3xl font-bold mt-8 mb-4">
            {paragraph.substring(2)}
          </h1>
        );
      } else if (paragraph.startsWith("## ")) {
        return (
          <h2 key={index} className="text-2xl font-bold mt-6 mb-3">
            {paragraph.substring(3)}
          </h2>
        );
      } else if (paragraph.startsWith("### ")) {
        return (
          <h3 key={index} className="text-xl font-bold mt-5 mb-2">
            {paragraph.substring(4)}
          </h3>
        );
      } else if (paragraph.startsWith("- ")) {
        const items = paragraph.split("\n").map((item) => item.substring(2));
        return (
          <ul key={index} className="list-disc pl-6 my-4">
            {items.map((item, i) => (
              <li key={i} className="mb-1">
                {item}
              </li>
            ))}
          </ul>
        );
      } else {
        return (
          <p key={index} className="my-4">
            {paragraph}
          </p>
        );
      }
    });
  };

  return (
    <PageLayout title="Blog Post">
      {isLoading ? (
        <div className="max-w-4xl mx-auto">
          <Skeleton className="h-12 w-3/4 mb-4" />
          <Skeleton className="h-6 w-1/2 mb-8" />
          <Skeleton className="h-64 w-full mb-6" />
          <Skeleton className="h-6 w-full mb-4" />
          <Skeleton className="h-6 w-full mb-4" />
          <Skeleton className="h-6 w-3/4" />
        </div>
      ) : error ? (
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Error</CardTitle>
            <CardDescription>We couldn't load this blog post</CardDescription>
          </CardHeader>
          <CardContent>
            <p>{error}</p>
          </CardContent>
          <CardFooter>
            <Button onClick={() => router.push("/blog")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blog
            </Button>
          </CardFooter>
        </Card>
      ) : post ? (
        <article className="max-w-4xl mx-auto">
          <div className="mb-8 space-y-4">
            <h1 className="text-4xl font-bold">{post.title}</h1>

            <div className="flex flex-wrap gap-4 text-muted-foreground">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                {post.author}
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {formatDate(post.createdAt)}
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => router.push("/blog")}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Blog
              </Button>

              <Button variant="outline" onClick={sharePost}>
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <Edit className="mr-2 h-4 w-4" />
                    Actions
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => router.push(`/blog/edit/${post.id}`)}
                  >
                    Edit Post
                  </DropdownMenuItem>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <DropdownMenuItem
                        onSelect={(e) => e.preventDefault()}
                        className="text-destructive"
                      >
                        Delete Post
                      </DropdownMenuItem>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Are you absolutely sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently
                          delete the blog post.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={deletePost}
                          className="bg-destructive text-destructive-foreground"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <Separator className="my-6" />

          <div className="prose prose-lg dark:prose-invert max-w-none">
            {renderContent(post.content)}
          </div>
        </article>
      ) : null}
    </PageLayout>
  );
}
