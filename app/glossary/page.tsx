"use client";

import { useState, useEffect, useRef } from "react";
import { PageLayout } from "@/components/page-layout";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Search } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

type Keyword = {
  id: string;
  term: string;
  definition: string;
};

// Fallback data in case the API fails
const fallbackKeywords = [
  {
    id: "1",
    term: "green mountain care board",
    definition:
      "An independent group created by the Vermont Legislature in 2011 to oversee the development of health care policy in Vermont.",
  },
  {
    id: "2",
    term: "medicaid",
    definition:
      "A joint federal and state program that helps with medical costs for some people with limited income and resources.",
  },
  {
    id: "3",
    term: "healthcare",
    definition:
      "The organized provision of medical care to individuals or a community.",
  },
  {
    id: "4",
    term: "reform",
    definition: "To make changes in something in order to improve it.",
  },
  {
    id: "5",
    term: "payment models",
    definition: "Methods of paying healthcare providers for services rendered.",
  },
  {
    id: "6",
    term: "all-payer model",
    definition:
      "A healthcare payment model that involves all payers (Medicare, Medicaid, commercial) using the same approach to pay providers.",
  },
  {
    id: "7",
    term: "blueprint for health",
    definition:
      "Vermont's state-led initiative that works to integrate care across the healthcare spectrum.",
  },
  {
    id: "8",
    term: "rural healthcare",
    definition:
      "Healthcare services provided in rural areas, often facing unique challenges of access and resources.",
  },
  {
    id: "9",
    term: "telehealth",
    definition:
      "The delivery of health care, health education, and health information services via remote technologies.",
  },
  {
    id: "10",
    term: "accountable care organization",
    definition:
      "A group of healthcare providers who come together voluntarily to coordinate care for patients.",
  },
  {
    id: "11",
    term: "value-based care",
    definition:
      "A healthcare delivery model where providers are paid based on patient health outcomes.",
  },
  {
    id: "12",
    term: "fee-for-service",
    definition:
      "A payment model where providers are paid for each service performed.",
  },
  {
    id: "13",
    term: "population health",
    definition:
      "The health outcomes of a group of individuals, including the distribution of such outcomes within the group.",
  },
  {
    id: "14",
    term: "electronic health record",
    definition:
      "Digital version of a patient's paper chart, containing medical history, diagnoses, medications, treatment plans, etc.",
  },
];

