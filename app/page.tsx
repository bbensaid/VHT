"use client";

import { useState } from "react";
import { Sidebar } from "@/components/sidebar";
import { Navbar } from "@/components/navbar";
import { DocumentViewer } from "@/components/document-viewer";
import { KeywordHighlighter } from "@/components/keyword-highlighter";
import { NewsHeadlines } from "@/components/news-headlines";
import { NewsArticle } from "@/components/news-article";
import { ResizableGrid } from "@/components/resizable-grid";

export default function Home() {
  const [selectedArticle, setSelectedArticle] = useState<any>(null);

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-hidden p-4">
          <ResizableGrid>
            <DocumentViewer />
            <KeywordHighlighter />
            <NewsHeadlines onArticleSelected={setSelectedArticle} />
            <NewsArticle article={selectedArticle} />
          </ResizableGrid>
        </main>
      </div>
    </div>
  );
}
