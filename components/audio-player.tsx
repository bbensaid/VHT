'use client'

import * as React from 'react'
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Download,
  Heart,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface AudioPlayerProps {
  src: string
  title: string
  episodeId: string
  onDownload?: () => void
  onLike?: () => void
  onEnded?: () => void
  onError?: (error: Error) => void
  className?: string
}

export function AudioPlayer({
  src,
  title,
  episodeId,
  onEnded,
  onError,
  onDownload,
  onLike,
  className,
}: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = React.useState(false)
  const [progress, setProgress] = React.useState(0)
  const [duration, setDuration] = React.useState(0)
  const [volume, setVolume] = React.useState(1)
  const [isMuted, setIsMuted] = React.useState(false)
  const audioRef = React.useRef<HTMLAudioElement>(null)
  const intervalRef = React.useRef<NodeJS.Timeout>()

  React.useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    // Validate src
    if (!src) {
      console.error('Audio source URL is empty')
      onError?.(new Error('No audio source provided'))
      return
    }

    // Reset player state when src changes
    setIsPlaying(false)
    setProgress(0)
    setDuration(0)

    // Set source and configure audio element
    audio.src = src
    audio.preload = "metadata"
    audio.crossOrigin = "anonymous" // Enable CORS for audio loading
    
    // Reset the audio element
    audio.pause()
    audio.currentTime = 0
    
    const handleLoadedMetadata = () => {
      if (!Number.isFinite(audio.duration)) {
        onError?.(new Error('Invalid audio duration'))
        return
      }
      setDuration(audio.duration)
    }

    const handleAudioError = (event: ErrorEvent) => {
      const audio = audioRef.current
      if (!audio) return
      
      const errorDetails = {
        code: audio.error?.code,
        message: audio.error?.message,
        details: {
          currentSrc: audio.currentSrc || src,
          networkState: audio.networkState,
          readyState: audio.readyState,
          event: event.type
        }
      }
      console.error('Audio error details:', errorDetails)
      
      setIsPlaying(false)
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }

      let errorMessage = 'Failed to load or play the audio file'
      if (audio.error?.code === 2) {
        errorMessage = 'Network error while loading audio'
      } else if (audio.error?.code === 3) {
        errorMessage = 'Error decoding audio file'
      } else if (audio.error?.code === 4) {
        errorMessage = 'Audio source not supported'
      }

      onError?.(new Error(`${errorMessage} (code: ${audio.error?.code || 'unknown'})`))
    }

    const handleEnded = () => {
      setIsPlaying(false)
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
      onEnded?.()
    }

    // Define all event handlers
    const events = {
      loadedmetadata: handleLoadedMetadata,
      ended: handleEnded,
      error: handleAudioError,
      abort: () => onError?.(new Error('Audio loading aborted')),
      stalled: () => console.warn('Audio loading stalled')
    }

    // Store reference to current audio element for cleanup
    const currentAudio = audio
    
    // Add event listeners
    Object.entries(events).forEach(([event, handler]) => {
      currentAudio.addEventListener(event, handler as EventListener)
    })
    
    // Start loading the audio
    currentAudio.load()

    // Clean up function
    return () => {
      Object.entries(events).forEach(([event, handler]) => {
        currentAudio.removeEventListener(event, handler as EventListener)
      })
      
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [onEnded, onError, src])

  React.useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  const startTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }

    intervalRef.current = setInterval(() => {
      if (audioRef.current?.ended) {
        setIsPlaying(false)
        clearInterval(intervalRef.current)
      } else {
        setProgress(audioRef.current?.currentTime || 0)
      }
    }, 1000)
  }

  const togglePlay = async () => {
    const audio = audioRef.current
    if (!audio) return

    try {
      if (isPlaying) {
        audio.pause()
        if (intervalRef.current) {
          clearInterval(intervalRef.current)
        }
      } else {
        await audio.play()
        startTimer()
      }
      setIsPlaying(!isPlaying)
    } catch (error) {
      console.error('Playback error:', error)
      onError?.(new Error('Failed to play audio. Please try again.'))
    }
  }

  const seek = (value: number) => {
    const audio = audioRef.current
    if (!audio) return
    
    audio.currentTime = value
    setProgress(value)
  }

  const toggleMute = () => {
    const audio = audioRef.current
    if (!audio) return
    
    setIsMuted(!isMuted)
    audio.volume = isMuted ? volume : 0
  }

  const adjustVolume = (value: number) => {
    const audio = audioRef.current
    if (!audio) return
    
    const newVolume = value / 100
    setVolume(newVolume)
    audio.volume = newVolume
    setIsMuted(newVolume === 0)
  }

  const formatTime = (time: number) => {
    if (!isFinite(time)) return "0:00"
    
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  return (
    <div className={cn("flex flex-col space-y-2 p-4 rounded-lg border", className)}>
      <div className="text-lg font-medium">{title}</div>
      
      <div className="flex items-center space-x-2">
        <audio ref={audioRef} preload="metadata" />
        
        <Button
          variant="ghost"
          size="sm"
          onClick={togglePlay}
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </Button>

        <span className="text-sm w-12">{formatTime(progress)}</span>
        
        <Slider
          value={[progress]}
          max={duration}
          step={1}
          onValueChange={([value]) => seek(value)}
          className="w-full"
        />
        
        <span className="text-sm w-12">{formatTime(duration)}</span>

        <Button
          variant="ghost"
          size="sm"
          onClick={toggleMute}
          aria-label={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
        </Button>

        <Slider
          value={[volume * 100]}
          max={100}
          step={1}
          onValueChange={([value]) => adjustVolume(value)}
          className="w-24"
        />

        {onDownload && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onDownload}
            aria-label="Download"
          >
            <Download className="h-4 w-4" />
          </Button>
        )}

        {onLike && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onLike}
            aria-label="Like"
          >
            <Heart className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  )
}