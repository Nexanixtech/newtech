"use client"

import { useEffect, useMemo, useState } from "react"
import Image from "next/image"
import { getHomeContent } from "@/lib/database"

interface Video {
  id: string
  title: string
  thumbnail?: string
  url: string
  description?: string
  displayOrder?: number
}

export default function VideoShowcase() {
  const [videos, setVideos] = useState<Video[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const videosPerPage = 3

  useEffect(() => {
    const home = getHomeContent()
    const list: Video[] = (home?.youtubeVideos || []).map((v: any) => {
      // Extract YouTube video ID and create proper thumbnail URL
      const videoId = extractYouTubeId(v.url)
      const thumbnail = videoId 
        ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
        : `/placeholder.svg?height=200&width=350&query=${encodeURIComponent(v.title)}`

      return {
        id: String(v.id),
        title: v.title,
        url: v.url,
        description: v.description || "",
        thumbnail,
        displayOrder: v.displayOrder,
      }
    })
    // sort by displayOrder if present
    list.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0))
    setVideos(list)
  }, [])

  const extractYouTubeId = (url: string): string | null => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
    const match = url.match(regExp)
    return match && match[2].length === 11 ? match[2] : null
  }

  const currentVideos = useMemo(() => videos.slice(currentIndex, currentIndex + videosPerPage), [videos, currentIndex])

  const nextVideos = () => {
    if (currentIndex + videosPerPage < videos.length) {
      setCurrentIndex(currentIndex + videosPerPage)
    }
  }

  const prevVideos = () => {
    if (currentIndex > 0) {
      setCurrentIndex(Math.max(0, currentIndex - videosPerPage))
    }
  }

  const handleVideoClick = (url: string) => {
    window.open(url, "_blank")
  }

  if (videos.length === 0) {
    return (
      <div className="video-showcase">
        <div className="empty-state" style={{ textAlign: "center", padding: "2rem", color: "#666" }}>
          <h4 style={{ marginBottom: "0.5rem" }}>No YouTube videos yet</h4>
          <p>Add videos in Admin → Manage Home → YouTube Videos</p>
        </div>
      </div>
    )
  }

  return (
    <div className="video-showcase">
      <div className="videos-container">
        {currentVideos.map((video) => (
          <div key={video.id} className="video-card" onClick={() => handleVideoClick(video.url)}>
            <div className="video-thumbnail">
              <Image
                src={video.thumbnail || "/placeholder.svg"}
                alt={video.title}
                width={350}
                height={200}
                className="thumbnail-image"
                onError={(e) => {
                  // Fallback to placeholder if YouTube thumbnail fails to load
                  const target = e.target as HTMLImageElement
                  target.src = `/placeholder.svg?height=200&width=350&query=${encodeURIComponent(video.title)}`
                }}
              />
              <div className="play-overlay">
                <div className="youtube-logo">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </div>
                <div className="play-button">
                  <svg width="68" height="48" viewBox="0 0 68 48" fill="none">
                    <path
                      d="M66.52 7.74c-.78-2.93-2.49-5.24-5.42-6.02C55.79.13 34 0 34 0S12.21.13 6.9 1.72c-2.93.78-4.63 3.09-5.42 6.02C.13 13.05 0 24 0 24s0 3.93 1.48 16.26c.78 2.93 2.49 5.24 5.42 6.02C12.21 47.87 34 48 34 48s21.79 0 27.1-1.72c2.93-.78 4.64-3.09 5.42-6.02C67.87 34.95 68 24 68 24s-.13-10.95-1.48-16.26z"
                      fill="#f00"
                    />
                    <path d="M27 34.5l18-10.5L27 13.5v21z" fill="#fff" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="video-title">
              <div className="channel-logo">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" fill="#333" />
                  <text x="12" y="16" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">
                    YT
                  </text>
                </svg>
              </div>
              <span>{video.title}</span>
              <div className="video-options">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                </svg>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="navigation-controls">
        <button
          className={`nav-button ${currentIndex === 0 ? "disabled" : ""}`}
          onClick={prevVideos}
          disabled={currentIndex === 0}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
          </svg>
        </button>
        <button
          className={`nav-button ${currentIndex + videosPerPage >= videos.length ? "disabled" : ""}`}
          onClick={nextVideos}
          disabled={currentIndex + videosPerPage >= videos.length}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z" />
          </svg>
        </button>
      </div>

      <style jsx>{`
        .video-showcase {
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2rem;
        }

        .videos-container {
          display: flex;
          gap: 1rem;
          justify-content: center;
          margin-bottom: 2rem;
          flex-wrap: wrap;
        }

        .video-card {
          flex: 1;
          max-width: 350px;
          cursor: pointer;
          transition: transform 0.3s ease;
          min-width: 280px;
        }

        .video-card:hover {
          transform: translateY(-5px);
        }

        .video-thumbnail {
          position: relative;
          border-radius: 12px;
          overflow: hidden;
          background: #000;
          aspect-ratio: 16/9;
        }

        .thumbnail-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .play-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(0, 0, 0, 0.3);
        }

        .youtube-logo {
          position: absolute;
          top: 12px;
          left: 12px;
        }

        .play-button {
          transition: transform 0.3s ease;
        }

        .video-card:hover .play-button {
          transform: scale(1.1);
        }

        .video-title {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 12px 0;
          color: #333;
        }

        .channel-logo {
          flex-shrink: 0;
          margin-top: 2px;
        }

        .video-title span {
          flex: 1;
          font-size: 14px;
          font-weight: 500;
          line-height: 1.4;
          color: #333;
        }

        .video-options {
          flex-shrink: 0;
          color: #666;
          cursor: pointer;
          padding: 4px;
          border-radius: 50%;
          transition: background-color 0.3s ease;
        }

        .video-options:hover {
          background-color: #f0f0f0;
        }

        .navigation-controls {
          display: flex;
          justify-content: center;
          gap: 1rem;
        }

        .nav-button {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          border: 1px solid #ddd;
          background: white;
          color: #333;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .nav-button:hover:not(.disabled) {
          background: #f0f0f0;
          transform: scale(1.05);
        }

        .nav-button.disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        @media (max-width: 480px) {
          .video-showcase {
            padding: 0 1rem;
          }
        }
      `}</style>
    </div>
  )
}
