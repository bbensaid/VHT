"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PageLayout } from "@/components/page-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Plus, Calendar, User } from "lucide-react";

type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  author: string;
  createdAt: string;
  published: boolean;
};

// Fallback data in case the API fails
const fallbackPosts: BlogPost[] = [
  {
    id: "1",
    title: "Understanding Vermont's Healthcare Reform Initiatives",
    slug: "understanding-vermont-healthcare-reform",
    excerpt:
      "An overview of the key healthcare reform initiatives in Vermont and their impact on residents and providers.",
    author: "Jane Smith",
    createdAt: new Date().toISOString(),
    published: true,
  },
  {
    id: "2",
    title: "The Role of Green Mountain Care Board in Healthcare Policy",
    slug: "role-of-green-mountain-care-board",
    excerpt:
      "Exploring how the Green Mountain Care Board shapes healthcare policy and ensures quality care for Vermonters.",
    author: "John Doe",
    createdAt: new Date().toISOString(),
    published: true,
  },
  {
    id: "3",
    title: "Medicaid Expansion: Benefits and Challenges",
    slug: "medicaid-expansion-benefits-challenges",
    excerpt:
      "A detailed analysis of Medicaid expansion in Vermont, including its benefits, challenges, and future outlook.",
    author: "Sarah Johnson",
    createdAt: new Date().toISOString(),
    published: true,
  },
];

export default function BlogPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [category, setCategory] = useState("all");
  const postsPerPage = 6;

  // Fetch blog posts
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setIsLoading(true);

        // Start with fallback data
        setPosts(fallbackPosts);
        setFilteredPosts(fallbackPosts);

        // Try to fetch from API
        try {
          const response = await fetch("/api/blog");

          if (response.ok) {
            const data = await response.json();
            if (Array.isArray(data) && data.length > 0) {
              setPosts(data);
              setFilteredPosts(data);
            }
          } else {
            console.warn("Blog API returned status:", response.status);
          }
        } catch (error) {
          console.error("Error fetching blog posts:", error);
          // Already using fallback data, so no need to do anything
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Filter posts based on search term and category
  useEffect(() => {
    let result = posts;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (post) =>
          post.title.toLowerCase().includes(term) ||
          post.excerpt.toLowerCase().includes(term) ||
          post.author.toLowerCase().includes(term)
      );
    }

    if (category !== "all") {
      // This is a placeholder - in a real app, you'd have categories in your data model
      // For now, we'll just simulate filtering by author as a category
      result = result.filter((post) =>
        post.author.toLowerCase().includes(category.toLowerCase())
      );
    }

    setFilteredPosts(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchTerm, category, posts]);

  // Calculate pagination
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Generate pagination items
  const renderPaginationItems = () => {
    const items = [];

    for (let i = 1; i <= totalPages; i++) {
      // Show first page, last page, and pages around current page
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - 1 && i <= currentPage + 1)
      ) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              isActive={i === currentPage}
              onClick={() => setCurrentPage(i)}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      } else if (
        (i === currentPage - 2 && currentPage > 3) ||
        (i === currentPage + 2 && currentPage < totalPages - 2)
      ) {
        items.push(
          <PaginationItem key={i}>
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
    }

    return items;
  };

  return (
    <PageLayout title="Blog">
      <div className="space-y-6">
        {/* Search and filters */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search blog posts..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex gap-4 w-full sm:w-auto">
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="jane">Jane Smith</SelectItem>
                <SelectItem value="john">John Doe</SelectItem>
                <SelectItem value="sarah">Sarah Johnson</SelectItem>
              </SelectContent>
            </Select>

            <Button
              onClick={() => router.push("/blog/new")}
              className="whitespace-nowrap"
            >
              <Plus className="mr-2 h-4 w-4" />
              New Post
            </Button>
          </div>
        </div>

        {/* Blog posts grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <Card key={index} className="flex flex-col">
                <CardHeader className="pb-4">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full" />
                </CardHeader>
                <CardContent className="flex-1">
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-2/3" />
                </CardContent>
                <CardFooter>
                  <Skeleton className="h-4 w-1/2" />
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium mb-2">No blog posts found</h3>
            <p className="text-muted-foreground mb-6">
              Try adjusting your search or filters
            </p>
            <Button
              onClick={() => {
                setSearchTerm("");
                setCategory("all");
              }}
            >
              Clear Filters
            </Button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentPosts.map((post) => (
                <Card
                  key={post.id}
                  className="flex flex-col hover:shadow-md transition-shadow"
                >
                  <CardHeader className="pb-4">
                    <CardTitle className="text-xl">
                      <Link
                        href={`/blog/${post.slug}`}
                        className="hover:text-primary transition-colors"
                      >
                        {post.title}
                      </Link>
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-2">
                      <Calendar className="h-4 w-4" />
                      {formatDate(post.createdAt)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <p className="text-muted-foreground line-clamp-3">
                      {post.excerpt}
                    </p>
                  </CardContent>
                  <CardFooter className="flex justify-between items-center">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <User className="h-4 w-4" />
                      {post.author}
                    </div>
                    <Button variant="outline" asChild>
                      <Link href={`/blog/${post.slug}`}>Read More</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination className="mt-8">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
                      isActive={currentPage !== 1}
                    />
                  </PaginationItem>

                  {renderPaginationItems()}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                      }
                      isActive={currentPage !== totalPages}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </>
        )}
      </div>
    </PageLayout>
  );
}
