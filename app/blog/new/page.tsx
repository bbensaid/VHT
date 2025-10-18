"use client";

import type React from "react";

import { useState, useEffect, useRef, useCallback } from "react";
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
import { Save, AlertTriangle, Upload, FileText, X } from "lucide-react";
import { useDropzone } from "react-dropzone";

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

  // File upload state
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isProcessingFile, setIsProcessingFile] = useState(false);
  const [fileContent, setFileContent] = useState<string>("");

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

  // File processing functions
  const processPDFFile = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();
    // Import pdfjs dynamically to avoid SSR issues
    const pdfjsLib = await import('pdfjs-dist');

    // Set worker source
    pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let fullText = '';

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item) => ('str' in item ? item.str : ''))
        .join(' ');
      fullText += pageText + '\n\n';
    }

    return fullText.trim();
  };

  const processDOCXFile = async (file: File): Promise<string> => {
    const mammoth = await import('mammoth');
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value;
  };

  const processMDXFile = async (file: File): Promise<string> => {
    return await file.text();
  };

  const processUploadedFile = useCallback(async (file: File) => {
    setIsProcessingFile(true);
    try {
      let extractedContent = '';

      if (file.type === 'application/pdf') {
        extractedContent = await processPDFFile(file);
      } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        extractedContent = await processDOCXFile(file);
      } else if (file.name.endsWith('.mdx') || file.name.endsWith('.md')) {
        extractedContent = await processMDXFile(file);
      } else {
        throw new Error('Unsupported file type. Please upload PDF, DOCX, or MDX files.');
      }

      setFileContent(extractedContent);
      setContent(extractedContent);

      // Try to extract title from first line if it's a heading
      if (!title && extractedContent.trim().startsWith('# ')) {
        const firstLine = extractedContent.trim().split('\n')[0];
        const extractedTitle = firstLine.substring(2).trim();
        setTitle(extractedTitle);
      }

      // Generate excerpt from content if not provided
      if (!excerpt && extractedContent.length > 100) {
        setExcerpt(extractedContent.substring(0, 150) + '...');
      }

      toast({
        title: "File processed successfully",
        description: `Content extracted from ${file.name}`,
      });
    } catch (error) {
      console.error('Error processing file:', error);
      toast({
        title: "File processing failed",
        description: error instanceof Error ? error.message : "Failed to process the uploaded file",
        variant: "destructive",
      });
    } finally {
      setIsProcessingFile(false);
    }
  }, [title, excerpt, toast]);

  // Dropzone configuration
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setUploadedFile(file);
      processUploadedFile(file);
    }
  }, [processUploadedFile]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/markdown': ['.md', '.mdx'],
    },
    multiple: false,
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  const removeFile = () => {
    setUploadedFile(null);
    setFileContent('');
    if (!content || content === fileContent) {
      setContent('');
    }
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
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="write">Write</TabsTrigger>
                  <TabsTrigger value="upload">Upload File</TabsTrigger>
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
                <TabsContent value="upload" className="space-y-4">
                  <div className="space-y-4">
                    <Label>File Upload</Label>
                    <div
                      {...getRootProps()}
                      className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                        isDragActive
                          ? 'border-primary bg-primary/5'
                          : 'border-muted-foreground/25 hover:border-muted-foreground/50'
                      }`}
                    >
                      <input {...getInputProps()} />
                      <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                      {isProcessingFile ? (
                        <div>
                          <p className="text-sm font-medium">Processing file...</p>
                          <p className="text-xs text-muted-foreground">Please wait while we extract the content</p>
                        </div>
                      ) : uploadedFile ? (
                        <div>
                          <FileText className="mx-auto h-8 w-8 text-green-600 mb-2" />
                          <p className="text-sm font-medium">{uploadedFile.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB • Content extracted
                          </p>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeFile();
                            }}
                            className="mt-2"
                          >
                            <X className="h-4 w-4 mr-1" />
                            Remove
                          </Button>
                        </div>
                      ) : (
                        <div>
                          <p className="text-sm font-medium">
                            {isDragActive ? 'Drop your file here' : 'Drag & drop a file here, or click to select'}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Supports PDF, DOCX, and MDX files (max 10MB)
                          </p>
                        </div>
                      )}
                    </div>
                    {uploadedFile && (
                      <div className="space-y-2">
                        <Label htmlFor="extracted-content">Extracted Content (Editable)</Label>
                        <Textarea
                          id="extracted-content"
                          value={content}
                          onChange={(e) => setContent(e.target.value)}
                          className="min-h-[300px] font-mono"
                          placeholder="Content will appear here after file processing..."
                        />
                        <p className="text-xs text-muted-foreground">
                          You can edit the extracted content before saving
                        </p>
                      </div>
                    )}
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
