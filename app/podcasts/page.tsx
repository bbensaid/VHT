"use client";

import { useEffect, useState } from "react";
import ReactAudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { ChevronLeft, Home } from "lucide-react";
import { useRouter } from "next/navigation";

import { MediaGrid } from "@/components/media-grid";
import { PageLayout } from "@/components/page-layout";

interface Podcast {
  id: string;
  title: string;
  audioUrl: string;
  duration?: number;
  publishedAt?: string;
}

export default function PodcastsPage() {
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const router = useRouter();

  const handleAudioError = (error: Error) => {
    console.error("Audio playback error:", error);
    toast({
      title: "Audio Error",
      description: error.message,
      variant: "destructive",
    });
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return "0:00";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  useEffect(() => {
    fetch("/api/podcasts")
      .then((res) => res.json())
      .then((data) => {
        setPodcasts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load podcasts:", err);
        setLoading(false);
        toast({
          title: "Error",
          description: "Failed to load podcasts",
          variant: "destructive",
        });
      });
  }, [toast]);

  const handlePodcastUpload = async (podcast: Podcast) => {
    setPodcasts((prev) => [podcast, ...prev]);
  };

  const [selectedPodcast, setSelectedPodcast] = useState<Podcast | null>(null);

  return (
    <PageLayout title="Podcasts">
      {/* Selected Podcast Player */}
      {selectedPodcast && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>{selectedPodcast.title}</CardTitle>
            <button
              onClick={() => setSelectedPodcast(null)}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              ← Back to list
            </button>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 rounded-lg p-4">
              <ReactAudioPlayer
                src={selectedPodcast.audioUrl}
                autoPlayAfterSrcChange={false}
                style={{ borderRadius: "0.5rem" }}
                header={selectedPodcast.title}
                onError={(e) => {
                  if (e instanceof Error) {
                    handleAudioError(e);
                  } else if (
                    e instanceof Event &&
                    e.target instanceof HTMLMediaElement &&
                    e.target.error
                  ) {
                    handleAudioError(new Error(e.target.error.message));
                  } else {
                    handleAudioError(new Error("Unknown audio error occurred"));
                  }
                }}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Podcast List */}
      {!selectedPodcast && (
        <Card>
          <CardHeader>
            <CardTitle>Available Episodes</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">Loading podcasts...</div>
            ) : podcasts.length === 0 ? (
              <div className="text-center py-8">No podcasts available</div>
            ) : (
              <MediaGrid
                items={podcasts}
                renderItem={(podcast) => (
                  <Card
                    key={podcast.id}
                    className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => setSelectedPodcast(podcast)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center mb-4">
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mr-4">
                          🎙️
                        </div>
                        <h3 className="text-lg font-semibold">
                          {podcast.title}
                        </h3>
                      </div>
                      <div className="text-sm text-gray-500 flex items-center gap-4">
                        {podcast.duration && (
                          <span className="flex items-center">
                            <span className="mr-1">⏱️</span>
                            {formatDuration(podcast.duration)}
                          </span>
                        )}
                        {podcast.publishedAt && (
                          <span className="flex items-center">
                            <span className="mr-1">📅</span>
                            {new Date(podcast.publishedAt).toLocaleDateString()}
                          </span>
                        )}
                      </div>
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
