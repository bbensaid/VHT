"use client";

import type React from "react";

import { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { PageLayout } from "@/components/page-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { useToast } from "@/components/ui/use-toast";
import { Save, AlertTriangle, ArrowLeft } from "lucide-react";

export default function EditBlogPostPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [slug, setSlug] = useState("");
  const [published, setPublished] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("write");
  const [spellCheckErrors, setSpellCheckErrors] = useState<
    { word: string; suggestions: string[] }[]
  >([]);
  const contentRef = useRef<HTMLTextAreaElement>(null);

  const postId = params.id as string;

  // Load existing blog post data
  useEffect(() => {
    const loadBlogPost = async () => {
      try {
        const response = await fetch(`/api/blog/${postId}`);
        if (!response.ok) {
          throw new Error("Failed to load blog post");
        }
        const post = await response.json();

        setTitle(post.title || "");
        setContent(post.content || "");
        setExcerpt(post.excerpt || "");
        setSlug(post.slug || "");
        setPublished(post.published || false);
      } catch (error) {
        console.error("Error loading blog post:", error);
        toast({
          title: "Error",
          description: "Failed to load blog post for editing.",
          variant: "destructive",
        });
        router.push("/blog");
      } finally {
        setIsLoading(false);
      }
    };

    if (postId) {
      loadBlogPost();
    }
  }, [postId, router, toast]);

  // Generate slug from title
  useEffect(() => {
    if (title) {
      const generatedSlug = title
        .toLowerCase()
        .replace(/[^\w\s]/g, "")
        .replace(/\s+/g, "-");
      setSlug(generatedSlug);
    }
  }, [title]);

  // Simple spell check function
  // In a real app, you'd use a proper spell check API or library
  const performSpellCheck = (text: string) => {
    // This is a very simplified mock spell checker
    // In a real app, you'd use a proper spell check API
    const commonMisspellings: Record<string, string[]> = {
      teh: ["the"],
      recieve: ["receive"],
      definately: ["definitely"],
      seperate: ["separate"],
      occured: ["occurred"],
      accomodate: ["accommodate"],
      beleive: ["believe"],
      concious: ["conscious"],
      foriegn: ["foreign"],
      wierd: ["weird"],
      heathcare: ["healthcare"],
      medicad: ["medicaid"],
      refrom: ["reform"],
    };

    const words = text.split(/\s+/);
    const errors: { word: string; suggestions: string[] }[] = [];

    words.forEach((word) => {
      // Remove punctuation for checking
      const cleanWord = word.toLowerCase().replace(/[^\w]/g, "");

      if (commonMisspellings[cleanWord]) {
        errors.push({
          word: cleanWord,
          suggestions: commonMisspellings[cleanWord],
        });
      }
    });

    return errors;
  };

  // Check spelling when content changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const errors = performSpellCheck(content + " " + title + " " + excerpt);
      setSpellCheckErrors(errors);
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [content, title, excerpt]);

  // Replace misspelled word with suggestion
  const replaceWord = (word: string, replacement: string) => {
    if (contentRef.current) {
      const newContent = content.replace(
        new RegExp(`\\b${word}\\b`, "gi"),
        replacement
      );
      setContent(newContent);
    }

    // Also check and replace in title and excerpt
    const newTitle = title.replace(
      new RegExp(`\\b${word}\\b`, "gi"),
      replacement
    );
    const newExcerpt = excerpt.replace(
      new RegExp(`\\b${word}\\b`, "gi"),
      replacement
    );

    setTitle(newTitle);
    setExcerpt(newExcerpt);

    // Remove the fixed error from the list
    setSpellCheckErrors((prev) => prev.filter((error) => error.word !== word));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !content) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await fetch(`/api/blog/${postId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          slug,
          content,
          excerpt: excerpt || content.substring(0, 150) + "...",
          published,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update blog post");
      }

      const data = await response.json();

      toast({
        title: "Success!",
        description: "Your blog post has been updated.",
      });

      router.push(`/blog/${data.slug}`);
    } catch (error) {
      console.error("Error updating blog post:", error);
      toast({
        title: "Error",
        description: "Failed to update blog post. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Confirm before leaving with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (title || content || excerpt) {
        e.preventDefault();
        e.returnValue = "";
        return "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [title, content, excerpt]);

  if (isLoading) {
    return (
      <PageLayout title="Edit Blog Post" showBackButton={false}>
        <div className="max-w-5xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Loading...</CardTitle>
            </CardHeader>
          </Card>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout title="Edit Blog Post" showBackButton={false}>
      <form onSubmit={handleSubmit} className="max-w-5xl mx-auto">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Edit Blog Post</CardTitle>
                <CardDescription>
                  Update your blog post about Vermont healthcare reform
                </CardDescription>
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/blog")}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Blog
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="Enter post title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">Slug</Label>
                <div className="flex gap-2">
                  <Input
                    id="slug"
                    placeholder="url-friendly-slug"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    required
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      if (title) {
                        const generatedSlug = title
                          .toLowerCase()
                          .replace(/[^\w\s]/g, "")
                          .replace(/\s+/g, "-");
                        setSlug(generatedSlug);
                      }
                    }}
                  >
                    Generate
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="excerpt">Excerpt</Label>
                <Textarea
                  id="excerpt"
                  placeholder="Brief summary of the post"
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="published"
                  checked={published}
                  onCheckedChange={setPublished}
                />
                <Label htmlFor="published">Published</Label>
              </div>

              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList>
                  <TabsTrigger value="write">Write</TabsTrigger>
                  <TabsTrigger value="preview">Preview</TabsTrigger>
                </TabsList>

                <TabsContent value="write" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="content">Content</Label>
                    <Textarea
                      ref={contentRef}
                      id="content"
                      placeholder="Write your blog post content here..."
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      rows={20}
                      required
                    />
                  </div>

                  {spellCheckErrors.length > 0 && (
                    <Card className="border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4 text-yellow-600" />
                          Spelling Suggestions
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {spellCheckErrors.map((error, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-2"
                            >
                              <span className="font-medium">{error.word}</span>
                              <span className="text-sm text-muted-foreground">
                                →
                              </span>
                              {error.suggestions.map((suggestion, i) => (
                                <Button
                                  key={i}
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    replaceWord(error.word, suggestion)
                                  }
                                >
                                  {suggestion}
                                </Button>
                              ))}
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                <TabsContent value="preview" className="space-y-4">
                  <div className="space-y-2">
                    <Label>Preview</Label>
                    <Card>
                      <CardContent className="pt-6">
                        <div className="prose prose-lg dark:prose-invert max-w-none">
                          {content.split("\n\n").map((paragraph, index) => {
                            if (paragraph.startsWith("# ")) {
                              return (
                                <h1
                                  key={index}
                                  className="text-3xl font-bold mt-8 mb-4"
                                >
                                  {paragraph.substring(2)}
                                </h1>
                              );
                            } else if (paragraph.startsWith("## ")) {
                              return (
                                <h2
                                  key={index}
                                  className="text-2xl font-bold mt-6 mb-3"
                                >
                                  {paragraph.substring(3)}
                                </h2>
                              );
                            } else if (paragraph.startsWith("### ")) {
                              return (
                                <h3
                                  key={index}
                                  className="text-xl font-bold mt-5 mb-2"
                                >
                                  {paragraph.substring(4)}
                                </h3>
                              );
                            } else if (paragraph.startsWith("- ")) {
                              const items = paragraph
                                .split("\n")
                                .map((item) => item.substring(2));
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
                          })}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/blog")}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              <Save className="mr-2 h-4 w-4" />
              {isSubmitting ? "Updating..." : "Update Post"}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </PageLayout>
  );
}
