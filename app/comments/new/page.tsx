"use client";

import type React from "react";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PageLayout } from "@/components/page-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

export default function NewCommentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const documentParam = searchParams?.get("document");
  const pageParam = searchParams?.get("page");

  const [content, setContent] = useState("");
  const [documentName, setDocumentName] = useState(documentParam || "");
  const [documentPage, setDocumentPage] = useState(
    pageParam ? Number.parseInt(pageParam, 10) : 1
  );
  const [author, setAuthor] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [documents, setDocuments] = useState<string[]>([]);
  const [spellCheckErrors, setSpellCheckErrors] = useState<
    { word: string; suggestions: string[] }[]
  >([]);
  const contentRef = useRef<HTMLTextAreaElement>(null);

  const { toast } = useToast();

  // Fetch available documents
  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        // This would be a real API call in a production app
        // For now, we'll use mock data
        setDocuments([
          "Vermont Healthcare Reform Act 2023",
          "Green Mountain Care Board Report",
          "Medicaid Expansion Analysis",
          "Rural Healthcare Access Study",
          "Telehealth Implementation Guide",
        ]);
      } catch (error) {
        console.error("Error fetching documents:", error);
      }
    };

    fetchDocuments();
  }, []);

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
      const errors = performSpellCheck(content);
      setSpellCheckErrors(errors);
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [content]);

  // Replace misspelled word with suggestion
  const replaceWord = (word: string, replacement: string) => {
    if (contentRef.current) {
      const newContent = content.replace(
        new RegExp(`\\b${word}\\b`, "gi"),
        replacement
      );
      setContent(newContent);
    }

    // Remove the fixed error from the list
    setSpellCheckErrors((prev) => prev.filter((error) => error.word !== word));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content || !documentName || !author) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await fetch("/api/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content,
          documentName,
          documentPage,
          author,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create comment");
      }

      toast({
        title: "Success!",
        description: "Your comment has been added.",
      });

      router.push("/comments");
    } catch (error) {
      console.error("Error creating comment:", error);
      toast({
        title: "Error",
        description: "Failed to add comment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageLayout title="Add Comment">
      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Add New Comment</CardTitle>
            <CardDescription>
              Add a comment to a healthcare reform document
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="document">Document</Label>
                <Select value={documentName} onValueChange={setDocumentName}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a document" />
                  </SelectTrigger>
                  <SelectContent>
                    {documents.map((doc) => (
                      <SelectItem key={doc} value={doc}>
                        {doc}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="page">Page Number</Label>
                <Input
                  id="page"
                  type="number"
                  min="1"
                  value={documentPage}
                  onChange={(e) =>
                    setDocumentPage(Number.parseInt(e.target.value, 10) || 1)
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="author">Your Name</Label>
                <Input
                  id="author"
                  placeholder="Enter your name"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Comment</Label>
                <Textarea
                  id="content"
                  ref={contentRef}
                  placeholder="Write your comment here..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="min-h-[150px]"
                  required
                />
              </div>

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
                  <AlertDialogAction onClick={() => router.push("/comments")}>
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
                  Save Comment
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </PageLayout>
  );
}
