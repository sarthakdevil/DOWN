"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Play, Pause, Heart } from "lucide-react"
import Image from "next/image"
export default function InstagramReelsPage() {
  const [playingVideo, setPlayingVideo] = useState<number | null>(0) // Start with first video playing
  const [likedVideos, setLikedVideos] = useState<Set<number>>(new Set())

  const videos = [
    {
      src: "/WhatsApp Video 2025-08-24 at 12.56.51_85c1a169.mp4",
    },
    {
      src: "/WhatsApp Video 2025-08-24 at 12.56.53_3faf7821.mp4",
    },
    {
      src: "/WhatsApp Video 2025-08-24 at 12.56.56_32d3b82d.mp4",
    },
    {
      src: "/WhatsApp Video 2025-08-24 at 12.56.57_3faf7821.mp4",
    },
    {
      src: "/WhatsApp Video 2025-08-24 at 12.56.56_9838fb1c.mp4",
    },
    {
      src: "/WhatsApp Video 2025-08-24 at 12.56.58_406bb274.mp4",
    },
    {
      src: "/WhatsApp Video 2025-08-24 at 12.57.17_179fd6fd.mp4",
    },
  ]

  const toggleVideo = (index: number) => {
    setPlayingVideo(playingVideo === index ? null : index)
  }

  const toggleLike = (index: number, e: React.MouseEvent) => {
    e.stopPropagation()
    const newLikedVideos = new Set(likedVideos)
    if (newLikedVideos.has(index)) {
      newLikedVideos.delete(index)
    } else {
      newLikedVideos.add(index)
    }
    setLikedVideos(newLikedVideos)
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="absolute top-4 left-4 z-10">
        <Image
          src="/logo.jpg"
          alt="Logo"
          width={48}
          height={48}
          className="w-12 h-12 rounded-lg"
        />
      </div>

      <div className="relative w-full h-64 mb-6">
        <Image
          src="WhatsApp Image 2025-06-07 at 16.29.30_4d368b70.jpg"
          alt="Romantic couple"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50 flex flex-col justify-center items-center text-center px-4">
          <h1 className="text-4xl font-bold mb-2">Love Stories</h1>
          <p className="text-xl text-gray-200">tum ab tk single ho kya?</p>
        </div>
      </div>

      <div className="max-w-md mx-auto">
        {videos.map((video, index) => (
          <div
            key={index}
            className="relative w-full h-[80vh] mb-4 rounded-lg overflow-hidden bg-gray-900"
            onClick={() => toggleVideo(index)}
          >
            <video
              className="w-full h-full object-cover cursor-pointer"
              muted
              loop
              playsInline
              autoPlay={index === 0} // Autoplay first video
              preload="metadata"
              ref={(el) => {
                if (el) {
                  if (playingVideo === index) {
                    el.play()
                  } else {
                    el.pause()
                  }
                }
              }}
            >
              <source src={video.src} type="video/mp4" />
              Your browser does not support the video tag.
            </video>

            <div className="absolute inset-0 flex items-center justify-center">
              <div
                className={`bg-black/50 backdrop-blur-sm rounded-full p-4 transition-opacity duration-200 ${playingVideo === index ? "opacity-0 hover:opacity-100" : "opacity-100"}`}
              >
                {playingVideo === index ? (
                  <Pause className="h-12 w-12 text-white" />
                ) : (
                  <Play className="h-12 w-12 text-white ml-1" />
                )}
              </div>
            </div>

            <div className="absolute right-4 bottom-20 flex flex-col gap-6">
              <div className="flex flex-col items-center">
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-full bg-black/20 backdrop-blur-sm hover:bg-black/40 p-3"
                  onClick={(e) => toggleLike(index, e)}
                >
                  <Heart className={`h-6 w-6 ${likedVideos.has(index) ? "text-red-500 fill-red-500" : "text-white"}`} />
                </Button>
                <span className="text-xs text-white mt-1 font-semibold">10k</span>
              </div>
            </div>

            <div className="absolute bottom-4 left-4 right-20">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-pink-500 to-orange-500 p-0.5">
                  <div className="w-full h-full rounded-full bg-black flex items-center justify-center">
                    <span className="text-xs font-semibold">{index + 1}</span>
                  </div>
                </div>
                <span className="font-semibold text-sm">love_story_{index + 1}</span>
              </div>
              <p className="text-sm text-gray-200 mb-1">Beautiful moments captured ✨ #love #couple #romance</p>
              <p className="text-xs text-gray-400">Tap to play • 100K views</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
