"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Upload,
  Pencil,
  Trash2,
  Clock,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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

interface Podcast {
  id: string;
  title: string;
  description: string;
  audioUrl: string;
  imageUrl?: string | null;
  author?: string | null;
  season?: number | null;
  episodeNumber?: number | null;
  duration: number;
  downloads: number;
  likes: number;
  publishedAt: string;
}

export default function PodcastAdminPage() {
  const [uploading, setUploading] = useState(false);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const [editingPodcast, setEditingPodcast] = useState<Podcast | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    author: "",
    season: "",
    episodeNumber: "",
  });

  const fetchPodcasts = useCallback(async () => {
    try {
      const res = await fetch("/api/podcasts");
      if (!res.ok) throw new Error("Failed to fetch podcasts");
      const data = await res.json();
      setPodcasts(data);
    } catch (_error) {
      toast({
        title: "Error",
        description: "Failed to fetch podcasts",
        variant: "destructive",
      });
    }
  }, [toast]);

  useEffect(() => {
    void fetchPodcasts();
  }, [fetchPodcasts]);

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/podcasts/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete podcast");

      toast({
        title: "Success",
        description: "Podcast deleted successfully",
      });

      fetchPodcasts();
    } catch (_error) {
      toast({
        title: "Error",
        description: "Failed to delete podcast",
        variant: "destructive",
      });
    }
  };

  const handleUpdate = async (id: string, updatedData: Partial<Podcast>) => {
    try {
      const res = await fetch(`/api/podcasts/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });
      if (!res.ok) throw new Error("Failed to update podcast");

      toast({
        title: "Success",
        description: "Podcast updated successfully",
      });

      fetchPodcasts();
      setEditingPodcast(null);
    } catch (_error) {
      toast({
        title: "Error",
        description: "Failed to update podcast",
        variant: "destructive",
      });
    }
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!audioFile) return;

    setUploading(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('audio', audioFile);
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('author', formData.author);
      formDataToSend.append('season', formData.season);
      formDataToSend.append('episodeNumber', formData.episodeNumber);
      if (imageFile) {
        formDataToSend.append('image', imageFile);
      }

      const res = await fetch('/api/podcasts/upload', {
        method: 'POST',
        body: formDataToSend,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to upload podcast');
      }

      // Reset form
      setFormData({
        title: "",
        description: "",
        author: "",
        season: "",
        episodeNumber: "",
      });
      setAudioFile(null);
      setImageFile(null);

      toast({
        title: "Success",
        description: "Podcast uploaded successfully",
      });

      fetchPodcasts(); // Refresh the list of podcasts
    } catch (error) {
      console.error("Error uploading podcast:", error);
      toast({
        title: "Error",
        description: (error as Error).message || "Failed to upload podcast. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <Tabs defaultValue="upload" className="space-y-6">
        <TabsList>
          <TabsTrigger value="upload">Upload New</TabsTrigger>
          <TabsTrigger value="manage">Manage Episodes</TabsTrigger>
        </TabsList>

        <TabsContent value="upload">
          <Card>
            <CardHeader>
              <CardTitle>Add New Podcast Episode</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="author">Author</Label>
                  <Input
                    id="author"
                    value={formData.author}
                    onChange={(e) =>
                      setFormData({ ...formData, author: e.target.value })
                    }
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="season">Season (optional)</Label>
                    <Input
                      id="season"
                      type="number"
                      value={formData.season}
                      onChange={(e) =>
                        setFormData({ ...formData, season: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="episodeNumber">Episode Number (optional)</Label>
                    <Input
                      id="episodeNumber"
                      type="number"
                      value={formData.episodeNumber}
                      onChange={(e) =>
                        setFormData({ ...formData, episodeNumber: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="audio">Audio File</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="audio"
                      type="file"
                      accept="audio/*"
                      onChange={(e) =>
                        setAudioFile(e.target.files ? e.target.files[0] : null)
                      }
                      required
                    />
                    {audioFile && (
                      <span className="text-sm text-muted-foreground">
                        {audioFile.name}
                      </span>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="image">Cover Image (optional)</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="image"
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        setImageFile(e.target.files ? e.target.files[0] : null)
                      }
                    />
                    {imageFile && (
                      <span className="text-sm text-muted-foreground">
                        {imageFile.name}
                      </span>
                    )}
                  </div>
                </div>

                <Button type="submit" disabled={uploading || !audioFile}>
                  {uploading ? (
                    "Uploading..."
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Podcast
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="manage">
          <Card>
            <CardHeader>
              <CardTitle>Manage Episodes</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px]">
                <div className="space-y-4">
                  {podcasts.map((podcast) => (
                    <Card key={podcast.id}>
                      <CardContent className="pt-6">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold">{podcast.title}</h3>
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {podcast.description}
                            </p>
                            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {formatDuration(podcast.duration)}
                              </span>
                              {podcast.author && (
                                <span>By {podcast.author}</span>
                              )}
                              {podcast.season && (
                                <span>Season {podcast.season}</span>
                              )}
                              {podcast.episodeNumber && (
                                <span>Episode {podcast.episodeNumber}</span>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="icon">
                                  <Pencil className="w-4 h-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Edit Episode</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                  <div className="space-y-2">
                                    <Label htmlFor="edit-title">Title</Label>
                                    <Input
                                      id="edit-title"
                                      value={editingPodcast?.title ?? podcast.title}
                                      onChange={(e) =>
                                        setEditingPodcast({
                                          ...podcast,
                                          title: e.target.value,
                                        })
                                      }
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="edit-description">Description</Label>
                                    <Textarea
                                      id="edit-description"
                                      value={editingPodcast?.description ?? podcast.description}
                                      onChange={(e) =>
                                        setEditingPodcast({
                                          ...podcast,
                                          description: e.target.value,
                                        })
                                      }
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="edit-author">Author</Label>
                                    <Input
                                      id="edit-author"
                                      value={editingPodcast?.author ?? podcast.author ?? ""}
                                      onChange={(e) =>
                                        setEditingPodcast({
                                          ...podcast,
                                          author: e.target.value,
                                        })
                                      }
                                    />
                                  </div>
                                </div>
                                <div className="flex justify-end gap-2">
                                  <Button
                                    onClick={() =>
                                      handleUpdate(podcast.id, editingPodcast!)
                                    }
                                  >
                                    Save Changes
                                  </Button>
                                </div>
                              </DialogContent>
                            </Dialog>

                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="outline" size="icon">
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Episode</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete this episode? This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDelete(podcast.id)}
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}