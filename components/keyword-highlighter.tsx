"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { getDocumentText } from "@/utils/document-state";

type KeywordDictionary = {
  [keyword: string]: string;
};

// Fallback data
const fallbackKeywords = {
  "green mountain care board":
    "An independent group created by the Vermont Legislature in 2011 to oversee the development of health care policy in Vermont.",
  medicaid:
    "A joint federal and state program that helps with medical costs for some people with limited income and resources.",
  healthcare:
    "The organized provision of medical care to individuals or a community.",
  reform: "To make changes in something in order to improve it.",
  "payment models":
    "Methods of paying healthcare providers for services rendered.",
  "all-payer model":
    "A healthcare payment model that involves all payers (Medicare, Medicaid, commercial) using the same approach to pay providers.",
  "blueprint for health":
    "Vermont's state-led initiative that works to integrate care across the healthcare spectrum.",
  "rural healthcare":
    "Healthcare services provided in rural areas, often facing unique challenges of access and resources.",
  telehealth:
    "The delivery of health care, health education, and health information services via remote technologies.",
};

export function KeywordHighlighter() {
  const [documentText, setDocumentText] = useState<string>("");
  const [isDocumentActive, setIsDocumentActive] = useState<boolean>(false);
  const [highlightedKeywords, setHighlightedKeywords] = useState<
    React.ReactNode[]
  >([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [keywords, setKeywords] = useState<KeywordDictionary>(fallbackKeywords);
  const [isLoading, setIsLoading] = useState(true);
  const [debugInfo, setDebugInfo] = useState<any>({});

  // Load document state from sessionStorage
  useEffect(() => {
    if (typeof window === "undefined") return;

    const loadDocumentState = () => {
      try {
        console.log("KeywordHighlighter: Loading document state");

        // Get document text using the utility function
        const text = getDocumentText();

        if (text) {
          setDocumentText(text);
          setIsDocumentActive(true);
          console.log(
            `KeywordHighlighter: Document text loaded (${text.length} chars)`
          );
        } else {
          setDocumentText("");
          setIsDocumentActive(false);
          console.log("KeywordHighlighter: No document text found");
        }
      } catch (error) {
        console.error(
          "KeywordHighlighter: Error loading document state:",
          error
        );
      }
    };

    loadDocumentState();

    // Set up event listener for storage changes
    const handleStorageChange = () => {
      console.log("KeywordHighlighter: Storage event detected");
      loadDocumentState();
    };

    window.addEventListener("storage", handleStorageChange);

    // Also listen for custom events
    const handleCustomEvent = () => {
      console.log("KeywordHighlighter: Custom storage event detected");
      loadDocumentState();
    };

    window.addEventListener("sessionStorageChange", handleCustomEvent);

    // Check for document state periodically (as a fallback)
    const intervalId = setInterval(loadDocumentState, 2000);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("sessionStorageChange", handleCustomEvent);
      clearInterval(intervalId);
    };
  }, []);

  // Load keywords on component mount
  useEffect(() => {
    const fetchKeywords = async () => {
      try {
        setIsLoading(true);

        // Already using fallback data from initialization

        // Try to fetch from API
        try {
          const response = await fetch("/api/keywords");

          if (response.ok) {
            const data = await response.json();

            const keywordDict: KeywordDictionary = {};
            data.forEach((item: any) => {
              keywordDict[item.term.toLowerCase()] = item.definition;
            });

            // Only update if we got data
            if (Object.keys(keywordDict).length > 0) {
              setKeywords(keywordDict);
              console.log(
                "Loaded keywords from API:",
                Object.keys(keywordDict).length
              );
            }
          }
        } catch (apiError) {
          console.error("API error (using fallback):", apiError);
          // Already using fallback data, so no need to do anything
        }
      } catch (error) {
        console.error("Error in keyword initialization:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchKeywords();
  }, []);

  // Process text when it changes or when keywords/search term changes
  useEffect(() => {
    if (!documentText || isLoading) {
      setHighlightedKeywords([]);
      return;
    }

    console.log("Processing document text for keywords:", {
      textLength: documentText.length,
      keywordsCount: Object.keys(keywords).length,
      searchTerm,
    });

    // Create a list of all keywords
    const keywordList = Object.keys(keywords);

    // Filter keywords based on search term
    const filteredKeywords = searchTerm
      ? keywordList.filter((k) =>
          k.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : keywordList;

    if (filteredKeywords.length === 0) {
      setHighlightedKeywords([]);
      return;
    }

    // Find all keyword matches in the text
    const matches = new Set<string>();
    const textLower = documentText.toLowerCase();

    filteredKeywords.forEach((keyword) => {
      const keywordLower = keyword.toLowerCase();

      // Try different matching approaches to ensure we catch variations
      // 1. Simple includes check
      if (textLower.includes(keywordLower)) {
        matches.add(keyword);
      } else {
        // 2. Word boundary regex for more accurate matching
        const regex = new RegExp(
          `\\b${keywordLower.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&")}\\b`,
          "i"
        );
        if (regex.test(textLower)) {
          matches.add(keyword);
        }
      }
    });

    console.log("Matched keywords:", Array.from(matches));

    // Create formatted elements for each matched keyword
    const elements = Array.from(matches).map((keyword, index) => {
      const definition = keywords[keyword.toLowerCase()];
      return (
        <Card key={index} className="mb-4">
          <CardContent className="p-4">
            <h3 className="font-bold text-primary text-lg mb-2">{keyword}</h3>
            <p className="text-sm text-muted-foreground">{definition}</p>
          </CardContent>
        </Card>
      );
    });

    setHighlightedKeywords(elements);
  }, [documentText, searchTerm, keywords, isLoading]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-center p-2 border-b">
        <h3 className="font-medium absolute left-2">Keyword Highlights</h3>
        <div className="relative w-48">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Filter keywords..."
            className="pl-8 h-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Filter keywords"
          />
        </div>
      </div>

      <div className="flex-1 p-4 overflow-auto">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : isDocumentActive && documentText ? (
          highlightedKeywords.length > 0 ? (
            <div className="space-y-2">{highlightedKeywords}</div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              <p className="mb-2">No matching keywords found in the document</p>
              <p className="text-xs text-muted-foreground">
                Document length: {documentText.length} characters
              </p>
              {debugInfo.finalTextLength > 0 && (
                <p className="text-xs text-muted-foreground mt-1">
                  Storage text length: {debugInfo.finalTextLength}
                </p>
              )}
            </div>
          )
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <p>No document text to analyze</p>
          </div>
        )}
      </div>
    </div>
  );
}
