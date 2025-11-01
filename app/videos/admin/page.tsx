
'use client'

import * as React from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"

import { PageLayout } from "@/components/page-layout";

export default function VideoAdminPage() {
  const [loading, setLoading] = React.useState(false)
  const { toast } = useToast()
  const [videoFile, setVideoFile] = React.useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!videoFile) {
      toast({
        title: "Error",
        description: "Please select a video file to upload.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true)

    try {
      const form = e.target as HTMLFormElement
      const formData = new FormData(form)
      formData.append('video', videoFile);

      const response = await fetch("/api/videos/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Upload failed")
      }

      toast({
        title: "Success",
        description: "Video uploaded successfully!",
      })

      form.reset()
      setVideoFile(null);
    } catch (error) {
      console.error("Error uploading video:", error)
      toast({
        title: "Error",
        description: (error as Error).message || "Failed to upload video. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageLayout title="Upload Video">
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Upload New Video</CardTitle>
          <CardDescription>Add a new video to your collection.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input 
                id="title" 
                name="title" 
                required 
                placeholder="Video title"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description" 
                name="description" 
                required 
                placeholder="Video description"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="author">Author</Label>
              <Input 
                id="author" 
                name="author" 
                placeholder="Author name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Tags</Label>
              <Input 
                id="tags" 
                name="tags" 
                placeholder="Enter tags separated by commas"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="video">Video File</Label>
              <Input 
                id="video" 
                name="video" 
                type="file" 
                accept="video/*"
                required
                onChange={(e) => setVideoFile(e.target.files ? e.target.files[0] : null)}
              />
            </div>

            <Button 
              type="submit" 
              className="w-full"
              disabled={loading}
            >
              {loading ? "Uploading..." : "Upload Video"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </PageLayout>
  )
}
