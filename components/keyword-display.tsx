"use client";

import { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

type Keyword = {
  id: string;
  term: string;
  definition: string;
};

// Define consistent storage keys
const STORAGE_KEYS = {
  DOCUMENT_STATE: "vt-healthcare-document-state",
  DOCUMENT_TEXT: "vt-healthcare-document-text",
  DOCUMENT_NAME: "vt-healthcare-document-name",
};

export function KeywordDisplay() {
  const [documentText, setDocumentText] = useState<string>("");
  const [isDocumentActive, setIsDocumentActive] = useState<boolean>(false);
  const [keywords, setKeywords] = useState<Keyword[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load document state from localStorage
  const loadDocumentState = useCallback(() => {
    try {
      console.log("KeywordDisplay: Loading document state from localStorage");

      // First try the combined state object
      const stateStr = localStorage.getItem(STORAGE_KEYS.DOCUMENT_STATE);
      if (stateStr) {
        const state = JSON.parse(stateStr);
        console.log("KeywordDisplay: Found state:", state);
        setDocumentText(state.documentText || "");
        setIsDocumentActive(!!state.documentName);
        return;
      }

      // If not found, try the individual keys
      const docName = localStorage.getItem(STORAGE_KEYS.DOCUMENT_NAME);
      const docText = localStorage.getItem(STORAGE_KEYS.DOCUMENT_TEXT);

      if (docName) {
        console.log("KeywordDisplay: Found document using individual keys");
        setDocumentText(docText || "");
        setIsDocumentActive(true);
        return;
      }

      console.log("KeywordDisplay: No state found in localStorage");
      setDocumentText("");
      setIsDocumentActive(false);
    } catch (error) {
      console.error("KeywordDisplay: Error loading document state:", error);
    }
  }, []);

  // Initial load and set up storage event listener
  useEffect(() => {
    loadDocumentState();

    // Set up event listener for storage changes
    const handleStorageChange = () => {
      console.log("KeywordDisplay: Storage event detected");
      loadDocumentState();
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [loadDocumentState]);

  useEffect(() => {
    async function fetchKeywords() {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch("/api/keywords");
        if (!response.ok) {
          throw new Error("Failed to fetch keywords");
        }
        const data = await response.json();
        setKeywords(data);
      } catch (err) {
        console.error("Error fetching keywords:", err);
        setError("Failed to load keywords. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    fetchKeywords();
  }, []);

  // Find keywords that appear in the text
  const findMatchingKeywords = (text: string) => {
    if (!text) return [];

    return keywords.filter((keyword) => {
      const regex = new RegExp(`\\b${keyword.term}\\b`, "i");
      return regex.test(text);
    });
  };

  // Find keywords in the document text
  const matchingKeywords = isDocumentActive
    ? findMatchingKeywords(documentText)
    : [];

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="text-md font-medium">Keywords</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-auto p-4">
        {loading ? (
          <div className="flex h-full items-center justify-center">
            <div className="animate-pulse">Loading keywords...</div>
          </div>
        ) : error ? (
          <div className="flex h-full items-center justify-center text-red-500">
            <AlertCircle className="mr-2 h-4 w-4" />
            {error}
          </div>
        ) : !isDocumentActive ? (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            <p>No document loaded. Please load a document to see keywords.</p>
          </div>
        ) : matchingKeywords.length === 0 ? (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            <p>No keywords found in the current document.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {matchingKeywords.map((keyword) => (
              <div key={keyword.id} className="border rounded-lg p-3">
                <h3 className="font-medium">{keyword.term}</h3>
                <p className="text-sm text-muted-foreground">
                  {keyword.definition}
                </p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
