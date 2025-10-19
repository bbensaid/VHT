"use client";

import { useState } from "react";
import { PageLayout } from "@/components/page-layout";
import { DocumentViewer } from "@/components/document-viewer";
import { KeywordHighlighter } from "@/components/keyword-highlighter";
import { NewsHeadlines } from "@/components/news-headlines";
import { NewsArticle } from "@/components/news-article";
import { ResizableGrid } from "@/components/resizable-grid";

type NewsArticleData = {
  id: number;
  title: string;
  date: string;
  source: string;
  summary: string;
};

export default function Home() {
  const [selectedArticle, setSelectedArticle] =
    useState<NewsArticleData | null>(null);

  return (
    <PageLayout title="Documents">
      <div className="h-full overflow-hidden">
        <ResizableGrid>
          <DocumentViewer />
          <KeywordHighlighter />
          <NewsHeadlines onArticleSelected={setSelectedArticle} />
          <NewsArticle article={selectedArticle} />
        </ResizableGrid>
      </div>
    </PageLayout>
  );
}
