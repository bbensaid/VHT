"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NewsArticle } from "@/components/news-article";

interface DocumentSummaryProps {
  documentText: string;
  selectedArticle: any;
}

export function DocumentSummary({ documentText, selectedArticle }: DocumentSummaryProps) {
  const [activeTab, setActiveTab] = useState("article");
  const [summary, setSummary] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerateSummary = async () => {
    if (!documentText) {
      console.error("No document text available");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/summarize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: documentText }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate summary");
      }

      const data = await response.json();
      setSummary(data.summary);
    } catch (error) {
      console.error("Error generating summary:", error);
      setSummary("Failed to generate summary. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <Tabs
        defaultValue="article"
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full h-full flex flex-col"
      >
        <TabsList className="mb-4">
          <TabsTrigger value="article">Article Details</TabsTrigger>
          <TabsTrigger value="summary">Document Summary</TabsTrigger>
        </TabsList>

        <TabsContent
          value="article"
          className="flex-1 overflow-auto"
        >
          <NewsArticle article={selectedArticle} />
        </TabsContent>

        <TabsContent
          value="summary"
          className="flex-1 overflow-auto relative"
        >
          <div className="absolute inset-0 flex flex-col p-4">
            {!summary && !isLoading && (
              <div className="flex flex-col items-center justify-center flex-1 gap-4">
                <p className="text-muted-foreground">
                  Generate a summary of the current document
                </p>
                <Button onClick={handleGenerateSummary}>
                  Generate Summary
                </Button>
              </div>
            )}

            {isLoading && (
              <div className="flex items-center justify-center flex-1">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            )}

            {summary && !isLoading && (
              <div className="space-y-4">
                <div className="flex justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleGenerateSummary}
                  >
                    Regenerate
                  </Button>
                </div>
                <div className="prose prose-sm dark:prose-invert">
                  {summary.split("\n").map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}