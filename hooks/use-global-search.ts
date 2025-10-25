"use client";

import { useState, useEffect, useMemo } from "react";
import Fuse from "fuse.js";

interface Keyword {
  id: string;
  term: string;
  definition: string;
}

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
}

interface Comment {
  id: string;
  content: string;
  author?: string;
}

export interface SearchResult {
  id: string;
  type: "keyword" | "blog" | "comment";
  title: string;
  content: string;
  url: string;
  excerpt?: string;
}

export function useGlobalSearch(query: string) {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all data
  const [keywords, setKeywords] = useState<Keyword[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [keywordsRes, blogRes, commentsRes] = await Promise.all([
          fetch("/api/keywords"),
          fetch("/api/blog"),
          fetch("/api/comments"),
        ]);

        if (!keywordsRes.ok || !blogRes.ok || !commentsRes.ok) {
          throw new Error("Failed to fetch data");
        }

        const keywordsData = await keywordsRes.json();
        const blogData = await blogRes.json();
        const commentsData = await commentsRes.json();

        setKeywords(keywordsData);
        setBlogPosts(blogData);
        setComments(commentsData);
      } catch (err) {
        setError("Failed to fetch search data");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Create searchable items
  const searchItems = useMemo(() => {
    const items: SearchResult[] = [];

    // Keywords
    keywords.forEach((keyword) => {
      items.push({
        id: keyword.id,
        type: "keyword",
        title: keyword.term,
        content: keyword.definition,
        url: `/glossary?keyword=${encodeURIComponent(keyword.term)}`,
      });
    });

    // Blog posts
    blogPosts.forEach((post) => {
      items.push({
        id: post.id,
        type: "blog",
        title: post.title,
        content: post.content,
        excerpt: post.excerpt || undefined,
        url: `/blog/${post.slug}`,
      });
    });

    // Comments
    comments.forEach((comment) => {
      items.push({
        id: comment.id,
        type: "comment",
        title: `Comment by ${comment.author || "Anonymous"}`,
        content: comment.content,
        url: `/comments#${comment.id}`,
      });
    });

    return items;
  }, [keywords, blogPosts, comments]);

  // Fuse.js configuration
  const fuse = useMemo(() => {
    return new Fuse(searchItems, {
      keys: [
        { name: "title", weight: 0.4 },
        { name: "content", weight: 0.3 },
        { name: "excerpt", weight: 0.3 },
      ],
      threshold: 0.3, // Lower = more strict
      includeScore: true,
    });
  }, [searchItems]);

  // Perform search
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const searchResults = fuse.search(query).map((result) => result.item);
    setResults(searchResults.slice(0, 10)); // Limit to 10 results
  }, [query, fuse]);

  return { results, isLoading, error };
}
