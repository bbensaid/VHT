"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { ChevronLeft, Home, Upload } from "lucide-react";
import { useRouter } from "next/navigation";


import { MediaGrid } from "@/components/media-grid";
import { PageLayout } from "@/components/page-layout";

interface Video {
  id: string;
  title: string;
  videoUrl: string;
  description: string;
  thumbnailUrl?: string;
  duration?: number;
  publishedAt?: string;
}

export default function VideosPage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const router = useRouter();
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

  useEffect(() => {
    fetch("/api/videos")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setVideos(data);
        } else {
          console.error("Fetched data is not an array:", data);
          setVideos([]); // Set to empty array to prevent crash
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load videos:", err);
        setLoading(false);
        toast({
          title: "Error",
          description: "Failed to load videos",
          variant: "destructive",
        });
      });
  }, []);

  const handleVideoError = (error: any) => {
    console.error("Video playback error:", error);
    toast({
      title: "Video Error",
      description: "Could not play the video.",
      variant: "destructive",
    });
  };

  return (
    <PageLayout title="Videos">
      {/* Selected Video Player */}
      {selectedVideo && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>{selectedVideo.title}</CardTitle>
            <button
              onClick={() => setSelectedVideo(null)}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              ← Back to list
            </button>
          </CardHeader>
          <CardContent>
            <div className="aspect-video bg-gray-50 rounded-lg p-4">
              <video
                key={selectedVideo.videoUrl}
                src={selectedVideo.videoUrl}
                controls
                width="100%"
                height="100%"
                onError={handleVideoError}
              />
            </div>
            <p className="mt-4 text-sm text-gray-600">{selectedVideo.description}</p>
          </CardContent>
        </Card>
      )}

      {/* Video List */}
      {!selectedVideo && (
        <Card>
          <CardHeader>
            <CardTitle>Available Videos</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">Loading videos...</div>
            ) : videos.length === 0 ? (
              <div className="text-center py-8">No videos available</div>
            ) : (
              <MediaGrid
                items={videos}
                renderItem={(video) => (
                  <Card
                    key={video.id}
                    className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => setSelectedVideo(video)}
                  >
                    <CardContent className="p-6">
                      <div className="aspect-video bg-gray-100 rounded-md mb-4 flex items-center justify-center">
                        {video.thumbnailUrl ? (
                          <img src={video.thumbnailUrl} alt={video.title} className="w-full h-full object-cover"/>
                        ) : (
                          <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                            ▶️
                          </div>
                        )}
                      </div>
                      <h3 className="text-lg font-semibold">
                        {video.title}
                      </h3>
                      {video.publishedAt && (
                        <p className="text-sm text-gray-500 mt-2">
                          {new Date(video.publishedAt).toLocaleDateString()}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                )}
              />
            )}
          </CardContent>
        </Card>
      )}
    </PageLayout>
  );
}