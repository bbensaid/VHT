"use client";

import type React from "react";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
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
import { Save, AlertTriangle } from "lucide-react";

export default function NewBlogPostPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [slug, setSlug] = useState("");
  const [published, setPublished] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("write");
  const [spellCheckErrors, setSpellCheckErrors] = useState<
    { word: string; suggestions: string[] }[]
  >([]);
  const contentRef = useRef<HTMLTextAreaElement>(null);

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

      const response = await fetch("/api/blog", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          slug,
          content,
          excerpt: excerpt || content.substring(0, 150) + "...",
          published,
          author: "Current User", // In a real app, get this from auth context
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create blog post");
      }

      const data = await response.json();

      toast({
        title: "Success!",
        description: "Your blog post has been created.",
      });

      router.push(`/blog/${data.slug}`);
    } catch (error) {
      console.error("Error creating blog post:", error);
      toast({
        title: "Error",
        description: "Failed to create blog post. Please try again.",
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

  return (
    <PageLayout title="New Blog Post">
      <form onSubmit={handleSubmit} className="max-w-5xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Create New Blog Post</CardTitle>
            <CardDescription>
              Write a new blog post about Vermont healthcare reform
            </CardDescription>
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
                  placeholder="Brief summary of the post (optional)"
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  rows={3}
                />
              </div>

              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="write">Write</TabsTrigger>
                  <TabsTrigger value="preview">Preview</TabsTrigger>
                </TabsList>
                <TabsContent value="write" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="content">Content</Label>
                    <Textarea
                      id="content"
                      ref={contentRef}
                      placeholder="Write your blog post content here..."
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      className="min-h-[300px] font-mono"
                      required
                    />
                    <p className="text-sm text-muted-foreground">
                      Use Markdown for formatting: # Heading, ## Subheading,
                      **bold**, *italic*, - list item
                    </p>
                  </div>
                </TabsContent>
                <TabsContent value="preview">
                  <div className="border rounded-md p-4 min-h-[300px] prose dark:prose-invert max-w-none">
                    {content ? (
                      <div>
                        {content.split("\n\n").map((paragraph, index) => {
                          if (paragraph.startsWith("# ")) {
                            return (
                              <h1 key={index}>{paragraph.substring(2)}</h1>
                            );
                          } else if (paragraph.startsWith("## ")) {
                            return (
                              <h2 key={index}>{paragraph.substring(3)}</h2>
                            );
                          } else if (paragraph.startsWith("### ")) {
                            return (
                              <h3 key={index}>{paragraph.substring(4)}</h3>
                            );
                          } else if (paragraph.startsWith("- ")) {
                            const items = paragraph
                              .split("\n")
                              .map((item) => item.substring(2));
                            return (
                              <ul key={index}>
                                {items.map((item, i) => (
                                  <li key={i}>{item}</li>
                                ))}
                              </ul>
                            );
                          } else {
                            return <p key={index}>{paragraph}</p>;
                          }
                        })}
                      </div>
                    ) : (
                      <p className="text-muted-foreground italic">
                        Your preview will appear here...
                      </p>
                    )}
                  </div>
                </TabsContent>
              </Tabs>

              {spellCheckErrors.length > 0 && (
                <div className="bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-md p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                    <h3 className="font-medium">Possible spelling errors</h3>
                  </div>
                  <ul className="space-y-2">
                    {spellCheckErrors.map((error, index) => (
                      <li
                        key={index}
                        className="flex flex-wrap items-center gap-2"
                      >
                        <span className="text-red-600 dark:text-red-400 font-medium">
                          {error.word}
                        </span>
                        <span>→</span>
                        {error.suggestions.map((suggestion, i) => (
                          <Button
                            key={i}
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => replaceWord(error.word, suggestion)}
                          >
                            {suggestion}
                          </Button>
                        ))}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex items-center space-x-2">
                <Switch
                  id="published"
                  checked={published}
                  onCheckedChange={setPublished}
                />
                <Label htmlFor="published">Publish immediately</Label>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" type="button">
                  Cancel
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Discard changes?</AlertDialogTitle>
                  <AlertDialogDescription>
                    You have unsaved changes that will be lost if you leave this
                    page.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Continue Editing</AlertDialogCancel>
                  <AlertDialogAction onClick={() => router.push("/blog")}>
                    Discard Changes
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>Saving...</>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Post
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </PageLayout>
  );
}
