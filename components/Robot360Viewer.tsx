"use client"

import type React from "react"

import { useState, useEffect, useRef, useCallback } from "react"
import Image from "next/image"

interface Robot360ViewerProps {
  images: string[]
  alt: string
  width?: number
  height?: number
  autoRotate?: boolean
  rotationSpeed?: number
  className?: string
}

export default function Robot360Viewer({
  images,
  alt,
  width = 400,
  height = 400,
  autoRotate = false,
  rotationSpeed = 2500,
  className = "",
}: Robot360ViewerProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [isAutoRotating, setIsAutoRotating] = useState(autoRotate)
  const [isLoading, setIsLoading] = useState(true)
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set())
  const [zoom, setZoom] = useState(1)
  const [panX, setPanX] = useState(0)
  const [panY, setPanY] = useState(0)
  const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 })
  const [rotationAngle, setRotationAngle] = useState(0)
  const [isPanning, setIsPanning] = useState(false)

  const containerRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  const autoRotateRef = useRef<NodeJS.Timeout>()
  const animationRef = useRef<number>()

  const MIN_ZOOM = 0.5
  const MAX_ZOOM = 4
  const ROTATION_SENSITIVITY = 2
  const PAN_SENSITIVITY = 1

  // Preload all images
  useEffect(() => {
    const preloadImages = async () => {
      const imagePromises = images.map((src, index) => {
        return new Promise<number>((resolve, reject) => {
          const img = new window.Image()
          img.onload = () => resolve(index)
          img.onerror = reject
          img.src = src
        })
      })

      try {
        const loadedIndices = await Promise.all(imagePromises)
        setLoadedImages(new Set(loadedIndices))
        setIsLoading(false)
      } catch (error) {
        console.error("Error preloading images:", error)
        setIsLoading(false)
      }
    }

    preloadImages()
  }, [images])

  // Convert rotation angle to image index
  const getImageIndexFromAngle = useCallback(
    (angle: number) => {
      const normalizedAngle = ((angle % 360) + 360) % 360
      const imageIndex = Math.round((normalizedAngle / 360) * (images.length - 1))
      return imageIndex % images.length
    },
    [images.length],
  )

  // Auto rotation effect
  useEffect(() => {
    if (isAutoRotating && !isDragging && !isLoading) {
      autoRotateRef.current = setInterval(() => {
        setRotationAngle((prev) => {
          const newAngle = prev + 1
          const newIndex = getImageIndexFromAngle(newAngle)
          setCurrentImageIndex(newIndex)
          return newAngle
        })
      }, rotationSpeed / 360)
    } else {
      if (autoRotateRef.current) {
        clearInterval(autoRotateRef.current)
      }
    }

    return () => {
      if (autoRotateRef.current) {
        clearInterval(autoRotateRef.current)
      }
    }
  }, [isAutoRotating, isDragging, isLoading, rotationSpeed, getImageIndexFromAngle])

  // Handle mouse down
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      const rect = containerRef.current?.getBoundingClientRect()
      if (!rect) return

      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      if (e.shiftKey || e.ctrlKey || zoom > 1) {
        // Pan mode
        setIsPanning(true)
        setLastMousePos({ x: e.clientX, y: e.clientY })
      } else {
        // Rotation mode
        setIsDragging(true)
        setLastMousePos({ x, y })
      }

      setIsAutoRotating(false)

      if (containerRef.current) {
        containerRef.current.style.cursor = e.shiftKey || e.ctrlKey || zoom > 1 ? "grabbing" : "grabbing"
      }
    },
    [zoom],
  )

  // Handle mouse move
  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()

      if (isPanning) {
        // Pan the image
        const deltaX = e.clientX - lastMousePos.x
        const deltaY = e.clientY - lastMousePos.y

        setPanX((prev) => prev + deltaX * PAN_SENSITIVITY)
        setPanY((prev) => prev + deltaY * PAN_SENSITIVITY)
        setLastMousePos({ x: e.clientX, y: e.clientY })
      } else if (isDragging) {
        // Rotate based on horizontal mouse movement
        const centerX = rect.width / 2
        const currentX = e.clientX - rect.left
        const deltaX = currentX - lastMousePos.x

        setRotationAngle((prev) => {
          const newAngle = prev + deltaX * ROTATION_SENSITIVITY
          const newIndex = getImageIndexFromAngle(newAngle)
          setCurrentImageIndex(newIndex)
          return newAngle
        })

        setLastMousePos({ x: currentX, y: lastMousePos.y })
      }
    },
    [isDragging, isPanning, lastMousePos, getImageIndexFromAngle],
  )

  // Handle mouse up
  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
    setIsPanning(false)
    if (containerRef.current) {
      containerRef.current.style.cursor = "grab"
    }
  }, [])

  // Handle mouse leave
  const handleMouseLeave = useCallback(() => {
    setIsDragging(false)
    setIsPanning(false)
    if (containerRef.current) {
      containerRef.current.style.cursor = "grab"
    }
  }, [])

  // Handle wheel zoom
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault()
    const delta = e.deltaY > 0 ? -0.1 : 0.1
    setZoom((prev) => Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, prev + delta)))
  }, [])

  // Handle touch events for mobile
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    e.preventDefault()
    if (e.touches.length === 1) {
      const touch = e.touches[0]
      const rect = containerRef.current?.getBoundingClientRect()
      if (!rect) return

      const x = touch.clientX - rect.left
      const y = touch.clientY - rect.top

      setIsDragging(true)
      setLastMousePos({ x, y })
      setIsAutoRotating(false)
    } else if (e.touches.length === 2) {
      // Handle pinch zoom
      const touch1 = e.touches[0]
      const touch2 = e.touches[1]
      const distance = Math.sqrt(
        Math.pow(touch2.clientX - touch1.clientX, 2) + Math.pow(touch2.clientY - touch1.clientY, 2),
      )
      setLastMousePos({ x: distance, y: 0 })
    }
  }, [])

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      e.preventDefault()
      if (!containerRef.current) return

      if (e.touches.length === 1 && isDragging) {
        const touch = e.touches[0]
        const rect = containerRef.current.getBoundingClientRect()
        const currentX = touch.clientX - rect.left
        const deltaX = currentX - lastMousePos.x

        setRotationAngle((prev) => {
          const newAngle = prev + deltaX * ROTATION_SENSITIVITY
          const newIndex = getImageIndexFromAngle(newAngle)
          setCurrentImageIndex(newIndex)
          return newAngle
        })

        setLastMousePos({ x: currentX, y: lastMousePos.y })
      } else if (e.touches.length === 2) {
        // Handle pinch zoom
        const touch1 = e.touches[0]
        const touch2 = e.touches[1]
        const distance = Math.sqrt(
          Math.pow(touch2.clientX - touch1.clientX, 2) + Math.pow(touch2.clientY - touch1.clientY, 2),
        )
        const deltaDistance = distance - lastMousePos.x
        const zoomDelta = deltaDistance * 0.01

        setZoom((prev) => Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, prev + zoomDelta)))
        setLastMousePos({ x: distance, y: 0 })
      }
    },
    [isDragging, lastMousePos, getImageIndexFromAngle],
  )

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false)
    setIsPanning(false)
  }, [])

  // Reset view
  const resetView = useCallback(() => {
    setZoom(1)
    setPanX(0)
    setPanY(0)
    setRotationAngle(0)
    setCurrentImageIndex(0)
  }, [])

  // Toggle auto rotation
  const toggleAutoRotate = useCallback(() => {
    setIsAutoRotating(!isAutoRotating)
  }, [isAutoRotating])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!containerRef.current?.contains(document.activeElement)) return

      switch (e.key) {
        case "ArrowLeft":
          e.preventDefault()
          setRotationAngle((prev) => {
            const newAngle = prev - 10
            const newIndex = getImageIndexFromAngle(newAngle)
            setCurrentImageIndex(newIndex)
            return newAngle
          })
          setIsAutoRotating(false)
          break
        case "ArrowRight":
          e.preventDefault()
          setRotationAngle((prev) => {
            const newAngle = prev + 10
            const newIndex = getImageIndexFromAngle(newAngle)
            setCurrentImageIndex(newIndex)
            return newAngle
          })
          setIsAutoRotating(false)
          break
        case "=":
        case "+":
          e.preventDefault()
          setZoom((prev) => Math.min(MAX_ZOOM, prev + 0.2))
          break
        case "-":
          e.preventDefault()
          setZoom((prev) => Math.max(MIN_ZOOM, prev - 0.2))
          break
        case "0":
          e.preventDefault()
          resetView()
          break
        case " ":
          e.preventDefault()
          toggleAutoRotate()
          break
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [getImageIndexFromAngle, resetView, toggleAutoRotate])

  if (isLoading) {
    return (
      <div className={`robot-360-viewer ${className}`} style={{ width, height }}>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading 360° view...</p>
        </div>
        <style jsx>{`
          .robot-360-viewer {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 1rem;
          }
          .loading-container {
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            background: #f8f9fa;
            border-radius: 12px;
            border: 2px solid #e1e5e9;
          }
          .loading-spinner {
            width: 40px;
            height: 40px;
            border: 4px solid #e1e5e9;
            border-top: 4px solid #4285f4;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin-bottom: 1rem;
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    )
  }

  return (
    <div className={`robot-360-viewer ${className}`} style={{ width, height }}>
      <div
        ref={containerRef}
        className="viewer-container"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onWheel={handleWheel}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        tabIndex={0}
        role="img"
        aria-label={`${alt} - 360 degree view, image ${currentImageIndex + 1} of ${images.length}, zoom ${Math.round(zoom * 100)}%`}
        style={{
          width: "100%",
          height: "100%",
          position: "relative",
          cursor: isDragging || isPanning ? "grabbing" : "grab",
          userSelect: "none",
          overflow: "hidden",
          borderRadius: "12px",
          background: "#f8f9fa",
          outline: "none",
          touchAction: "none",
        }}
      >
        <div
          className="image-container"
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transform: `translate(${panX}px, ${panY}px) scale(${zoom})`,
            transition: isDragging || isPanning ? "none" : "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          <Image
            ref={imageRef}
            src={images[currentImageIndex] || "/placeholder.svg"}
            alt={`${alt} - View ${currentImageIndex + 1}`}
            width={width}
            height={height}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              pointerEvents: "none",
              maxWidth: "none",
              maxHeight: "none",
            }}
            priority
            quality={90}
          />
        </div>

        {/* Enhanced Controls */}
        <div className="controls-overlay">
          {/* 360° indicator */}
          <div className="rotation-indicator">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" opacity="0.6" />
              <path d="M8 12l2-2 2 2 2-2 2 2" stroke="currentColor" strokeWidth="2" fill="none" />
            </svg>
            <span>360°</span>
          </div>

          {/* Zoom controls */}
          <div className="zoom-controls">
            <button
              className="zoom-btn"
              onClick={() => setZoom((prev) => Math.min(MAX_ZOOM, prev + 0.2))}
              title="Zoom in (+)"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
              </svg>
            </button>
            <span className="zoom-level">{Math.round(zoom * 100)}%</span>
            <button
              className="zoom-btn"
              onClick={() => setZoom((prev) => Math.max(MIN_ZOOM, prev - 0.2))}
              title="Zoom out (-)"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8z" />
              </svg>
            </button>
          </div>

          {/* Auto-rotate toggle */}
          <button
            className="auto-rotate-btn"
            onClick={toggleAutoRotate}
            title={isAutoRotating ? "Stop auto rotation" : "Start auto rotation"}
            aria-label={isAutoRotating ? "Stop auto rotation" : "Start auto rotation"}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 6v3l4-4-4-4v3c-4.42 0-8 3.58-8 8 0 1.57.46 3.03 1.24 4.26L6.7 14.8c-.45-.83-.7-1.79-.7-2.8 0-3.31 2.69-6 6-6z"
                fill="currentColor"
              />
              <path
                d="M18.76 7.74L17.3 9.2c.44.84.7 1.79.7 2.8 0 3.31-2.69 6-6 6v-3l-4 4 4 4v-3c4.42 0 8-3.58 8-8 0-1.57-.46-3.03-1.24-4.26z"
                fill="currentColor"
              />
            </svg>
          </button>

          {/* Reset button */}
          <button className="reset-btn" onClick={resetView} title="Reset view (0)">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z" />
              <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z" />
            </svg>
          </button>
        </div>

        {/* Progress indicator */}
        <div className="progress-indicator">
          <div
            className="progress-bar"
            style={{
              width: `${((((rotationAngle % 360) + 360) % 360) / 360) * 100}%`,
              transition: "width 0.1s ease",
            }}
          />
        </div>
      </div>

      {/* Enhanced instructions */}
      <div className="instructions">
        <div className="instruction-group">
          <strong>Rotate:</strong> Click & drag horizontally
        </div>
        <div className="instruction-group">
          <strong>Zoom:</strong> Mouse wheel or +/- keys
        </div>
        <div className="instruction-group">
          <strong>Pan:</strong> Shift + drag (when zoomed)
        </div>
        <div className="instruction-group">
          <strong>Reset:</strong> Press 0 key
        </div>
      </div>

      <style jsx>{`
        .robot-360-viewer {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
        }

        .viewer-container {
          position: relative;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
          border: 2px solid #e1e5e9;
          transition: box-shadow 0.3s ease;
        }

        .viewer-container:hover {
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
        }

        .viewer-container:focus {
          outline: 2px solid #4285f4;
          outline-offset: 2px;
        }

        .image-container {
          transform-origin: center center;
        }

        .controls-overlay {
          position: absolute;
          top: 12px;
          left: 12px;
          right: 12px;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          pointer-events: none;
          z-index: 10;
        }

        .controls-overlay > * {
          pointer-events: all;
        }

        .rotation-indicator {
          display: flex;
          align-items: center;
          gap: 6px;
          background: rgba(0, 0, 0, 0.8);
          color: white;
          padding: 8px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          backdrop-filter: blur(10px);
          animation: pulse 2s infinite;
        }

        .zoom-controls {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(0, 0, 0, 0.8);
          color: white;
          padding: 8px 12px;
          border-radius: 20px;
          backdrop-filter: blur(10px);
        }

        .zoom-btn {
          background: none;
          border: none;
          color: white;
          cursor: pointer;
          padding: 4px;
          border-radius: 4px;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .zoom-btn:hover {
          background: rgba(255, 255, 255, 0.2);
        }

        .zoom-level {
          font-size: 12px;
          font-weight: 600;
          min-width: 40px;
          text-align: center;
        }

        .auto-rotate-btn {
          background: ${isAutoRotating ? "#4285f4" : "rgba(0, 0, 0, 0.8)"};
          color: white;
          border: none;
          padding: 10px;
          border-radius: 50%;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          display: flex;
          align-items: center;
          justify-content: center;
          backdrop-filter: blur(10px);
          animation: ${isAutoRotating ? "rotate 2s linear infinite" : "none"};
        }

        .auto-rotate-btn:hover {
          background: ${isAutoRotating ? "#3367d6" : "rgba(0, 0, 0, 0.9)"};
          transform: scale(1.1);
        }

        .reset-btn {
          background: rgba(0, 0, 0, 0.8);
          color: white;
          border: none;
          padding: 8px;
          border-radius: 50%;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          backdrop-filter: blur(10px);
        }

        .reset-btn:hover {
          background: rgba(0, 0, 0, 0.9);
          transform: scale(1.1);
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }

        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .progress-indicator {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: rgba(255, 255, 255, 0.3);
          overflow: hidden;
        }

        .progress-bar {
          height: 100%;
          background: linear-gradient(90deg, #4285f4, #34a853);
          border-radius: 0 3px 3px 0;
        }

        .instructions {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 0.5rem;
          text-align: center;
          font-size: 12px;
          color: #666;
          max-width: 600px;
          line-height: 1.4;
        }

        .instruction-group {
          padding: 0.25rem;
        }

        .instruction-group strong {
          color: #4285f4;
          font-weight: 600;
        }

        @media (max-width: 768px) {
          .controls-overlay {
            top: 8px;
            left: 8px;
            right: 8px;
          }
          
          .rotation-indicator,
          .zoom-controls {
            font-size: 11px;
            padding: 6px 10px;
          }

          .auto-rotate-btn,
          .reset-btn {
            padding: 8px;
          }

          .instructions {
            grid-template-columns: repeat(2, 1fr);
            font-size: 11px;
            gap: 0.25rem;
          }
        }

        @media (max-width: 480px) {
          .instructions {
            grid-template-columns: 1fr;
            font-size: 10px;
          }

          .controls-overlay {
            flex-wrap: wrap;
            gap: 8px;
          }
        }
      `}</style>
    </div>
  )
}
