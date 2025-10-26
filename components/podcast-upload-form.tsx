'use client'

import * as React from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import type { Podcast } from "@prisma/client"

interface UploadFormProps {
  onSuccess?: (podcast: Podcast) => void
}

export function PodcastUploadForm({ onSuccess }: UploadFormProps) {
  const [loading, setLoading] = React.useState(false)
  const { toast } = useToast()
  const audioRef = React.useRef<HTMLAudioElement>(null)
  
  const [formState, setFormState] = React.useState({
    title: "",
    description: "",
    author: "",
    season: "",
    episodeNumber: "",
    duration: 0,
    tags: [] as string[],
  })

  const handleAudioChange = React.useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const audio = new Audio(URL.createObjectURL(file))
      audio.onloadedmetadata = () => {
        setFormState(prev => ({
          ...prev,
          duration: Math.round(audio.duration),
        }))
      }
    } catch (error) {
      console.error('Error loading audio file:', error)
      toast({
        title: "Error",
        description: "Failed to load audio file. Please try a different file.",
        variant: "destructive",
      })
    }
  }, [toast])

  const handleSubmit = React.useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const form = e.target as HTMLFormElement
      const formData = new FormData(form)
      
      // Add duration to form data
      formData.set('duration', formState.duration.toString())
      
      // Convert tags array to JSON string
      const tags = formData.get("tags") as string
      if (tags) {
        formData.set("tags", JSON.stringify(tags.split(",").map(t => t.trim())))
      }

      const response = await fetch("/api/podcasts/upload", {
        method: "POST",
        body: formData,
      })

      if (response.status === 401) {
        throw new Error("Please log in to upload podcasts")
      }
      
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Upload failed")
      }

      const podcast = await response.json()
      
      toast({
        title: "Success",
        description: "Podcast uploaded successfully!",
      })

      setFormState({
        title: "",
        description: "",
        author: "",
        season: "",
        episodeNumber: "",
        duration: 0,
        tags: [],
      })
      form.reset()
      
      onSuccess?.(podcast)
    } catch (error) {
      console.error("Error uploading podcast:", error)
      toast({
        title: "Error",
        description: (error as Error).message || "Failed to upload podcast. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }, [formState.duration, onSuccess, toast])

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Upload New Podcast</CardTitle>
        <CardDescription>Add a new episode to your podcast series</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input 
              id="title" 
              name="title" 
              required 
              placeholder="Episode title"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea 
              id="description" 
              name="description" 
              required 
              placeholder="Episode description"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="season">Season</Label>
              <Input 
                id="season" 
                name="season" 
                type="number"
                min="1"
                placeholder="Season number"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="episodeNumber">Episode</Label>
              <Input 
                id="episodeNumber" 
                name="episodeNumber" 
                type="number"
                min="1"
                placeholder="Episode number"
              />
            </div>
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
            <Label htmlFor="audio">Audio File</Label>
            <Input 
              id="audio" 
              name="audio" 
              type="file" 
              accept="audio/*"
              required
              onChange={handleAudioChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Cover Image (Optional)</Label>
            <Input 
              id="image" 
              name="image" 
              type="file" 
              accept="image/*"
            />
          </div>

          <audio ref={audioRef} className="hidden" />

          <Button 
            type="submit" 
            className="w-full"
            disabled={loading}
          >
            {loading ? "Uploading..." : "Upload Podcast"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
