"use client";

import type React from "react";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Upload, Home, ArrowLeft } from "lucide-react";

type Keyword = {
  id: string;
  term: string;
  definition: string;
};

import { PageLayout } from "@/components/page-layout";

const AdminPage = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [keywords, setKeywords] = useState<Keyword[]>([]);
  const [newKeyword, setNewKeyword] = useState({
    term: "",
    definition: "",
  });
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchKeywords = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/keywords");
      if (!response.ok) {
        throw new Error("Failed to fetch keywords");
      }
      const data = await response.json();
      setKeywords(data);
    } catch (error) {
      console.error("Error fetching keywords:", error);
      toast({
        title: "Error",
        description: "Failed to fetch keywords",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchKeywords();
  }, [fetchKeywords]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setNewKeyword({ ...newKeyword, [e.target.name]: e.target.value });
  };

  const handleCreateKeyword = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/keywords", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newKeyword),
      });

      if (!response.ok) {
        throw new Error("Failed to create keyword");
      }

      fetchKeywords();
      setNewKeyword({ term: "", definition: "" });
      setOpen(false);
      toast({
        title: "Success",
        description: "Keyword created successfully",
      });
    } catch (error) {
      console.error("Error creating keyword:", error);
      toast({
        title: "Error",
        description: "Failed to create keyword",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteKeyword = async (id: string) => {
    setIsLoading(true);
    try {
      console.log("Deleting keyword with ID:", id);

      const response = await fetch(`/api/keywords/${id}`, {
        method: "DELETE",
      });

      console.log("Delete response status:", response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("Delete API response:", {
          status: response.status,
          statusText: response.statusText,
          errorData,
        });
        throw new Error(
          `Failed to delete keyword: ${response.status} ${
            response.statusText
          } ${errorData.error || ""}`
        );
      }

      setKeywords(keywords.filter((keyword) => keyword.id !== id));
      toast({
        title: "Success",
        description: "Keyword deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting keyword:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to delete keyword",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    console.log("Uploading file:", file.name, file.type, file.size);

    try {
      setIsLoading(true);

      // Create FormData
      const formData = new FormData();
      formData.append("file", file);

      console.log("Sending request to /api/import");
      const response = await fetch("/api/import", {
        method: "POST",
        body: formData,
      });

      console.log("Response received:", response.status, response.statusText);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("Import API response:", {
          status: response.status,
          statusText: response.statusText,
          errorData,
        });
        throw new Error(
          `Failed to import keywords: ${response.status} ${
            response.statusText
          } ${errorData.error || ""}`
        );
      }

      const data = await response.json();
      console.log("Import successful:", data);

      await fetchKeywords();

      toast({
        title: "Success",
        description: `Imported ${data.count || 0} keywords successfully`,
      });

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Error importing keywords:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to import keywords",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageLayout title="Admin Dashboard">
      <div className="mb-5 flex justify-between items-center">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="outline">Add Keyword</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add Keyword</DialogTitle>
              <DialogDescription>
                Create a new keyword to be used in the application.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="term" className="text-right">
                  Term
                </Label>
                <Input
                  type="text"
                  id="term"
                  name="term"
                  value={newKeyword.term}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="definition" className="text-right">
                  Definition
                </Label>
                <Textarea
                  id="definition"
                  name="definition"
                  value={newKeyword.definition}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
            </div>
            <Button onClick={handleCreateKeyword}>Create Keyword</Button>
          </DialogContent>
        </Dialog>

        <div className="flex items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls,.csv"
            className="hidden"
            onChange={handleFileUpload}
          />
          <Button
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="mr-2 h-4 w-4" />
            Import Keywords
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
          <Skeleton className="h-4 w-[300px]" />
        </div>
      ) : (
        <Table>
          <TableCaption>A list of your keywords.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Term</TableHead>
              <TableHead>Definition</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {keywords.map((keyword) => (
              <TableRow key={keyword.id}>
                <TableCell>{keyword.term}</TableCell>
                <TableCell>{keyword.definition}</TableCell>
                <TableCell className="text-right">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm">
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Are you absolutely sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently
                          delete the keyword from our servers.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeleteKeyword(keyword.id)}
                        >
                          Continue
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </PageLayout>
  );
};

export default AdminPage;
