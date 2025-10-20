"use client";

import { useState, useEffect } from "react";
import { PageLayout } from "@/components/page-layout";
import { DocumentViewer } from "@/components/document-viewer";
import { KeywordHighlighter } from "@/components/keyword-highlighter";
import { NewsHeadlines } from "@/components/news-headlines";
import { DocumentSummary } from "@/components/document-summary";
import { ResizableGrid } from "@/components/resizable-grid";
import { getDocumentText } from "@/lib/storage/document-state";

type NewsArticleData = {
  id: number;
  title: string;
  date: string;
  source: string;
  summary: string;
};

export default function Home() {
  const [selectedArticle, setSelectedArticle] = useState<NewsArticleData | null>(null);
  const [documentText, setDocumentText] = useState<string>("");

  useEffect(() => {
    const savedText = getDocumentText();
    if (savedText) {
      setDocumentText(savedText);
    }
  }, []);

  return (
    <PageLayout title="Documents">
      <div className="h-full overflow-hidden">
        <ResizableGrid>
          <DocumentViewer />
          <KeywordHighlighter />
          <NewsHeadlines onArticleSelected={setSelectedArticle} />
          <DocumentSummary documentText={documentText} selectedArticle={selectedArticle} />
        </ResizableGrid>
      </div>
    </PageLayout>
  );
}
