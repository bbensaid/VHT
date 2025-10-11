"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import {
  Search,
  Plus,
  Calendar,
  User,
  FileText,
  MessageSquare,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

type Comment = {
  id: string;
  content: string;
  documentName: string;
  documentPage: number;
  author: string;
  createdAt: string;
  updatedAt: string;
};

export default function CommentsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const documentParam = searchParams?.get("document");
  const pageParam = searchParams?.get("page");

  const [comments, setComments] = useState<Comment[]>([]);
  const [filteredComments, setFilteredComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [documentFilter, setDocumentFilter] = useState<string>(
    documentParam || "all"
  );
  const [documents, setDocuments] = useState<string[]>([]);
  const commentsPerPage = 10;

  // Fetch comments
  useEffect(() => {
    const fetchComments = async () => {
      try {
        setIsLoading(true);

        let url = "/api/comments";
        if (documentParam) {
          url += `?document=${encodeURIComponent(documentParam)}`;
          if (pageParam) {
            url += `&page=${pageParam}`;
          }
        }

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Failed to fetch comments");
        }

        const data = await response.json();
        setComments(data);

        // Extract unique document names for filter
        const uniqueDocuments = Array.from(
          new Set(data.map((comment: Comment) => comment.documentName))
        );
        setDocuments(uniqueDocuments);
      } catch (error) {
        console.error("Error fetching comments:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchComments();
  }, [documentParam, pageParam]);

  // Filter comments based on search term and document filter
  useEffect(() => {
    let result = comments;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (comment) =>
          comment.content.toLowerCase().includes(term) ||
          comment.author.toLowerCase().includes(term) ||
          comment.documentName.toLowerCase().includes(term)
      );
    }

    if (documentFilter && documentFilter !== "all") {
      result = result.filter(
        (comment) => comment.documentName === documentFilter
      );
    }

    setFilteredComments(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchTerm, documentFilter, comments]);

  // Calculate pagination
  const indexOfLastComment = currentPage * commentsPerPage;
  const indexOfFirstComment = indexOfLastComment - commentsPerPage;
  const currentComments = filteredComments.slice(
    indexOfFirstComment,
    indexOfLastComment
  );
  const totalPages = Math.ceil(filteredComments.length / commentsPerPage);

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
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
    <PageLayout title="Document Comments">
      <div className="space-y-6">
        {/* Search and filters */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search comments..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex gap-4 w-full sm:w-auto">
            <Select value={documentFilter} onValueChange={setDocumentFilter}>
              <SelectTrigger className="w-full sm:w-[250px]">
                <SelectValue placeholder="Filter by document" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Documents</SelectItem>
                {documents.map((doc) => (
                  <SelectItem key={doc} value={doc}>
                    {doc}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              onClick={() => router.push("/comments/new")}
              className="whitespace-nowrap"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Comment
            </Button>
          </div>
        </div>

        {/* Comments table */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Document Comments</CardTitle>
            <CardDescription>
              View and manage comments on healthcare reform documents
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-[250px]" />
                      <Skeleton className="h-4 w-[200px]" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredComments.length === 0 ? (
              <div className="text-center py-12">
                <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No comments found</h3>
                <p className="text-muted-foreground mb-6">
                  {searchTerm || documentFilter !== "all"
                    ? "Try adjusting your search or filters"
                    : "Be the first to add a comment"}
                </p>
                {(searchTerm || documentFilter !== "all") && (
                  <Button
                    onClick={() => {
                      setSearchTerm("");
                      setDocumentFilter("all");
                    }}
                  >
                    Clear Filters
                  </Button>
                )}
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[300px]">Comment</TableHead>
                      <TableHead>Document</TableHead>
                      <TableHead>Page</TableHead>
                      <TableHead>Author</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentComments.map((comment) => (
                      <TableRow key={comment.id}>
                        <TableCell className="font-medium">
                          <div className="line-clamp-2">{comment.content}</div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            <span className="line-clamp-1">
                              {comment.documentName}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {comment.documentPage}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            {comment.author}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            {formatDate(comment.createdAt)}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              router.push(`/comments/${comment.id}`)
                            }
                          >
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>

          {/* Pagination */}
          {totalPages > 1 && (
            <CardFooter>
              <Pagination className="w-full">
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
            </CardFooter>
          )}
        </Card>
      </div>
    </PageLayout>
  );
}
