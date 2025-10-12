"use client";

import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

type NewsArticleData = {
  id: number;
  title: string;
  date: string;
  source: string;
  summary: string;
};

// Sample news data - in a real app, this would come from an API
const SAMPLE_NEWS = [
  {
    id: 1,
    title: "Vermont Expands Healthcare Access in Rural Areas",
    date: "2023-05-15",
    source: "VT Health News",
    summary:
      "New initiative aims to bring healthcare services to underserved rural communities.",
  },
  {
    id: 2,
    title: "Green Mountain Care Board Approves New Payment Model",
    date: "2023-04-28",
    source: "Healthcare Reform Today",
    summary:
      "The board has approved a value-based payment model for primary care providers.",
  },
  {
    id: 3,
    title:
      "Study Shows Improved Outcomes from Vermont's Healthcare Initiatives",
    date: "2023-03-10",
    source: "Medical Research Journal",
    summary:
      "Recent study indicates positive results from Vermont's healthcare reform efforts.",
  },
  {
    id: 4,
    title: "Legislature Considers New Healthcare Bill",
    date: "2023-02-22",
    source: "VT Policy Watch",
    summary:
      "Lawmakers debate new legislation aimed at reducing prescription drug costs.",
  },
  {
    id: 5,
    title: "Community Health Centers Receive Additional Funding",
    date: "2023-01-15",
    source: "Public Health Update",
    summary:
      "Federal grants will support expansion of community health centers across Vermont.",
  },
];

export function NewsHeadlines({
  onArticleSelected,
}: {
  onArticleSelected: (article: NewsArticleData) => void;
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredNews, setFilteredNews] = useState(SAMPLE_NEWS);

  useEffect(() => {
    if (!searchTerm) {
      setFilteredNews(SAMPLE_NEWS);
      return;
    }

    const filtered = SAMPLE_NEWS.filter(
      (article) =>
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.summary.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setFilteredNews(filtered);
  }, [searchTerm]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-center p-2 border-b">
        <h3 className="font-medium absolute left-2">News Headlines</h3>
        <div className="relative w-48">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search news..."
            className="pl-8 h-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Search news"
          />
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <ul className="divide-y">
          {filteredNews.map((article) => (
            <li
              key={article.id}
              className="p-3 hover:bg-muted/50 cursor-pointer transition-colors duration-200"
              onClick={() => onArticleSelected(article)}
              tabIndex={0}
              role="button"
              aria-label={`Read article: ${article.title}`}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  onArticleSelected(article);
                }
              }}
            >
              <h4 className="font-medium text-sm">{article.title}</h4>
              <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                <span>{article.date}</span>
                <span>•</span>
                <span>{article.source}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