export default function GlossaryPage() {
  const [keywords, setKeywords] = useState<Keyword[]>([]);
  const [filteredKeywords, setFilteredKeywords] = useState<Keyword[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const sectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // Generate alphabet array
  const alphabet = Array.from({ length: 26 }, (_, i) =>
    String.fromCharCode(65 + i)
  );

  // Fetch keywords
  useEffect(() => {
    const fetchKeywords = async () => {
      try {
        setIsLoading(true);

        // Start with fallback data
        setKeywords(fallbackKeywords);

        // Try to fetch from API
        try {
          const response = await fetch("/api/keywords");

          if (response.ok) {
            const data = await response.json();
            if (Array.isArray(data) && data.length > 0) {
              setKeywords(data);
            }
          } else {
            console.warn("Keywords API returned status:", response.status);
          }
        } catch (error) {
          console.error("Error fetching keywords:", error);
          // Already using fallback data, so no need to do anything
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchKeywords();
  }, []);

  // Filter keywords based on search term and selected letter
  useEffect(() => {
    let filtered = keywords;

    if (searchTerm.trim() !== "") {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (keyword) =>
          keyword.term.toLowerCase().includes(term) ||
          keyword.definition.toLowerCase().includes(term)
      );
      setSelectedLetter(null); // Clear letter selection when searching
    } else if (selectedLetter) {
      filtered = filtered.filter(
        (keyword) => keyword.term.charAt(0).toUpperCase() === selectedLetter
      );
    }

    // Sort alphabetically
    filtered = [...filtered].sort((a, b) => a.term.localeCompare(b.term));

    setFilteredKeywords(filtered);
  }, [keywords, searchTerm, selectedLetter]);

  // Group keywords by first letter
  const groupedKeywords = filteredKeywords.reduce<{ [key: string]: Keyword[] }>(
    (groups, keyword) => {
      const firstLetter = keyword.term.charAt(0).toUpperCase();
      if (!groups[firstLetter]) {
        groups[firstLetter] = [];
      }
      groups[firstLetter].push(keyword);
      return groups;
    },
    {}
  );

  // Get available letters (letters that have keywords)
  const availableLetters = Object.keys(groupedKeywords).sort();

  // Scroll to section when letter is clicked
  const scrollToLetter = (letter: string) => {
    setSelectedLetter(letter);
    setSearchTerm("");

    // Force a re-render and then scroll
    setTimeout(() => {
      const element = document.getElementById(`letter-${letter}`);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 100);
  };

  return (
    <PageLayout title="Healthcare Glossary">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Search bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search terms and definitions..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Alphabet navigation */}
        <div className="flex flex-wrap justify-center gap-2 py-4">
          {alphabet.map((letter) => {
            // Check if there are any keywords starting with this letter
            const hasKeywords = keywords.some(
              (keyword) => keyword.term.charAt(0).toUpperCase() === letter
            );
            const isSelected = selectedLetter === letter;

            return (
              <Button
                key={letter}
                variant={isSelected ? "default" : "outline"}
                size="sm"
                className={`rounded-full w-10 h-10 p-0 ${
                  !hasKeywords && !isLoading ? "opacity-40" : ""
                } ${isSelected ? "bg-primary text-primary-foreground" : ""}`}
                onClick={() => hasKeywords && scrollToLetter(letter)}
                disabled={!hasKeywords || isLoading}
              >
                {letter}
              </Button>
            );
          })}
        </div>

        {/* Keywords list */}
        <div className="space-y-8">
          {isLoading ? (
            // Loading skeletons
            Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="space-y-4">
                <Skeleton className="h-8 w-16" />
                <Card>
                  <CardContent className="p-4">
                    <Skeleton className="h-6 w-1/3 mb-2" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3 mt-1" />
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <Skeleton className="h-6 w-1/4 mb-2" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4 mt-1" />
                  </CardContent>
                </Card>
              </div>
            ))
          ) : filteredKeywords.length > 0 ? (
            // Grouped keywords by letter
            searchTerm ? (
              // When searching, show flat list
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Found {filteredKeywords.length}{" "}
                  {filteredKeywords.length === 1 ? "result" : "results"} for "
                  {searchTerm}"
                </p>
                {filteredKeywords.map((keyword) => (
                  <Card key={keyword.id}>
                    <CardContent className="p-4">
                      <h3 className="font-bold text-lg mb-2">{keyword.term}</h3>
                      <p className="text-muted-foreground">
                        {keyword.definition}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              // When not searching, group by letter
              Object.entries(groupedKeywords)
                .sort(([a], [b]) => a.localeCompare(b))
                .map(([letter, keywordsInGroup]) => (
                  <div
                    key={letter}
                    id={`letter-${letter}`}
                    className="scroll-mt-20"
                  >
                    <h2 className="text-2xl font-bold mb-4 flex items-center">
                      <span className="flex items-center justify-center bg-primary text-primary-foreground rounded-full w-10 h-10 mr-3">
                        {letter}
                      </span>
                      <span>Terms</span>
                    </h2>
                    <div className="space-y-4">
                      {keywordsInGroup.map((keyword) => (
                        <Card key={keyword.id}>
                          <CardContent className="p-4">
                            <h3 className="font-bold text-lg mb-2">
                              {keyword.term}
                            </h3>
                            <p className="text-muted-foreground">
                              {keyword.definition}
                            </p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                ))
            )
          ) : (
            // No results
            <div className="text-center py-12">
              <h3 className="text-lg font-medium mb-2">No keywords found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search term
              </p>
              {searchTerm && (
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => setSearchTerm("")}
                >
                  Clear Search
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
}
